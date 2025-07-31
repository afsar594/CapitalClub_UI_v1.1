import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetSinglestaffComponent } from './timesheet-singlestaff.component';

describe('TimesheetSinglestaffComponent', () => {
  let component: TimesheetSinglestaffComponent;
  let fixture: ComponentFixture<TimesheetSinglestaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetSinglestaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetSinglestaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
