import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDetails } from './application-details';

describe('ApplicationDetails', () => {
  let component: ApplicationDetails;
  let fixture: ComponentFixture<ApplicationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationDetails],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
