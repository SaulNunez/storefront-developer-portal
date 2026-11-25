import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Application, ApplicationInput } from './application';
import { environment } from '../environments/environment';

/**
 * The signed-in developer's own applications. These change as the developer edits them,
 * so unlike app categories they are not cached.
 */
@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private httpClient = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/developers/applications`;

  getSubmittedApplications(take = 10, page = 1) {
    return this.httpClient.get<Application[]>(this.baseUrl, { params: { take, page } });
  }

  getApplicationById(applicationId: string) {
    return this.httpClient.get<Application>(`${this.baseUrl}/${applicationId}`);
  }

  createApplication(input: ApplicationInput) {
    return this.httpClient.post<Application>(this.baseUrl, input);
  }

  /** Uploads a PNG store icon. The backend stores it in object storage and returns the updated application. */
  uploadIcon(applicationId: string, icon: File) {
    const formData = new FormData();
    formData.append('icon', icon);
    return this.httpClient.post<Application>(`${this.baseUrl}/${applicationId}/icon`, formData);
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
