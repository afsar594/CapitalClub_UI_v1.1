import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NumberValueAccessor, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LeaveTypeModel } from 'src/app/_models/leaveType.model';
import { NewLeaveDataModel } from 'src/app/_models/newleavedata.model';
import { ViewStaffModel } from 'src/app/_models/viewserviceReq.model';
import { User } from 'src/app/_models/user';
import { AuthenticationService } from 'src/app/_services';
import { LeaveDataService } from 'src/app/_services/leaveData.service';
import { LeaveTypeService } from 'src/app/_services/leaveType.service';
import { ServiceReqService } from 'src/app/_services/serviceReq.service';


@Component({
  selector: 'app-leaverequest',
  templateUrl: './leaverequest.component.html',
  styleUrls: ['./leaverequest.component.scss']
})
export class LeaverequestComponent implements OnInit {
  index: number = 0;
  title: string;
  btnFlag: ButtonFlag = { edit: false, cancel: false, save: true, update: false, delete: false };

  @Output() valueChange = new EventEmitter();

  uploadedFiles: any = null;
  leaveform: FormGroup;
  leavedata: NewLeaveDataModel;
  submitted: boolean;
  leaveTypes: Array<LeaveTypeModel>;

  TodayDate: Date;
  totalDays: number;
  totalDOJDays: number;
  leaveAccrued: number=0;
  balLeave: number=0;

  bindingFromDate: Date;
  bindingEndDate: Date;
  DateOfJoining: Date;
  currentUserData: User;
  empdata: ViewStaffModel;
  balancedLeave: number = 0;
  isload: boolean=true;
  totalholidays: any=0;

  constructor(private serviceReqService: ServiceReqService,
    private fb: FormBuilder, private messageService: MessageService,
    private leaveTypeAService: LeaveTypeService,
    private LeaveDataService: LeaveDataService,
    private router: Router,
    private AuthService: AuthenticationService) { }

  ngOnInit(): void {
    this.totalDays = 0;
    this.leaveform = this.fb.group({
      'leavetype': new FormControl('', Validators.required),
      'fromdate': new FormControl('', Validators.required),
      'enddate': new FormControl('', Validators.required),
      'reason': new FormControl('', Validators.required),
      'imageFile': new FormControl([''], null)

    });
    this.TodayDate = new Date();
    this.currentUserData = this.AuthService.currentUserValue;
    console.log("current user",this.currentUserData)
    this.serviceReqService.ReadStaffDatas(this.currentUserData.id).subscribe(res => {
      this.empdata = res;
    }
    );


    this.totalDays = 0;
     this.getLeaveTypesById()
   //this.GetLeaveType()

  }

  onFileSelect($event) {
    if ($event.target.files.length > 0) {
      var reader = new FileReader();
      // let dovImage: DocumentImages;
      // dovImage.documentImageImage = event.target.files[0];
      reader.readAsDataURL($event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.uploadedFiles = event.target.result;

      };
    }
  }

  
  onSubmit(leavdata: NewLeaveDataModel) {
    this.leaveform.markAllAsTouched()
    leavdata.TotalDays = this.totalDays;
    leavdata.imageFile = this.uploadedFiles;
    if (!this.leaveform.valid) {
      this.messageService.add({ severity: 'error', summary: 'Cant Process Now', detail: 'Fill All Fields' });
      return false;
    }
    if ( leavdata.TotalDays ==0) {
      this.messageService.add({ severity: 'error', summary: 'Cant Process Now', detail: 'Days should be grater than 0' });
      return false;
    }
    leavdata.EmployeeID = this.currentUserData.id;
    this.submitted = true;
    this.LeaveDataService.SendNewLeaveRequest(leavdata).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfull Added' });
    this.submitted = false;
      this.valueChange.emit();
      this.leaveform.reset();

    },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Cant Process Now', detail: 'network Error' });
      this.submitted = false;
      }
    )

  }

  ExitNew() {
    this.valueChange.emit();
    this.leaveform.reset();
    this.isload=true;
    this.balLeave=0
    this.totalDays=0
  }

  onLeaveChange(event) {
    this.LeaveDataService.ReadLeaveBalTypeDatas(this.currentUserData.id, event.value.leaveTypeId).subscribe(res => {
      this.balLeave = res[0]?.leaveBalNo;
      this.balancedLeave = res[0]?.leaveBalNo;
    }); 
      // Reset from/to dates
  this.bindingFromDate = null;
  this.bindingEndDate = null;
    this.totalholidays=0

  this.leaveform.get('fromdate')?.setValue(null);
  this.leaveform.get('enddate')?.setValue(null);

  // Reset calculations
  this.totalDays = 0;
  this.leaveAccrued = 0;
    const today = new Date();
    const startDate = new Date(this.bindingFromDate);
    const endDate = this.bindingEndDate ? new Date(this.bindingEndDate) : null;
  
    const diffFromToday = startDate.getTime() - today.getTime();
    this.totalDays = Math.ceil(diffFromToday / (1000 * 3600 * 24)) + 1;
    this.leaveAccrued = Math.round((this.totalDays / 30) * 2.5);
    this.balLeave = this.balancedLeave + this.leaveAccrued;
  
    if (endDate) {
      const diffBetweenDates = endDate.getTime() - startDate.getTime();
      this.totalDays = Math.ceil(diffBetweenDates / (1000 * 3600 * 24)) + 1;
    }
    if (this.totalDOJDays <= 90) {
      if (event.value.leaveType === 'Sick Leave' || event.value.leaveType === 'Annual Leave') {
        if (!this.isload) {
          this.messageService.add({
            severity: 'error',
            summary: 'Cannot Apply!',
            detail: 'Date of joining must be greater than 90 days'
          });
        }
        this.totalDays = 0; 
      }
    }
  }


  // UpdateDate(leavdata: any) {
  //   this.isload = false;  
  //   this.totalDays = 0;
  
  //   // Check if start date is provided
  //   if (!this.bindingFromDate) {
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Date not Valid',
  //       detail: 'Select start date first'
  //     });
  //     this.leaveform.get('enddate')?.setValue(null);
  //     this.totalDays = 0;
  //     return false;
  //   }
  
  //   const today = new Date();
  //   const startDate = new Date(this.bindingFromDate);
  //   const dojDate = new Date(this.empdata.doj); // Employee's date of joining
  //   const endDate = this.bindingEndDate ? new Date(this.bindingEndDate) : null;
  
  //   const dojDiff = startDate.getTime() - dojDate.getTime();
  //   this.totalDOJDays = Math.ceil(dojDiff / (1000 * 3600 * 24)); // Days since joining
  //   console.log( "total days onchangeDate",this.totalDOJDays)

  //   if (
  //     this.totalDOJDays < 90 &&
  //     (leavdata.leavetype.leaveType === 'Sick Leave' || leavdata.leavetype.leaveType === 'Annual Leave')
  //   ) {
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Cannot Apply!',
  //       detail: 'Date of joining must be greater than 90 days'
  //     });
  //     return false;
  //   }
  
  //   // Allow leave application if total days since joining are greater than 90
  //   if (this.totalDOJDays >= 90) {
  //     // Calculate leave accruals based on start date
  //     const diffFromToday = startDate.getTime() - today.getTime();
  //     this.totalDays = Math.ceil(diffFromToday / (1000 * 3600 * 24)) + 1;
  //     this.leaveAccrued = Math.round((this.totalDays / 30) * 2.5);
  //     this.balLeave = this.balancedLeave + this.leaveAccrued;
  
  //     // Calculate total days if end date is provided
  //     if (endDate) {
  //       const diffBetweenDates = endDate.getTime() - startDate.getTime();
  //       this.totalDays = Math.ceil(diffBetweenDates / (1000 * 3600 * 24)) + 1;
  
  //       // Validate end date against start date
  //       if (diffBetweenDates < 0) {
  //         this.leaveform.get('enddate')?.setValue(null);
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Date not Valid',
  //           detail: 'End date must be after start date'
  //         });
  //         this.totalDays = 0;
  //         return false;
  //       }
  //     } else {
  //       // Reset end date and total days if not provided
  //       this.leaveform.get('enddate')?.setValue(null);
  //       this.totalDays = 0;
  //       return false;
  //     }
  
  //     return true;
  //   }
  
  //   return false;
  // }
  // UpdateDate(leavdata: any) {
  //   this.isload = false;
  //   this.totalDays = 0;
  
  //   if (!this.bindingFromDate) {
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Date not Valid',
  //       detail: 'Select start date first'
  //     });
  //     this.leaveform.get('enddate')?.setValue(null);
  //     return false;
  //   }
  
  //   const today = new Date();
  //   const startDate = new Date(this.bindingFromDate);
  //   const dojDate = new Date(this.empdata.doj);
  //   const endDate = this.bindingEndDate ? new Date(this.bindingEndDate) : null;
  
  //   const dojDiff = startDate.getTime() - dojDate.getTime();
  //   this.totalDOJDays = Math.ceil(dojDiff / (1000 * 3600 * 24));
  
  //   if (
  //     this.totalDOJDays < 90 &&
  //     (leavdata?.leavetype?.leaveType === 'Sick Leave' || leavdata?.leavetype?.leaveType === 'Annual Leave')
  //   ) {
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Cannot Apply!',
  //       detail: 'Date of joining must be greater than 90 days'
  //     });
  //     return false;
  //   }
  
  //   if (this.balancedLeave === undefined || this.balancedLeave === null) {
  //     this.LeaveDataService.ReadLeaveBalTypeDatas(this.currentUserData.id, leavdata?.leavetype?.leaveTypeId).subscribe(res => {
  //       this.balancedLeave = res[0]?.leaveBalNo || 0;
  //       this.applyLeaveCalculation(startDate, endDate, today);
  //     });
  //   } else {
  //     this.applyLeaveCalculation(startDate, endDate, today);
  //   }
  
  //   return true;
  // }
UpdateDate(leavdata: any) {
  this.isload = false;
  this.totalDays = 0;

  if (!this.bindingFromDate) {
    this.messageService.add({
      severity: 'error',
      summary: 'Date not Valid',
      detail: 'Select start date first'
    });
    this.leaveform.get('enddate')?.setValue(null);
    return false;
  }
   let fromDate = this.leaveform.get('fromdate')?.value;
let toDate = this.leaveform.get('enddate')?.value;
let leavetype = this.leaveform.get('leavetype')?.value;
if (fromDate && toDate && leavetype.leaveType=='Annual Leave') {
  this.getholidaysbyDate(fromDate,toDate)
}


  const today = new Date();
  const startDate = new Date(this.bindingFromDate);
  const endDate = this.bindingEndDate ? new Date(this.bindingEndDate) : null;
  const dojDate = new Date(this.empdata.doj);

  // Normalize dates to midnight
  const normalizedStartDate = new Date(startDate);
  normalizedStartDate.setHours(0, 0, 0, 0);

  const normalizedToday = new Date();
  normalizedToday.setHours(0, 0, 0, 0);

  const yesterday = new Date(normalizedToday);
  yesterday.setDate(normalizedToday.getDate() - 1);

  // DOJ Validation
  const dojDiff = normalizedStartDate.getTime() - dojDate.getTime();
  this.totalDOJDays = Math.ceil(dojDiff / (1000 * 3600 * 24));

  // Sick Leave validation
  if (leavdata?.leavetype?.leaveType === 'Sick Leave') {
    const isToday = normalizedStartDate.getTime() === normalizedToday.getTime();
    const isYesterday = normalizedStartDate.getTime() === yesterday.getTime();

    if (!isToday && !isYesterday) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Date for Sick Leave',
        detail: 'Only today and yesterday are allowed for Sick Leave'
      });
      this.leaveform.get('fromdate')?.setValue(null);
      this.leaveform.get('enddate')?.setValue(null);
      return false;
    }
  }

  // Annual Leave validation (must be in the future only)
  if (leavdata?.leavetype?.leaveType === 'Annual Leave' && this.currentUserData.workgroupid!=1) {
    if (normalizedStartDate.getTime() <= normalizedToday.getTime()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Date for Annual Leave',
        detail: 'Annual Leave can only be applied for future dates'
      });
      this.leaveform.get('fromdate')?.setValue(null);
      this.leaveform.get('enddate')?.setValue(null);
      return false;
    }
  }

  // DOJ restriction: 90 days
  if (
    this.totalDOJDays < 90 &&
    (leavdata?.leavetype?.leaveType === 'Sick Leave' || leavdata?.leavetype?.leaveType === 'Annual Leave')
  ) {
    this.messageService.add({
      severity: 'error',
      summary: 'Cannot Apply!',
      detail: 'Date of joining must be greater than 90 days'
    });
    return false;
  }

  // Load leave balance and apply calculation
  if (this.balancedLeave === undefined || this.balancedLeave === null) {
    this.LeaveDataService.ReadLeaveBalTypeDatas(this.currentUserData.id, leavdata?.leavetype?.leaveTypeId).subscribe(res => {
      this.balancedLeave = res[0]?.leaveBalNo || 0;
      this.applyLeaveCalculation(startDate, endDate, today);
    });
  } else {
    this.applyLeaveCalculation(startDate, endDate, today);
  }

  return true;
}


  applyLeaveCalculation(startDate: Date, endDate: Date | null, today: Date) {
  const startMonth = startDate.getMonth();
  const startYear = startDate.getFullYear();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Check if start date is in a future month
  if (startYear > currentYear || (startYear === currentYear && startMonth > currentMonth)) {
    this.leaveAccrued = 2.5;
  } else {
    this.leaveAccrued = 0;
  }

  this.balLeave = this.balancedLeave + this.leaveAccrued;
  if (endDate) {
    const diffBetweenDates = endDate.getTime() - startDate.getTime();

    if (diffBetweenDates < 0) {
      this.leaveform.get('enddate')?.setValue(null);
      this.messageService.add({
        severity: 'error',
        summary: 'Date not Valid',
        detail: 'End date must be after start date'
      });
      this.totalDays = 0;
      return;
    }

    this.totalDays = Math.ceil(diffBetweenDates / (1000 * 3600 * 24)) + 1;
  } else {
    this.leaveform.get('enddate')?.setValue(null);
    this.totalDays = 0;
  }
}

  // applyLeaveCalculation(startDate: Date, endDate: Date | null, today: Date) {
  //   const diffFromToday = startDate.getTime() - today.getTime();
  //   this.totalDays = Math.ceil(diffFromToday / (1000 * 3600 * 24)) + 1;
  // console.log("first balace=",this.balLeave)
  //   this.leaveAccrued = Math.round((this.totalDays / 30) * 2.5);
  //     console.log("leaveAccrued=",this.leaveAccrued)

  //   this.balLeave = this.balancedLeave + this.leaveAccrued;
  //       console.log("balLeave=",this.balLeave)

  //   if (endDate) {
  //     const diffBetweenDates = endDate.getTime() - startDate.getTime();
  
  //     if (diffBetweenDates < 0) {
  //       this.leaveform.get('enddate')?.setValue(null);
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Date not Valid',
  //         detail: 'End date must be after start date'
  //       });
  //       this.totalDays = 0;
  //       return;
  //     }
  
  //     this.totalDays = Math.ceil(diffBetweenDates / (1000 * 3600 * 24)) + 1;
  //   } else {
  //     this.leaveform.get('enddate')?.setValue(null);
  //     this.totalDays = 0;
  //   }
  // }
    
getLeaveTypesById()
{
    this.leaveTypeAService.getLeaveTypeById(Number(this.currentUserData.id)).subscribe((res:any) => {
      this.leaveTypes = res.data;
    })
}
 GetLeaveType(){
  this.leaveTypeAService.GetLeaveType().subscribe(res =>{
          this.leaveTypes = res;
  })
 }

  getholidaysbyDate( fromDate,ToDate){
  this.leaveTypeAService.getholidaysbyDate(fromDate.toISOString().slice(0, 10),ToDate.toISOString().slice(0, 10)).subscribe(res =>{
this.totalholidays=res
  })
 }

  get diagnostic() { return JSON.stringify(this.leaveform.value); }

}

interface ButtonFlag {
  edit?: boolean; cancel?: boolean; update?: boolean;
  save?: boolean; delete?: boolean;
}









































