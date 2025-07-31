import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NewLeaveDataModel } from 'src/app/_models/newleavedata.model';
import { LeaveTypeService } from 'src/app/_services/leaveType.service';
import { LeaveTypeModel } from 'src/app/_models/leaveType.model';
import { LeaveDataService } from 'src/app/_services/leaveData.service';
import { AuthenticationService } from 'src/app/_services';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-new-leave-request',
  templateUrl: './new-leave-request.component.html',
  styleUrls: ['./new-leave-request.component.scss'],
  providers: [MessageService]
})
export class NewLeaveRequestComponent implements OnInit {

  @Output() valueChange = new EventEmitter();

  uploadedFiles: any = null;
  leaveform: FormGroup;
  leavedata: NewLeaveDataModel;
  submitted: boolean;
  leaveTypes: Array<LeaveTypeModel>;
  TodayDate: Date;
  totalDays: number;

  bindingFromDate: Date;
  bindingEndDate: Date;
  currentUserData: User;

  constructor(private fb: FormBuilder, private messageService: MessageService,
    private leaveTypeAService: LeaveTypeService,
    private LeaveDataService: LeaveDataService,
    private AuthService: AuthenticationService) { }

  ngOnInit(): void {
    this.totalDays = 0;

    this.leaveform = this.fb.group({
      'leavetype': new FormControl('', Validators.required),
      'fromdate': new FormControl('', Validators.required),
      'enddate': new FormControl('', Validators.required),
      'reason': new FormControl('', Validators.required),
      'imageFile': new FormControl([''],null)

    });
    this.TodayDate = new Date();
    this.leaveTypeAService.GetLeaveType().subscribe(res => {
      this.leaveTypes = res;
    })
    this.totalDays = 0;

    this.currentUserData = this.AuthService.currentUserValue

    if (this.currentUserData == null) {

    }
  }

  onFileSelect($event) {


    if ($event.target.files.length > 0) {
      var reader = new FileReader();
      // let dovImage: DocumentImages;
      // dovImage.documentImageImage = event.target.files[0];
      reader.readAsDataURL($event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.uploadedFiles  = event.target.result;
      
      };


      // this.uploadedFiles = event.target.files[0];
      // console.log(this.uploadedFiles);
      // const file = event.target.files;
      //  this.attendanceForm.get('imageFile').setValue(file);
    }
  }


  onSubmit(leavdata: NewLeaveDataModel) {
    // leavdata.file = this.leaveform.get('imageFile').value;
    leavdata.TotalDays= this.totalDays;
    leavdata.imageFile= this.uploadedFiles;
    debugger;
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
    //console.log(leavdata.fromdate);
    this.submitted = true;
  }


  UpdateDate(leavdata: NewLeaveDataModel) {
    var date2 = new Date(this.bindingEndDate);
    var date1 = new Date(this.bindingFromDate);
    this.totalDays = 0;    
    var timeDiff =  date2.getTime() - date1.getTime();
    
    if( this.bindingFromDate ==null) {
      this.messageService.add({ severity: 'error', summary: 'Date not Valid', detail: 'Select start Date first' });
      this.leaveform.get('enddate').setValue(null);
      this.totalDays = 0;

      return false;
   }

    if( this.bindingEndDate ==null){  
      this.leaveform.get('enddate').setValue(null);
      this.totalDays = 0;

    //  this.messageService.add({ severity: 'error', summary: 'Date not Valid', detail: 'Select from date' });    
        return false;}

      //   if(timeDiff< 0 && this.bindingEndDate !=null)    {   this.messageService.add({ severity: 'error', summary: 'Date not Valid', detail: 'Date not Valid' });
      //   this.leaveform.get('enddate').setValue(null);
      //   this.totalDays = 0;
      //   return false;
      // }

    if (((date2.getTime() - date1.getTime()) < 0) && this.bindingFromDate !=null && this.bindingEndDate !=null) {
      this.leaveform.get('enddate').setValue(null);
      
      this.messageService.add({ severity: 'error', summary: 'Date not Valid', detail: 'Choose Correct date' });
      this.totalDays = 0;

    } else
    {
      timeDiff =  Math.abs( date2.getTime() - date1.getTime());
      // if(!Math.ceil(timeDiff / (1000 * 3600 * 24))&& this.bindingFromDate !=null && this.bindingEndDate !=null){
      // this.leaveform.get('enddate').setValue(null);
      //   this.totalDays = 0;
      // }else{
      this.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24))+1;
    // }
    }
  }

  get diagnostic() { return JSON.stringify(this.leaveform.value); }

}
