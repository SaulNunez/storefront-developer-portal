import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacRelease } from './mac-release';

describe('MacRelease', () => {
  let component: MacRelease;
  let fixture: ComponentFixture<MacRelease>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MacRelease]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacRelease);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
