import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetSingleComponent } from './timesheet-single.component';

describe('TimesheetSingleComponent', () => {
  let component: TimesheetSingleComponent;
  let fixture: ComponentFixture<TimesheetSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
