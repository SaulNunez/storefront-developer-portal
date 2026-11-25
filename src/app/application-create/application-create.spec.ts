import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { ApplicationCreate, validateIcon } from './application-create';

describe('ApplicationCreate', () => {
  let component: ApplicationCreate;
  let fixture: ComponentFixture<ApplicationCreate>;
  let http: HttpTestingController;
  let router: Router;

  const created = { applicationId: 'new-id', name: 'My App' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationCreate],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationCreate);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    fixture.detectChanges();
    http.expectOne('/api/appcategories').flush([{ id: 3, name: 'Games' }]);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  function fillForm() {
    // Reach the protected form through an index so the test drives it the way the template does.
    const form = (component as unknown as { form: ApplicationCreate['form'] }).form;
    form.setValue({ applicationName: 'My App', shortDescription: 'Short', applicationDescription: 'Long', categoryId: 3 });
  }

  function submit() {
    (fixture.nativeElement as HTMLElement).querySelector('form')!.dispatchEvent(new Event('submit'));
  }

  function selectIcon(file: File) {
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('#formFile')!;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    input.dispatchEvent(new Event('change'));
  }

  it('does not submit until the form is valid', () => {
    submit();
    http.expectNone('/api/developers/applications');
  });

  it('creates the application and opens it', () => {
    fillForm();
    submit();

    const req = http.expectOne('/api/developers/applications');
    expect(req.request.body.categoryId).toBe(3);
    req.flush(created);

    expect(router.navigate).toHaveBeenCalledWith(['/application', 'new-id']);
  });

  it('uploads the icon after creating the application', () => {
    fillForm();
    selectIcon(new File([new Uint8Array([1])], 'icon.png', { type: 'image/png' }));
    submit();

    http.expectOne('/api/developers/applications').flush(created);
    http.expectOne('/api/developers/applications/new-id/icon').flush(created);

    expect(router.navigate).toHaveBeenCalledWith(['/application', 'new-id']);
  });

  it('keeps the created application when the icon upload fails', () => {
    fillForm();
    selectIcon(new File([new Uint8Array([1])], 'icon.png', { type: 'image/png' }));
    submit();

    http.expectOne('/api/developers/applications').flush(created);
    http.expectOne('/api/developers/applications/new-id/icon')
      .flush('The icon must be a PNG image.', { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    expect(router.navigate).not.toHaveBeenCalled();
    const alert = (fixture.nativeElement as HTMLElement).querySelector('.alert-danger')!;
    expect(alert.textContent).toContain('The icon must be a PNG image.');
    expect(alert.querySelector('a')?.getAttribute('href')).toBe('/application/new-id');
  });

  it('explains a 403 as a missing Developer role', () => {
    fillForm();
    submit();

    http.expectOne('/api/developers/applications').flush(null, { status: 403, statusText: 'Forbidden' });
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Developer role');
  });
});

describe('validateIcon', () => {
  it('accepts a small PNG', () => {
    expect(validateIcon(new File([new Uint8Array([1])], 'a.png', { type: 'image/png' }))).toBeNull();
  });

  it('rejects other image types', () => {
    expect(validateIcon(new File([new Uint8Array([1])], 'a.jpg', { type: 'image/jpeg' }))).toContain('PNG');
  });

  it('rejects files over 2 MB', () => {
    const big = new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'a.png', { type: 'image/png' });
    expect(validateIcon(big)).toContain('2 MB');
  });
});
