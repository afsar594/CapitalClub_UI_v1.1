import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveDataComponent } from './leave-data.component';

describe('LeaveDataComponent', () => {
  let component: LeaveDataComponent;
  let fixture: ComponentFixture<LeaveDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
