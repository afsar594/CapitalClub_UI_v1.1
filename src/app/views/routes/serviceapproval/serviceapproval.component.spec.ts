import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceapprovalComponent } from './serviceapproval.component';

describe('ServiceapprovalComponent', () => {
  let component: ServiceapprovalComponent;
  let fixture: ComponentFixture<ServiceapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
