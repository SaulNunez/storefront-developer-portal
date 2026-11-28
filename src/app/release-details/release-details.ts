import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CpuArchitecture, Release, Variant } from '../application';
import { describeError } from '../application-create/application-create';
import { BinarySlot } from '../binary-slot/binary-slot';
import { BinarySlot as Slot, platformByValue, variantForSlot } from '../release-platforms';
import { ReleaseService } from '../release-service';

/** A release and its binaries, one upload slot per CPU the platform supports. */
@Component({
  selector: 'app-release-details',
  imports: [BinarySlot, DatePipe, RouterLink],
  templateUrl: './release-details.html',
  styleUrl: './release-details.css',
})
export class ReleaseDetails {
  private releaseService = inject(ReleaseService);
  private router = inject(Router);

  protected readonly applicationId: string;
  protected readonly releaseId: string;
  protected release = signal<Release | null>(null);
  protected loadError = signal<string | null>(null);
  protected deleting = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected platform = computed(() => {
    const release = this.release();
    return release ? platformByValue(release.platform) : undefined;
  });

  /** Each of the platform's slots with the binary uploaded to it, if any. */
  protected slots = computed(() => {
    const variants = this.release()?.variants ?? [];
    return (this.platform()?.slots ?? []).map((slot) => ({ slot, variant: variantForSlot(slot, variants) }));
  });

  /** Binaries that fit none of the slots (for example uploaded through the API), so they can still be deleted. */
  protected otherBinaries = computed(() => {
    const inSlots = new Set(this.slots().map((s) => s.variant?.id));
    return (this.release()?.variants ?? [])
      .filter((v) => !inSlots.has(v.id))
      .map((variant) => ({ slot: slotFor(variant), variant }));
  });

  constructor() {
    const params = inject(ActivatedRoute).snapshot.params;
    this.applicationId = params['applicationId'];
    this.releaseId = params['releaseId'];
    this.releaseService.getRelease(this.applicationId, this.releaseId).subscribe({
      next: (release) => this.release.set(release),
      error: (error: unknown) => this.loadError.set(describeError(error)),
    });
  }

  protected onUploaded(variant: Variant) {
    this.release.update((r) => r && { ...r, variants: [...r.variants, variant] });
  }

  protected onDeleted(variantId: string) {
    this.release.update((r) => r && { ...r, variants: r.variants.filter((v) => v.id !== variantId) });
  }

  protected deleteRelease() {
    const release = this.release();
    if (!release || this.deleting() || !confirm(`Delete version ${release.versionId} and all of its binaries?`)) {
      return;
    }

    this.deleting.set(true);
    this.errorMessage.set(null);
    this.releaseService.deleteRelease(this.applicationId, this.releaseId).subscribe({
      next: () => this.router.navigate(['/application', this.applicationId]),
      error: (error: unknown) => {
        this.deleting.set(false);
        this.errorMessage.set(describeError(error));
      },
    });
  }
}

const cpuNames = Object.fromEntries(Object.entries(CpuArchitecture).map(([name, value]) => [value, name]));

function slotFor(variant: Variant): Slot {
  return { label: variant.cpuArchitectures.map((cpu) => cpuNames[cpu]).join(' + '), cpuArchitectures: variant.cpuArchitectures };
}
