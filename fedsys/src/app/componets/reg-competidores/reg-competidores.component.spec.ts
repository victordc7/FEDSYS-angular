import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegCompetidoresComponent } from './reg-competidores.component';

describe('RegCompetidoresComponent', () => {
  let component: RegCompetidoresComponent;
  let fixture: ComponentFixture<RegCompetidoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegCompetidoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegCompetidoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
