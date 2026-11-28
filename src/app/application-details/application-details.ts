import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Application } from '../application';
import { ApplicationService } from '../application-service';
import { platforms } from '../release-platforms';

@Component({
  selector: 'app-application-details',
  imports: [DatePipe, RouterLink],
  templateUrl: './application-details.html',
  styleUrl: './application-details.css',
})
export class ApplicationDetails {
  private applicationService = inject(ApplicationService);
  private route = inject(ActivatedRoute);

  protected application = signal<Application | null>(null);
  protected loading = signal(true);

  /** Windows, Mac and Android, each with its releases, newest first. */
  protected releasesByPlatform = computed(() => {
    const releases = this.application()?.releases ?? [];
    return platforms.map((platform) => ({
      platform,
      releases: releases
        .filter((r) => r.platform === platform.platform)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    }));
  });

  constructor() {
    const { applicationId } = this.route.snapshot.params;
    this.applicationService.getApplicationById(applicationId).subscribe((value) => {
      this.application.set(value);
      this.loading.set(false);
    });
  }
}
