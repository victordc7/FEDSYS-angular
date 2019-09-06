import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegJudgesComponent } from './reg-judges.component';

describe('RegJudgesComponent', () => {
  let component: RegJudgesComponent;
  let fixture: ComponentFixture<RegJudgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegJudgesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegJudgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
