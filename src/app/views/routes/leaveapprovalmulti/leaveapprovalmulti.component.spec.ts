import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveapprovalMultiComponent } from './leaveapprovalmulti.component';

describe('LeaveapprovalMultiComponent', () => {
  let component: LeaveapprovalMultiComponent;
  let fixture: ComponentFixture<LeaveapprovalMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveapprovalMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveapprovalMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
