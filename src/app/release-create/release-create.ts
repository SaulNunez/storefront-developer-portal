import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { describeError } from '../application-create/application-create';
import { ReleaseService } from '../release-service';
import { platformBySlug } from '../release-platforms';

/** Step one of a release: its version and notes. The binaries are uploaded on the release's own page. */
@Component({
  selector: 'app-release-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './release-create.html',
  styleUrl: './release-create.css',
})
export class ReleaseCreate {
  private releaseService = inject(ReleaseService);
  private router = inject(Router);

  protected readonly applicationId: string;
  protected readonly platform;
  protected submitting = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected form = inject(FormBuilder).nonNullable.group({
    versionId: ['', [Validators.required, Validators.maxLength(100)]],
    releaseNotes: [''],
  });

  constructor() {
    const params = inject(ActivatedRoute).snapshot.params;
    this.applicationId = params['applicationId'];
    this.platform = platformBySlug(params['platform']);
  }

  protected isInvalid(control: keyof typeof this.form.controls) {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || c.dirty);
  }

  protected submit() {
    this.form.markAllAsTouched();
    const platform = this.platform;
    if (!platform || this.form.invalid || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    const { versionId, releaseNotes } = this.form.getRawValue();
    this.releaseService
      .createRelease(this.applicationId, { platform: platform.platform, versionId: versionId.trim(), releaseNotes })
      .subscribe({
        next: (release) => {
          this.submitting.set(false);
          this.router.navigate(['/application', this.applicationId, 'release', platform.slug, release.id]);
        },
        error: (error: unknown) => {
          this.submitting.set(false);
          this.errorMessage.set(describeError(error));
        },
      });
  }
}
