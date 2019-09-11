import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegCategoriesComponent } from './reg-categories.component';

describe('RegCategoriesComponent', () => {
  let component: RegCategoriesComponent;
  let fixture: ComponentFixture<RegCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
