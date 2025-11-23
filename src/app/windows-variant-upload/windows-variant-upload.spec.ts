import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowsVariantUpload } from './windows-variant-upload';

describe('WindowsVariantUpload', () => {
  let component: WindowsVariantUpload;
  let fixture: ComponentFixture<WindowsVariantUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindowsVariantUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindowsVariantUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
