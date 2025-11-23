import { Component, inject, signal } from '@angular/core';
import { ApplicationService } from '../application-service';
import { Application } from '../application';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-application-list',
  imports: [RouterLink],
  templateUrl: './application-list.html',
  styleUrl: './application-list.css',
})
export class ApplicationList {
  protected applicationService = inject(ApplicationService);
  protected isLoading = signal(true);
  protected developerApplications = signal<Application[]>([]);

  
  ngOnInit(){
    this.applicationService.getSubmittedApplications().subscribe((value) => {
      this.isLoading.set(false);
      this.developerApplications.set(value);
    });
  }
}
