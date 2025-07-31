import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavebalComponent } from './leavebal.component';

describe('LeavebalComponent', () => {
  let component: LeavebalComponent;
  let fixture: ComponentFixture<LeavebalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavebalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavebalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
