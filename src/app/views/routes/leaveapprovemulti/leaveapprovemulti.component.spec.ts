import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveapproveMultiComponent } from './leaveapprovemulti.component';

describe('LeaveapproveMultiComponent', () => {
  let component: LeaveapproveMultiComponent;
  let fixture: ComponentFixture<LeaveapproveMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveapproveMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveapproveMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
