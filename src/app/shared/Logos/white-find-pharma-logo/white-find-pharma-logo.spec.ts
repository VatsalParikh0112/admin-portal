import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteFindPharmaLogo } from './white-find-pharma-logo';

describe('WhiteFindPharmaLogo', () => {
  let component: WhiteFindPharmaLogo;
  let fixture: ComponentFixture<WhiteFindPharmaLogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhiteFindPharmaLogo],
    }).compileComponents();

    fixture = TestBed.createComponent(WhiteFindPharmaLogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
