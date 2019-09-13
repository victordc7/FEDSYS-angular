import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegTourneyComponent } from './reg-tourney.component';

describe('RegTourneyComponent', () => {
  let component: RegTourneyComponent;
  let fixture: ComponentFixture<RegTourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegTourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegTourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
