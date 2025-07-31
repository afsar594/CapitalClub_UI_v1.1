import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceapproveComponent } from './serviceapprove.component';

describe('ServiceapproveComponent', () => {
  let component: ServiceapproveComponent;
  let fixture: ComponentFixture<ServiceapproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceapproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
