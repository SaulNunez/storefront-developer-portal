import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AndroidRelease } from './android-release';

describe('AndroidRelease', () => {
  let component: AndroidRelease;
  let fixture: ComponentFixture<AndroidRelease>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AndroidRelease]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AndroidRelease);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
