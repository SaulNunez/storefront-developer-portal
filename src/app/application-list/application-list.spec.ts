import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationList } from './application-list';

describe('ApplicationList', () => {
  let component: ApplicationList;
  let fixture: ComponentFixture<ApplicationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationList],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
