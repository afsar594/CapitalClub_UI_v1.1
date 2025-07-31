import { ServiceReqService } from 'src/app/_services/serviceReq.service';
import { ViewServiceRequestModel } from 'src/app/_models/viewserviceReq.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/_models/user';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { ServiceTypeReqModel } from 'src/app/_models/serviceTypeReq.model';

@Component({
  selector: 'app-serviceapproval',
  templateUrl: './serviceapproval.component.html',
  styleUrls: ['./serviceapproval.component.scss']
})
export class ServiceapprovalComponent implements OnInit {
  index: number=0;
  title: string = 'Leave Request';
  btnFlag: ButtonFlag = {edit: false, cancel: false, save: true, update: false, delete: false};
  
  @Output() valueChange = new EventEmitter();
  
  uploadedFiles: File = null;
  serviceform: FormGroup;
  servicedata: ViewServiceRequestModel;
  submitted: boolean;
  serviceTypes: Array<ServiceTypeReqModel>;
  TodayDate: Date;
  totalDays: number;
  serviceid:number ;
  ServiceapproveRemarks: string;
  servicereqReason:string;
  public imagePath;
  imgURL: any;
  public message: string;

  enableZoom: Boolean = true;
  previewImageSrc: any;
  zoomImageSrc: any;
  bindingFromDate: Date;
  bindingEndDate: Date;
  currentUserData: User;
  
  constructor(private fb: FormBuilder, private messageService: MessageService,
    private serviceTypeService: ServiceReqService,
    private serviceDataService: ServiceReqService,
    private route: ActivatedRoute, 
    private navCtrl: Router,
    // private ngxImgZoom: NgxImgZoomService,
    private AuthService: AuthenticationService) { 
      // this.ngxImgZoom.setZoomBreakPoints([
      //   { w: 100, h: 100 },
      //   { w: 150, h: 150 },
      //   { w: 200, h: 200 },
      //   { w: 250, h: 250 },
      //   { w: 300, h: 300 }
      // ]);
      
    }
  
  ngOnInit(): void {
    // this.totalDays = 0;
  
    this.serviceform = this.fb.group({
      servicetype: new FormControl(null),
      requestdate: new FormControl('',null),
      imageFile: new FormControl([null]),
      remarks: new FormControl(null),
      reason: new FormControl(null)
  
    });

    this.TodayDate = new Date();
    
    this.serviceTypeService.GetServiceType().subscribe(res => {
      this.serviceTypes = res;    
      this.GetSavedServicedata(this.serviceid); 
    })
    this.totalDays = 0;
  
    this.currentUserData = this.AuthService.currentUserValue
  
    
    if (this.currentUserData == null) {
  
    }
    this.onViewWillEnter();   
    // this.GetSavedLeavedata(2056);
  }

  ngAfterViewInit() {
 
    
  }
  
  onViewWillEnter() {
    this.route.queryParams.subscribe((params: any) => {
      this.serviceid = Number(params.serviceId);
      // this.GetSavedLeavedata(this.leaveid);
      console.log(this.serviceform.value);
   });    
  }

    updateServiceFormGrid(SerData: any){
      console.log(this.serviceTypes,SerData[0].serviceReqTypeNavigation.serviceReqTypeId)
        let typeid = SerData[0].serviceReqTypeNavigation.serviceReqTypeId;
        var ltype =this.serviceTypes.find(v => v.serviceReqTypeId == typeid);
      this.serviceform.patchValue({
        servicetype: Number(ltype?.serviceReqTypeId) || null,
      requestdate: SerData[0].serviceReqDate,
      reason: SerData[0].serviceReqReason,
      imageFile: SerData[0]?.serviceReqAprovImg != null && SerData[0]?.serviceReqAprovImg?.length > 0  ? 'data:image/png;base64,' + SerData[0].serviceReqAprovImg:null
     
    }
    );
  }

  onFileSelect(event) {

    if (event.target.files.length > 0) {
      this.uploadedFiles = event.target.files[0];
      console.log(this.uploadedFiles);
      // const file = event.target.files;
      //  this.attendanceForm.get('imageFile').setValue(file);
    }
  }
  

  ExitNew(){
    this.navCtrl.navigate(['/user/serviceapprove']);
        // this.valueChange.emit();
        // this.leaveform.reset();
    }
    
    RejectService() {
      this.ServiceapproveRemarks = this.serviceform.get('remarks').value.toString();

      this.serviceDataService.ServiceApproval(this.serviceid,3,this.currentUserData.id,this.ServiceapproveRemarks).subscribe(res => {
  
        if (res == null)
    
          this.messageService.add({ severity: 'error', summary: 'Network error', detail: 'Netwrok error, try again' });
        else
    
          this.messageService.add({ severity: 'success', summary: 'Update Successfully', detail: 'Approved' });
          this.valueChange.emit();
          this.serviceform.reset();
          this.navCtrl.navigate(['/user/serviceapprove']);
      },
        err => {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'cant Approve ' });
        }
      )
     }

    approveServices(){
      this.ServiceapproveRemarks = this.serviceform.get('remarks').value.toString();

      this.serviceDataService.ServiceApproval(this.serviceid,2,this.currentUserData.id,this.ServiceapproveRemarks).subscribe(res => {
  
      if (res == null)
  
        this.messageService.add({ severity: 'error', summary: 'Network error', detail: 'Netwrok error, try again' });
      else
  
        this.messageService.add({ severity: 'success', summary: 'Update Successfully', detail: 'Approved' });
        this.valueChange.emit();
        this.serviceform.reset();
    
        this.navCtrl.navigate(['/user/serviceapprove']);
    },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'cant Approve ' });
      }
    )
   }
   

  get diagnostic() { return JSON.stringify(this.serviceform.value); }



  GetSavedServicedata(id: number) {
    this.index = 0;
    this.serviceDataService.ReadServiceDataById(id).subscribe((data) => {
      if (data !== null) {
        this.btnFlag = {edit: true, cancel: true, save: false, update: true, delete: true};
        this.updateServiceFormGrid(data);
      }else {
        this.messageService.add({severity: 'error', summary: 'Alert', detail: ('Leave Data not found')});
      }
      }, );
  }
  
  }
  
  interface ButtonFlag {edit?: boolean ; cancel?: boolean ; update?: boolean;
    save?: boolean ; delete?: boolean; }