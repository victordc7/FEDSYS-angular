import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTourneyComponent } from './new-tourney.component';

describe('NewTourneyComponent', () => {
  let component: NewTourneyComponent;
  let fixture: ComponentFixture<NewTourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
