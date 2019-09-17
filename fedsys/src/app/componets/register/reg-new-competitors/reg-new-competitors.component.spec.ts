import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegNewCompetitorsComponentComponent } from './reg-new-competitors-component.component';

describe('RegNewCompetitorsComponentComponent', () => {
  let component: RegNewCompetitorsComponentComponent;
  let fixture: ComponentFixture<RegNewCompetitorsComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegNewCompetitorsComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegNewCompetitorsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
