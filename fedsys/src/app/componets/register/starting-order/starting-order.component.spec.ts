import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingOrderComponent } from './starting-order.component';

describe('StartingOrderComponent', () => {
  let component: StartingOrderComponent;
  let fixture: ComponentFixture<StartingOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartingOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
