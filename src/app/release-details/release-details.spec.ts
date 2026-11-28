import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { CpuArchitecture, Release, TargetPlatform } from '../application';
import { ReleaseDetails } from './release-details';

describe('ReleaseDetails', () => {
  let fixture: ComponentFixture<ReleaseDetails>;
  let http: HttpTestingController;

  const release: Release = {
    id: 'rel',
    applicationId: 'app',
    platform: TargetPlatform.MacOs,
    versionId: '1.0',
    releaseNotes: 'First',
    createdAt: '2026-11-28T00:00:00Z',
    variants: [
      {
        id: 'v1',
        objectKeyInStorage: '',
        cpuArchitectures: [CpuArchitecture.PowerPC, CpuArchitecture.X86],
        screenDensity: null,
        minOsVersion: null,
        language: null,
        fileSizeBytes: 2048,
        fileName: 'Classic.sit',
        sha256: 'abc',
        uploadedAt: '2026-11-28T00:00:00Z',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseDetails],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { params: { applicationId: 'app', releaseId: 'rel' } } } },
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ReleaseDetails);
    http.expectOne('/api/developers/applications/app/releases/rel').flush(release);
    fixture.detectChanges();
  });

  it('shows one slot per Mac CPU with the uploaded binary in its slot', () => {
    const cards = [...fixture.nativeElement.querySelectorAll('.card')] as HTMLElement[];
    expect(cards.length).toBe(6);
    const ppcIntel = cards.find((c) => c.textContent?.includes('Universal (PowerPC/Intel)'))!;
    expect(ppcIntel.textContent).toContain('Classic.sit');
    expect(ppcIntel.textContent).toContain('2.0 KB');
  });

  it('adds a newly uploaded binary to its slot', () => {
    fixture.componentInstance['onUploaded']({ ...release.variants[0], id: 'v2', fileName: 'App68k.hqx', cpuArchitectures: [CpuArchitecture.M68k] });
    fixture.detectChanges();

    const m68k = ([...fixture.nativeElement.querySelectorAll('.card')] as HTMLElement[]).find((c) =>
      c.textContent?.includes('Motorola 68k'),
    )!;
    expect(m68k.textContent).toContain('App68k.hqx');
  });
});
