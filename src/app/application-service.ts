import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Application } from './application';
import { withCache } from '@ngneat/cashew';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private httpClient = inject(HttpClient);
  
  getApplications() {
    return this.httpClient.get<Application[]>('/api/applications', {
      context: withCache()
    });
  }
}
