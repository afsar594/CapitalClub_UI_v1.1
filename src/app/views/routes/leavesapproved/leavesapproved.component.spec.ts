import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesapprovedComponent } from './leavesapproved.component';

describe('LeavesapprovedComponent', () => {
  let component: LeavesapprovedComponent;
  let fixture: ComponentFixture<LeavesapprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavesapprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavesapprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
