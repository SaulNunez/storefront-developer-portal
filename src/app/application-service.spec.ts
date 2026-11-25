import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApplicationService } from './application-service';

describe('ApplicationService', () => {
  let service: ApplicationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ApplicationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists the developer applications', () => {
    service.getSubmittedApplications().subscribe();
    const req = http.expectOne((r) => r.url === '/api/developers/applications');
    expect(req.request.params.get('page')).toBe('1');
    req.flush([]);
  });

  it('posts a new application as JSON', () => {
    const input = { applicationName: 'A', shortDescription: 'B', applicationDescription: 'C', categoryId: 3 };
    service.createApplication(input).subscribe();
    const req = http.expectOne('/api/developers/applications');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush({});
  });

  it('uploads the icon as multipart form data under the "icon" field', () => {
    const icon = new File([new Uint8Array([1])], 'icon.png', { type: 'image/png' });
    service.uploadIcon('abc', icon).subscribe();
    const req = http.expectOne('/api/developers/applications/abc/icon');
    expect(req.request.method).toBe('POST');
    expect((req.request.body as FormData).get('icon')).toEqual(icon);
    req.flush({});
  });
});
