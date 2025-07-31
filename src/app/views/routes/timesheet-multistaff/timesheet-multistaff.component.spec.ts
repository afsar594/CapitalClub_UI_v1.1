import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetAllComponent } from './timesheet-all.component';

describe('TimesheetAllComponent', () => {
  let component: TimesheetAllComponent;
  let fixture: ComponentFixture<TimesheetAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
