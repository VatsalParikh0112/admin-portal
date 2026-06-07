import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindPharmaLogo } from './find-pharma-logo';

describe('FindPharmaLogo', () => {
  let component: FindPharmaLogo;
  let fixture: ComponentFixture<FindPharmaLogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindPharmaLogo],
    }).compileComponents();

    fixture = TestBed.createComponent(FindPharmaLogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
