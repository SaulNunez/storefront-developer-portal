import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Application } from '../application';
import { ApplicationService } from '../application-service';

@Component({
  selector: 'app-application-details',
  imports: [RouterLink],
  templateUrl: './application-details.html',
  styleUrl: './application-details.css',
})
export class ApplicationDetails {
  private applicationService = inject(ApplicationService);
  private route = inject(ActivatedRoute);

  protected application = signal<Application | null>(null);
  protected loading = signal(true);

  constructor() {
    const { applicationId } = this.route.snapshot.params;
    this.applicationService.getApplicationById(applicationId).subscribe((value) => {
      this.application.set(value);
      this.loading.set(false);
    });
  }
}
