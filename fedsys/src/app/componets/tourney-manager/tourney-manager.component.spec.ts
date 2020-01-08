import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourneyManagerComponent } from './tourney-manager.component';

describe('TourneyManagerComponent', () => {
  let component: TourneyManagerComponent;
  let fixture: ComponentFixture<TourneyManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourneyManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourneyManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
