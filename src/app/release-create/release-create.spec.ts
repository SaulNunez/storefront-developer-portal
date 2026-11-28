import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { TargetPlatform } from '../application';
import { ReleaseCreate } from './release-create';

describe('ReleaseCreate', () => {
  let fixture: ComponentFixture<ReleaseCreate>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseCreate],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { params: { applicationId: 'app', platform: 'mac' } } } },
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ReleaseCreate);
    fixture.detectChanges();
  });

  it('creates a Mac release and opens it to add binaries', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate');
    const element: HTMLElement = fixture.nativeElement;
    const version = element.querySelector<HTMLInputElement>('#versionId')!;
    version.value = ' 2.0 ';
    version.dispatchEvent(new Event('input'));
    element.querySelector<HTMLButtonElement>('button[type=submit]')!.click();

    const req = http.expectOne('/api/developers/applications/app/releases');
    expect(req.request.body).toEqual({ platform: TargetPlatform.MacOs, versionId: '2.0', releaseNotes: '' });
    req.flush({ id: 'rel' });

    expect(navigate).toHaveBeenCalledWith(['/application', 'app', 'release', 'mac', 'rel']);
  });
});
