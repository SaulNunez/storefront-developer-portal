import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationEdit } from './application-edit';

describe('ApplicationEdit', () => {
  let component: ApplicationEdit;
  let fixture: ComponentFixture<ApplicationEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
