import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacVariantUpload } from './mac-variant-upload';

describe('MacVariantUpload', () => {
  let component: MacVariantUpload;
  let fixture: ComponentFixture<MacVariantUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MacVariantUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacVariantUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
