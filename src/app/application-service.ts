import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Application } from './application';
import { withCache } from '@ngneat/cashew';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private httpClient = inject(HttpClient);
  
  getSubmittedApplications() {
    return this.httpClient.get<Application[]>('/api/developer/application', {
      context: withCache()
    });
  }
  getApplicationById(applicationId: string){
    return this.httpClient.get<Application>(`/api/developer/application/${applicationId}`, {
      context: withCache()
    });
  }

  getWindowsReleaseById(applicationId: string, releaseId: string) {

  }

  getWindowsReleases(applicationId: string) {

  }

  getMacReleaseById(applicationId: string, releaseId: string) {

  }

  getMacReleases(applicationId: string) {

  }

  getAndroidReleaseById(applicationId: string, releaseId: string) {

  }

  getAndroidReleases(applicationId: string) {

  }
}
