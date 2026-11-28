import { HttpEventType, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CpuArchitecture, TargetPlatform } from './application';
import { ReleaseService } from './release-service';

describe('ReleaseService', () => {
  let service: ReleaseService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ReleaseService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('creates a release under the developer application', () => {
    const input = { platform: TargetPlatform.MacOs, versionId: '1.0', releaseNotes: 'Notes' };
    service.createRelease('app', input).subscribe();
    const req = http.expectOne('/api/developers/applications/app/releases');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush({});
  });

  it('uploads the file as the raw body with its metadata in the query string', () => {
    const file = new File([new Uint8Array([1, 2, 3])], 'My App.dmg');
    const events: HttpEventType[] = [];
    service
      .uploadVariant('app', 'rel', file, [CpuArchitecture.X64, CpuArchitecture.Arm64])
      .subscribe((e) => events.push(e.type));

    const req = http.expectOne((r) => r.url === '/api/developers/applications/app/releases/rel/variants');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(file);
    expect(req.request.headers.get('Content-Type')).toBe('application/octet-stream');
    expect(req.request.params.get('fileName')).toBe('My App.dmg');
    expect(req.request.params.getAll('cpuArchitectures')).toEqual(['2', '3']);
    expect(req.request.reportProgress).toBeTrue();
    req.flush({ id: 'v' });
    expect(events).toContain(HttpEventType.Response);
  });

  it('deletes a binary', () => {
    service.deleteVariant('app', 'rel', 'v').subscribe();
    const req = http.expectOne('/api/developers/applications/app/releases/rel/variants/v');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
