import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Variant } from '../application';
import { describeError } from '../application-create/application-create';
import { BinarySlot as Slot, formatBytes, maxBinaryBytes } from '../release-platforms';
import { ReleaseService } from '../release-service';

/** One CPU slot of a release: the uploaded binary, or a picker to upload one with progress. */
@Component({
  selector: 'app-binary-slot',
  imports: [DatePipe],
  templateUrl: './binary-slot.html',
  styleUrl: './binary-slot.css',
})
export class BinarySlot {
  private releaseService = inject(ReleaseService);

  readonly applicationId = input.required<string>();
  readonly releaseId = input.required<string>();
  readonly slot = input.required<Slot>();
  readonly accept = input('');
  readonly variant = input<Variant | undefined>();

  readonly uploaded = output<Variant>();
  readonly deleted = output<string>();

  protected file = signal<File | null>(null);
  /** 0–100 while uploading, otherwise null. */
  protected progress = signal<number | null>(null);
  protected deleting = signal(false);
  /** A problem with the chosen file, found before uploading. */
  protected fileError = signal<string | null>(null);
  /** A failed upload or delete. */
  protected errorMessage = signal<string | null>(null);
  protected readonly formatBytes = formatBytes;

  private upload?: Subscription;

  constructor() {
    // Leaving the page cancels an upload in flight; the backend then aborts it in storage.
    inject(DestroyRef).onDestroy(() => this.upload?.unsubscribe());
  }

  protected onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.file.set(file);
    this.fileError.set(file ? validateBinary(file) : null);
    this.errorMessage.set(null);
  }

  protected startUpload() {
    const file = this.file();
    if (!file || this.fileError() || this.progress() !== null) {
      return;
    }

    this.progress.set(0);
    this.errorMessage.set(null);
    this.upload = this.releaseService
      .uploadVariant(this.applicationId(), this.releaseId(), file, this.slot().cpuArchitectures)
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress.set(event.total ? Math.round((100 * event.loaded) / event.total) : 0);
          } else if (event.type === HttpEventType.Response && event.body) {
            this.progress.set(null);
            this.file.set(null);
            this.uploaded.emit(event.body);
          }
        },
        error: (error: unknown) => {
          // The picker is redrawn after an upload, so clear the file too: the developer picks it again.
          this.progress.set(null);
          this.file.set(null);
          this.errorMessage.set(describeError(error));
        },
      });
  }

  protected cancelUpload() {
    this.upload?.unsubscribe();
    this.progress.set(null);
    this.file.set(null);
  }

  protected deleteBinary() {
    const variant = this.variant();
    if (!variant || this.deleting() || !confirm(`Delete ${variant.fileName}?`)) {
      return;
    }

    this.deleting.set(true);
    this.errorMessage.set(null);
    this.releaseService.deleteVariant(this.applicationId(), this.releaseId(), variant.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deleted.emit(variant.id);
      },
      error: (error: unknown) => {
        this.deleting.set(false);
        this.errorMessage.set(describeError(error));
      },
    });
  }
}

/** Client-side check so a bad file is caught before it uploads. The backend checks type and contents again. */
export function validateBinary(file: File): string | null {
  if (file.size === 0) {
    return 'The file is empty.';
  }
  if (file.size > maxBinaryBytes) {
    return 'The file must be at most 2 GB.';
  }
  return null;
}
