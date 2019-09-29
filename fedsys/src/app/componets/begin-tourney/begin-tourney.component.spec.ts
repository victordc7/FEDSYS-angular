import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeginTourneyComponent } from './begin-tourney.component';

describe('BeginTourneyComponent', () => {
  let component: BeginTourneyComponent;
  let fixture: ComponentFixture<BeginTourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeginTourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeginTourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
