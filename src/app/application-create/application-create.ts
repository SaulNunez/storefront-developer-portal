import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { AppCategoriesService } from '../app-categories-service';
import { AppCategory } from '../app-category';
import { ApplicationService } from '../application-service';
import { Application } from '../application';

/** Matches the backend's limit on store icons. */
export const maxIconBytes = 2 * 1024 * 1024;

@Component({
  selector: 'app-application-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './application-create.html',
  styleUrl: './application-create.css',
})
export class ApplicationCreate {
  private appCategoryService = inject(AppCategoriesService);
  private applicationService = inject(ApplicationService);
  private router = inject(Router);

  protected loadingAppCategories = signal(true);
  protected appCategoryList = signal<AppCategory[]>([]);
  protected icon = signal<File | null>(null);
  protected iconError = signal<string | null>(null);
  protected submitting = signal(false);
  protected errorMessage = signal<string | null>(null);
  /** Set when the application was created but its icon upload failed. */
  protected createdWithoutIcon = signal<Application | null>(null);

  protected form = inject(FormBuilder).nonNullable.group({
    applicationName: ['', [Validators.required, Validators.maxLength(200)]],
    shortDescription: ['', [Validators.required, Validators.maxLength(300)]],
    applicationDescription: ['', Validators.required],
    categoryId: [0, Validators.min(1)],
  });

  constructor() {
    this.appCategoryService.getApplicationCategories().subscribe({
      next: (value) => {
        this.loadingAppCategories.set(false);
        this.appCategoryList.set(value);
      },
      error: () => {
        this.loadingAppCategories.set(false);
        this.errorMessage.set('Could not load the app categories. Reload the page to try again.');
      },
    });
  }

  protected onIconSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.iconError.set(file ? validateIcon(file) : null);
    this.icon.set(file);
  }

  protected isInvalid(control: keyof typeof this.form.controls) {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || c.dirty);
  }

  protected submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.iconError() || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    const icon = this.icon();

    this.applicationService
      .createApplication(this.form.getRawValue())
      .pipe(
        switchMap((created): Observable<Application | null> => {
          if (!icon) {
            return of(created);
          }
          return this.applicationService.uploadIcon(created.applicationId, icon).pipe(
            // The application exists either way, so report the failed icon without losing it.
            catchError((error: unknown) => {
              this.createdWithoutIcon.set(created);
              this.errorMessage.set(`The application was created, but the icon upload failed. ${describeError(error)}`);
              return of(null);
            }),
          );
        }),
      )
      .subscribe({
        next: (application) => {
          this.submitting.set(false);
          if (application) {
            this.router.navigate(['/application', application.applicationId]);
          }
        },
        error: (error: unknown) => {
          this.submitting.set(false);
          this.errorMessage.set(describeError(error));
        },
      });
  }
}

/** Client-side check so the developer hears about a bad icon before submitting. The backend checks again. */
export function validateIcon(file: File): string | null {
  if (file.type !== 'image/png') {
    return 'The icon must be a PNG image.';
  }
  if (file.size > maxIconBytes) {
    return 'The icon must be at most 2 MB.';
  }
  return null;
}

/** Turns an API error into a sentence for the developer. */
export function describeError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 403) {
      return 'Your account does not have the Developer role, so it cannot publish applications.';
    }
    if (error.status === 400) {
      if (typeof error.error === 'string' && error.error) {
        return error.error;
      }
      const errors = error.error?.errors as Record<string, string[]> | undefined;
      if (errors) {
        return Object.values(errors).flat().join(' ');
      }
      return 'Some of the details are not valid.';
    }
  }
  return 'Something went wrong. Please try again.';
}
