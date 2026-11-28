import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpuArchitecture, Variant } from '../application';
import { BinarySlot } from './binary-slot';

describe('BinarySlot', () => {
  let fixture: ComponentFixture<BinarySlot>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BinarySlot],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(BinarySlot);
    fixture.componentRef.setInput('applicationId', 'app');
    fixture.componentRef.setInput('releaseId', 'rel');
    fixture.componentRef.setInput('slot', { label: 'PowerPC', cpuArchitectures: [CpuArchitecture.PowerPC] });
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  function chooseFile(file: File) {
    const input = fixture.nativeElement.querySelector('input[type=file]') as HTMLInputElement;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function uploadButton() {
    return [...fixture.nativeElement.querySelectorAll('button')].find(
      (b: HTMLButtonElement) => b.textContent?.trim() === 'Upload',
    ) as HTMLButtonElement;
  }

  it('uploads the chosen file for the slot CPUs and reports the new binary', () => {
    let uploaded: Variant | undefined;
    fixture.componentInstance.uploaded.subscribe((v) => (uploaded = v));

    chooseFile(new File([new Uint8Array([1])], 'App.sit'));
    uploadButton().click();

    const req = http.expectOne((r) => r.url.endsWith('/releases/rel/variants'));
    expect(req.request.params.getAll('cpuArchitectures')).toEqual([String(CpuArchitecture.PowerPC)]);
    req.flush({ id: 'v', fileName: 'App.sit' });
    expect(uploaded?.id).toBe('v');
  });

  it('refuses an empty file before uploading', () => {
    chooseFile(new File([], 'Empty.sit'));

    expect(fixture.nativeElement.textContent).toContain('The file is empty.');
    expect(uploadButton().disabled).toBeTrue();
  });

  it('shows the backend message when the upload is rejected', () => {
    chooseFile(new File([new Uint8Array([1])], 'App.pkg'));
    uploadButton().click();

    http
      .expectOne((r) => r.url.endsWith('/variants'))
      .flush("The file's contents don't match its .pkg extension.", { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain("don't match its .pkg extension");
    // The picker was redrawn empty, so the button waits for a new file.
    expect(uploadButton().disabled).toBeTrue();
  });
});
