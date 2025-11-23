import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppCategory } from './app-category';
import { withCache } from '@ngneat/cashew';

@Injectable({
  providedIn: 'root',
})
export class AppCategoriesService {
  private httpClient = inject(HttpClient);
  
  getApplicationCategories() {
    return this.httpClient.get<AppCategory[]>('/api/app-categories', {
      context: withCache()
    });
  }
}
