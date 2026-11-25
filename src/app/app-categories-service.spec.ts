import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { AppCategoriesService } from './app-categories-service';

describe('AppCategoriesService', () => {
  let service: AppCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
    service = TestBed.inject(AppCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
