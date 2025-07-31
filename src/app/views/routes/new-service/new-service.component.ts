import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NewLeaveDataModel } from 'src/app/_models/newleavedata.model';
import { User } from 'src/app/_models/user';
import { MessageService } from 'primeng/api';

import { AuthenticationService } from 'src/app/_services';
import { ServiceReqService } from 'src/app/_services/serviceReq.service';
import { ServiceTypeReqModel } from 'src/app/_models/serviceTypeReq.model';
import { NewServiceReqModel } from 'src/app/_models/newServiceReq.model';

@Component({
  selector: 'app-new-service',
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.scss'],
  providers:[MessageService ]
})
export class NewServiceComponent implements OnInit {

  @Output() valueChange = new EventEmitter();

  btnFlag: ButtonFlag = {edit: false, cancel: false, save: true, update: false, delete: false};

  serviceForm: FormGroup;
  serviceReqData: NewServiceReqModel;
  submitted: boolean;
  ServiceType: Array<ServiceTypeReqModel>;
  TodayDate: Date;
  totalDays: number;

  bindingFromDate: Date;
  bindingEndDate: Date;
  currentUserData: User;

  constructor(private fb: FormBuilder, private messageService: MessageService,
    private ServiceReqService: ServiceReqService,
    private AuthService: AuthenticationService) { }

  ngOnInit(): void {

    this.serviceForm = this.fb.group({
      'serviceType': new FormControl('',Validators.required),
      'reqdate': new FormControl('', Validators.required),
      'serviceReqReason': new FormControl(null),
      'ServiceStaffReview':new FormControl(''),
      // 'enddate': new FormControl('', Validators.required),
      // 'reason': new FormControl('', Validators.required)
    });
    this.TodayDate = new Date();
    this.ServiceReqService.GetServiceType().subscribe(res => {
      this.ServiceType = res;
    })
    this.currentUserData = this.AuthService.currentUserValue

    if (this.currentUserData == null) {

    }
  }

  onSubmit(ReqData: NewServiceReqModel) {
    if (!this.serviceForm.valid) {
      this.messageService.add({ severity: 'error', summary: 'Cant Process Now', detail: 'Fill All Fields' });
    }
    ReqData.serviceReqEmp= this.currentUserData.id;

    this.ServiceReqService.SendNewServiceRequest(ReqData).subscribe(res => {
        this.valueChange.emit();
        this.serviceForm.reset();

    },
      err => {

      }
    )
    this.submitted = true;
  }

  ExitNew(){
    this.valueChange.emit();
    this.serviceForm.reset();
}


  UpdateDate(leavdata: NewLeaveDataModel) {
    var date2 = new Date(this.bindingEndDate);
    var date1 = new Date(this.bindingFromDate);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    if ((date2.getTime() - date1.getTime()) <= 0) {
      this.bindingEndDate = null;
      this.messageService.add({ severity: 'error', summary: 'Date not Valid', detail: 'Choose Correct date' });
      this.totalDays = 0;
    } else
      this.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  }

  get diagnostic() { return JSON.stringify(this.serviceForm.value); }

}
interface ButtonFlag {edit?: boolean ; cancel?: boolean ; update?: boolean;
  save?: boolean ; delete?: boolean; }