import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowsRelease } from './windows-release';

describe('WindowsRelease', () => {
  let component: WindowsRelease;
  let fixture: ComponentFixture<WindowsRelease>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindowsRelease]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindowsRelease);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
