import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTypeModel } from 'src/app/_models/leaveType.model';
import { NewLeaveDataModel } from 'src/app/_models/newleavedata.model';
import { User } from 'src/app/_models/user';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { LeaveDataService } from 'src/app/_services/leaveData.service';
import { LeaveTypeService } from 'src/app/_services/leaveType.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgxImgZoomService } from "ngx-img-zoom";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-leaveapprovalmulti',
  templateUrl: './leaveapprovalmulti.component.html',
  styleUrls: ['./leaveapprovalmulti.component.scss']
})
export class LeaveapprovalMultiComponent implements OnInit, AfterViewInit {
  index: number = 0;
  title: string = 'Leave Request';
  btnFlag: ButtonFlag = { edit: false, cancel: false, save: true, update: false, delete: false };

  @Output() valueChange = new EventEmitter();

  uploadedFiles: File = null;
  leaveform: FormGroup;
  leavedata: NewLeaveDataModel;
  submitted: boolean;
  leaveTypes: Array<LeaveTypeModel>;
  TodayDate: Date;
  totalDays: number;
  leaveid: number;
  approveRemarks: string;
  //----------------test
  public imagePath;
  imgURL: any;
  public message: string;

  enableZoom: Boolean = true;
  previewImageSrc: any;
  zoomImageSrc: any;
  // files:any;

  //-================

  bindingFromDate: Date;
  bindingEndDate: Date;
  currentUserData: User;
  leaveId: any;
  balancedLeave: number=0;
  balLeave: number;

  constructor(private fb: FormBuilder,
    private messageService: MessageService,
    private leaveTypeAService: LeaveTypeService,
    private LeaveDataService: LeaveDataService,
    private route: ActivatedRoute,
    private navCtrl: Router,
    // private ngxImgZoom: NgxImgZoomService,
    private AuthService: AuthenticationService) {
    

  }

  ngOnInit(): void {
    // this.totalDays = 0;

    this.leaveform = this.fb.group({
      leavetype: new FormControl(null),
      fromdate: new FormControl('', null),
      enddate: new FormControl('', null),
      reason: new FormControl('', null),
      leavedays: new FormControl('', null),
      imageFile: new FormControl([null]),
      remarks: new FormControl(null,Validators.required)

    });
    this.route.queryParams.subscribe((params: any) => {
      this.leaveid = params['leaveId'];
      // this.leaveid = Number(params.leaveId);
  
    });
    this.TodayDate = new Date();
    this.leaveTypeAService.GetLeaveType().subscribe(res => {
      this.leaveTypes = res;
      this.GetSavedLeavedata(this.leaveid);
    })
    // this.GetSavedLeavedata(this.leaveid);
    this.totalDays = 0;

    this.currentUserData = this.AuthService.currentUserValue


    if (this.currentUserData == null) {

    }
    this.messageService.add({ severity: 'error', summary: 'Cant Process Now', detail: 'network Error' });
    // this.GetSavedLeavedata(2056);
  }

  ngAfterViewInit() {


  }


  updateLeaveFormGrid(LData: any) {
    let typeid = LData[0].leaveDataTypeNavigation.leaveTypeId;
    var ltype = this.leaveTypes.find(v => v.leaveTypeId === typeid);
    this.leaveform.patchValue({
      leavetype:ltype,
      fromdate: LData[0].leaveDataFrom,
      enddate: LData[0].leaveDataTo,
      reason: LData[0].leaveDataReason,
      leavedays: LData[0].leaveDays,
      imageFile: LData[0]?.leaveReqImage != null && LData[0]?.leaveReqImage?.length > 0 ? 'data:image/png;base64,' + LData[0].leaveReqImage : null

    } );
    this.onLeaveChange(ltype);
    this.totalDays = this.leaveform.get("leavedays").value;
  }

  onFileSelect(event) {


    if (event.target.files.length > 0) {
      this.uploadedFiles = event.target.files[0];
      // const file = event.target.files;
      //  this.attendanceForm.get('imageFile').setValue(file);
    }
  }


  onSubmit(leavdata: NewLeaveDataModel) {
    // leavdata.file = this.leaveform.get('imageFile').value;
    leavdata.TotalDays = this.totalDays;
    if (!this.leaveform.valid) {
      this.messageService.add({ severity: 'error', summary: 'Cant Process Now', detail: 'Fill All Fields' });
      return false;
    }
    leavdata.EmployeeID = this.currentUserData.id;

    this.LeaveDataService.SendNewLeaveRequest(leavdata).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfull Added' });

      this.valueChange.emit();
      this.leaveform.reset();

    },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Cant Process Now', detail: 'network Error' });

      }
    )
    this.submitted = true;
  }


  ExitNew() {
    this.navCtrl.navigate(['/user/leaveapprovemulti']);
    // this.valueChange.emit();
    // this.leaveform.reset();
  }

  Rejectform() {
      if (this.leaveform.invalid) {
    this.leaveform.markAllAsTouched(); // highlights the field
    this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Remarks are required' });
    return;
  }
    this.approveRemarks = this.leaveform.get('remarks').value.toString();

    this.LeaveDataService.ApproveLeaveData(this.leaveid, 3, this.currentUserData.id, this.approveRemarks).subscribe(res => {

      if (res == null){

        this.messageService.add({ severity: 'error', summary: 'Network error', detail: 'Netwrok error, try again' });
      }else{
        this.messageService.add({ severity: 'success', summary: 'Update Successfully', detail: 'Approved' });
    }
       this.valueChange.emit();
      this.leaveform.reset();
      this.navCtrl.navigate(['/user/leaveapprovemulti']);
  },
    
      err => {
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'cant Approve ' });
      }
    )
  }
approveLeave() {

  if (this.leaveform.invalid) {
   
    this.leaveform.markAllAsTouched(); // highlights the field
    this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Remarks are required' });
    return;
  }

  this.approveRemarks = this.leaveform.get('remarks').value.toString();

  this.LeaveDataService.ApproveMultiLeaveData(this.leaveid, 2, this.currentUserData.id, this.approveRemarks).subscribe(
    res => {
      if (res == null) {
        this.messageService.add({ severity: 'error', summary: 'Network error', detail: 'Network error, try again' });
      } else {
        this.messageService.add({ severity: 'success', summary: 'Updated Successfully', detail: 'Approved' });
      }
        this.valueChange.emit();
        this.leaveform.reset();
        this.navCtrl.navigate(['/user/leaveapprovemulti']);
    },
    err => {
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Cannot approve' });
    }
  );
}

  // approveLeave() {
  //   this.navCtrl.navigate(['/user/leaveapprove']);
    
  //   this.approveRemarks = this.leaveform.get('remarks').value.toString();

  //   this.LeaveDataService.ApproveLeaveData(this.leaveid, 2, this.currentUserData.id, this.approveRemarks).subscribe(res => {

  //     if (res == null)

  //       this.messageService.add({ severity: 'error', summary: 'Network error', detail: 'Netwrok error, try again' });
  //     else

  //       this.messageService.add({ severity: 'success', summary: 'Update Successfully', detail: 'Approved' });
  //     this.valueChange.emit();
  //     this.leaveform.reset();
  //     this.navCtrl.navigate(['/user/leaveapprove']);
  //   },
  //     err => {
  //       this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'cant Approve ' });
  //     }
  //   )
  // }


  UpdateDate(leavdata: NewLeaveDataModel) {
    var date2 = new Date(this.bindingEndDate);
    var date1 = new Date(this.bindingFromDate);
    this.totalDays = 0;

    var timeDiff = date2.getTime() - date1.getTime();


    if (this.bindingFromDate == null) {
      this.messageService.add({ severity: 'error', summary: 'Date not Valid', detail: 'Select start Date first' });
      this.leaveform.get('enddate').setValue(null);
      this.totalDays = 0;

      return false;
    }

    if (this.bindingEndDate == null) {
      this.leaveform.get('enddate').setValue(null);
      this.totalDays = 0;

      //  this.messageService.add({ severity: 'error', summary: 'Date not Valid', detail: 'Select from date' });    
      return false;
    }

    //   if(timeDiff< 0 && this.bindingEndDate !=null)    {   this.messageService.add({ severity: 'error', summary: 'Date not Valid', detail: 'Date not Valid' });
    //   this.leaveform.get('enddate').setValue(null);
    //   this.totalDays = 0;
    //   return false;
    // }

    if (((date2.getDate() - date1.getDate()) < 0) && this.bindingFromDate != null && this.bindingEndDate != null) {
      this.leaveform.get('enddate').setValue(null);

      this.messageService.add({ severity: 'error', summary: 'Date not Valid', detail: 'Choose Correct date' });
      this.totalDays = 0;

    } else {
      timeDiff = Math.abs(date2.getTime() - date1.getTime());
      // if(!Math.ceil(timeDiff / (1000 * 3600 * 24))&& this.bindingFromDate !=null && this.bindingEndDate !=null){
      // this.leaveform.get('enddate').setValue(null);
      //   this.totalDays = 0;
      // }else{
      this.totalDays = (date2.getDate() - date1.getDate()) + 1;
      // this.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24))+1;
      // }
    }
  }

  get diagnostic() { return JSON.stringify(this.leaveform.value); }



  GetSavedLeavedata(id: number) {
    this.index = 0;
    this.LeaveDataService.LeaveDataswithID(id).subscribe((data:any) => {
      if (data.length!=0) {
        this.btnFlag = { edit: true, cancel: true, save: false, update: true, delete: true };
        this.updateLeaveFormGrid(data);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Alert', detail: ('Leave Data not found') });
      }
    },);
  }
    onLeaveChange(name) {
      if(name.leaveType!='Annual Leave'){
        return
      }
      else{

      
    this.LeaveDataService.ReadLeaveBalTypeDatas(this.currentUserData.id, name.leaveTypeId).subscribe(res => {
      this.balLeave = res[0]?.leaveBalNo;
      this.balancedLeave = res[0]?.leaveBalNo;
   }); 
  }
  }
}

interface ButtonFlag {
  edit?: boolean; cancel?: boolean; update?: boolean;
  save?: boolean; delete?: boolean;
}