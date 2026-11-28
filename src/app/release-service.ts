import { HttpClient, HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { CpuArchitecture, Release, ReleaseInput, TargetPlatform, Variant } from './application';

/** Releases and binaries of the signed-in developer's own applications. */
@Injectable({
  providedIn: 'root',
})
export class ReleaseService {
  private httpClient = inject(HttpClient);

  private releasesUrl(applicationId: string) {
    return `${environment.apiUrl}/developers/applications/${applicationId}/releases`;
  }

  getReleases(applicationId: string, platform?: TargetPlatform, take = 100, page = 1) {
    const params: Record<string, number> = { take, page };
    if (platform !== undefined) {
      params['platform'] = platform;
    }
    return this.httpClient.get<Release[]>(this.releasesUrl(applicationId), { params });
  }

  getRelease(applicationId: string, releaseId: string) {
    return this.httpClient.get<Release>(`${this.releasesUrl(applicationId)}/${releaseId}`);
  }

  createRelease(applicationId: string, input: ReleaseInput) {
    return this.httpClient.post<Release>(this.releasesUrl(applicationId), input);
  }

  /** Deletes the release and every binary in it. */
  deleteRelease(applicationId: string, releaseId: string) {
    return this.httpClient.delete<void>(`${this.releasesUrl(applicationId)}/${releaseId}`);
  }

  /**
   * Uploads one binary. The file is the raw request body, which the backend streams to object storage;
   * the metadata goes in the query string. Emits upload progress events, then the response.
   */
  uploadVariant(
    applicationId: string,
    releaseId: string,
    file: File,
    cpuArchitectures: CpuArchitecture[],
  ): Observable<HttpEvent<Variant>> {
    return this.httpClient.post<Variant>(`${this.releasesUrl(applicationId)}/${releaseId}/variants`, file, {
      params: { fileName: file.name, cpuArchitectures },
      headers: { 'Content-Type': 'application/octet-stream' },
      reportProgress: true,
      observe: 'events',
    });
  }

  deleteVariant(applicationId: string, releaseId: string, variantId: string) {
    return this.httpClient.delete<void>(`${this.releasesUrl(applicationId)}/${releaseId}/variants/${variantId}`);
  }
}
