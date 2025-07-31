// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-timesheet-all',
//   templateUrl: './timesheet-all.component.html',
//   styleUrls: ['./timesheet-all.component.scss']
// })
// export class TimesheetAllComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { HotTableRegisterer } from '@handsontable/angular';
import Handsontable from 'handsontable';
import 'jquery-ui';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService, SelectItem, Message } from 'primeng/api';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TimesheetDataModel } from 'src/app/_models/timesheetData.model';
import { ProjectService } from 'src/app/_services/project.service';
import { TimesheetService } from 'src/app/_services/timesheet.service';
import {TimesheetMultiStaffService} from 'src/app/_services/timesheetMultiStaff.service'
import { User } from 'src/app/_models/user';
import { AuthenticationService } from 'src/app/_services';
import { TimesheetMultiStaffDataModel } from 'src/app/_models/timesheetMultiStaffData.model';

class PasswordEditor extends Handsontable.editors.TextEditor {
  createElements() {
    super.createElements();

    this.TEXTAREA = this.hot.rootDocument.createElement('input');
    this.TEXTAREA.setAttribute('type', 'time');
    this.TEXTAREA.setAttribute('data-hot-input', "true");; // Makes the element recognizable by HOT as its own component's element.
    this.textareaStyle = this.TEXTAREA.style;
    this.textareaStyle.width = "0";
    //this.textareaStyle.height = 0;

    Handsontable.dom.empty(this.TEXTAREA_PARENT);
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
  }
}

class DateEditor extends Handsontable.editors.TextEditor {
  createElements() {
    super.createElements();

    this.TEXTAREA = this.hot.rootDocument.createElement('input');
    this.TEXTAREA.setAttribute('type', 'Date');
    this.TEXTAREA.setAttribute('data-hot-input', "true");; // Makes the element recognizable by HOT as its own component's element.
    this.textareaStyle = this.TEXTAREA.style;
    this.textareaStyle.width = "0";
    //this.textareaStyle.height = 0;

    Handsontable.dom.empty(this.TEXTAREA_PARENT);
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
  }
}


@Component({
  selector: 'app-timesheet-multistaff',
  templateUrl: './timesheet-multistaff.component.html',
  styleUrls: ['./timesheet-multistaff.component.scss'],
  providers: [MessageService, ConfirmationService]
})

export class TimesheetAllComponent implements OnInit {

  @Output() valueChange = new EventEmitter();

  handsontableCurrentRowData: any; // Focus on handsontable : current row result
  tableActive: boolean = true;

  newTimesheetFlag: boolean;

  bindingFromDate: string;

  multiStafftimesheetData: Array<any>=[];

  private hotRegisterer = new HotTableRegisterer();
  hotid = 'receiptVouchrEntry';
  multiStafftimesheetEntry: Handsontable.GridSettings;
  timesheetMultiStaffFormGroup: FormGroup;

  TimesheetMultiStaffDataModel: TimesheetMultiStaffDataModel;
  /*------------------*/
  flag: boolean;
  licensekey: string;
  msgs: Message[] = [];

  NewTimesheetData: any;
  Tdate : Date;
  date1:Date = new Date();
  projectList: any;
  staffList: any;

  // currencyList: SelectItem[];
  // currArry: string[] = [];

  // acctArry: string[] = [];
  // accountList: SelectItem[];

  // jobList: SelectItem[] = [];
  // jobArry: string[] = [];

  // costcenterArry: string[] = [];

  constructor(

    private activatedroute: ActivatedRoute,
    private messageService: MessageService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private router: Router,
    private projectservice: ProjectService,
    private timesheetService: TimesheetService,
    private timesheetMultiStaffService: TimesheetMultiStaffService,
    private authService: AuthenticationService
  ) {

    this.licensekey = "non-commercial-and-evaluation";
  }
  currentUserData: User;
  ngOnInit(): void {
   
    let today = new Date();
    this.bindingFromDate = new Date().toLocaleDateString();

    this.newTimesheetFlag = true;
    this.currentUserData = this.authService.currentUserValue;
    this.multiStafftimesheetData = [];

    this.initializeControls(this.multiStafftimesheetData);

    this.timesheetMultiStaffFormGroup = this.fb.group({
      TimesheetDate: [null, [Validators.required]],
    });

    this.getProjectList();
    this.getStaffs();
    this.GetTimeSheetData();

    this.Tdate = new Date()
  }

  get f() {
    return this.timesheetMultiStaffFormGroup.controls;
  }


  initializeControls(Tarray: Array<any>) {
    //  this.GetTimeSheetDate();


    this.multiStafftimesheetEntry = {
      rowHeaders: true,
      viewportColumnRenderingOffset: 27,
      viewportRowRenderingOffset: 'auto',
      colWidths: [80, 80, 40, 40, 40, 60],
      minRows: 100,
      width: 'auto',
      height: '600px',
      rowHeights: 23,
      // fillHandle: {
      //   direction: 'vertical',
      //   autoInsertRow: true
      // },
      fillHandle:false,
      data: this.multiStafftimesheetData,
      minSpareRows: 0,
      // allowInsertColumn: false,
      allowInsertRow: true,
      // allowRemoveColumn: false,
      // allowRemoveRow: false,
      // autoWrapRow: false,
      // autoWrapCol: false,
      stretchH: "all",
      autoWrapRow: true,
      // height: 487,
      // maxRows: 22,
      manualRowResize: false,
      manualColumnResize: false,
      hiddenColumns: {
        //columns: [6],
        //  indicators: true
      },
      licenseKey: 'non-commercial-and-evaluation',

      // viewportColumnRenderingOffset: 27,
      // viewportRowRenderingOffset: "auto",
      // height: 450,
      // allowInsertRow: false,
      // stretchH: "all",
      // maxRows: 22,
      // manualRowResize: false,
      // manualColumnResize: false,
      // autoWrapRow: true,
      // minSpareRows: false,
      // columnSorting: true,
      // fillHandle: false,
      // licenseKey: 'non-commercial-and-evaluation',
      // rowHeaders: true,
      columns: [
        {
          data: 'timesheetDataStaff.fullName',
          type: 'dropdown',
          width: 80,
          source: (query, callback) => {
            callback(this.staffList);
          },
          correctFormat: true,
        },
        {
          data: 'timesheetDataProject.projectName',
          type: 'dropdown',
          width: 80,
          source: (query, callback) => {
            callback(this.projectList);
          },
          correctFormat: true,
        },
        {
          data: 'startTime',
          width: 40,
          // renderer: coverRenderer,
          //readOnly:true,
          editor: PasswordEditor,
          //          timeFormat: 'H:mm',
          correctFormat: true
        },
        {
          data: 'endTime',
          width: 40,
          editor: PasswordEditor,
          correctFormat: true
        },
        {
          data: 'endDate',
          width: 40,
          editor: DateEditor,
          correctFormat: true
        },
        {
          data: 'description',
          width: 60,
          type: 'text',
        },
        // {
        //   data: 'id',
        //   type: 'numeric'

        // }
      ],
      colHeaders: [
        "Staff ",
        "Project",
        "Start Time",
        "End Time",
        "End Date",
        "Description",
        // "ID"

        // this.translate.instant('Account'),
        // this.translate.instant('Credit'),
        // this.translate.instant('Job Name'),
        // this.translate.instant('Cost Center'),
        // this.translate.instant( 'Narration'),
        // this.translate.instant( 'Id')
      ],
      manualRowMove: true,
      manualColumnMove: true,
      contextMenu: true,
      filters: true,
      dropdownMenu: true,
      afterSelection: function (r, c) {
        this.handsontableCurrentRowData = this.getDataAtRow(r);

      },
      afterChange: function (changes, source) {

        var row1 = changes[0][0];
        if (changes[0][1] != 'endDate') {
          console.log("endate");

        if (this.handsontableCurrentRowData[4] ==null) {
          console.log("null value");
            this.setDataAtCell(row1, 4, new Date().toDateString(), 'internal');
          }
        }

        var row = changes[0][1];
        if (this.handsontableCurrentRowData[2] == null && this.handsontableCurrentRowData[1] == null)
          return false;
        if (changes[0][2] == "startTime" /*||changes[0][1]=='endTime'*/) {
          if (changes[0][3] > this.handsontableCurrentRowData[2]) {
            alert(" Error: select Valid time, kindly check start and end time");
            this.setDataAtCell(row, 1, changes[0][2], 'internal');
          }
        }
        if (changes[0][2] == 'endTime') {
          if (changes[0][3] < this.handsontableCurrentRowData[1]) {
            alert(" Error: select Valid time, kindly check start and end time");

            this.setDataAtCell(row, 2, changes[0][2], 'internal');
          }
        }


      }

    };


    this.multiStafftimesheetEntry.afterValidate = (isValid, value, row, prop, valueHolder) => {
      this.flag = isValid;
      if (!isValid) {
        this.msgs = [{ severity: 'info', summary: 'Timesheet Failed', detail: 'Kindly check Datas' }];
      }

    };


    //  console.log("sdfs");

    //  LoggingEditor.getValue = function () {
    //      console.log('User finished editing the cell, the value will be set to: ' + this.TEXTAREA.value);
    //      return this.TEXTAREA.value;
    //  };

    //  LoggingEditor.setValue = function (newValue) {
    //      console.log('User started editing the cell, value shown to them in cell is: ' + newValue);
    //      this.TEXTAREA.value = newValue;
    //  };


    this.getProjectList();
    this.getStaffs();
    //  function  coverRenderer(instance, td, row, col, prop, value, cellProperties) {

    //   Handsontable.renderers.TextRenderer.apply(this, arguments);
    //   td.innerHTML = '    <input type="time" atp-time-picker value="20:55"/>    ';
    //   Handsontable.dom.addEvent(td, "mousedown", function (e) {
    //    // console.log("mousedown");
    //     e.preventDefault(); // prevent selection quirk
    //    // aaa();
    //   })
    //   return td;
    // }

  }
  displaynew: boolean;



  new() {
    this.timesheetMultiStaffFormGroup.reset();
    // this.multiStafftimesheetEntry.data = [];
    // this.multiStafftimesheetData = [];
    // this.multiStafftimesheetEntry.readOnly = false;
    // this.hotRegisterer.getInstance(this.hotid).updateSettings(this.multiStafftimesheetEntry);
    // this.timesheetMultiStaffFormGroup.get('TimesheetDate').setValue(null);
    this.date1 = new Date();
    this.multiStafftimesheetData = [];
    this.multiStafftimesheetData.push({
      "timesheetDataId": 0,
      "timesheetId": 0,
      "timesheetDataProjectId": 1,
      "timesheetDataStaffID" : 1,
      "startTime": "00:00",
      "endTime": "00:00",
      "endDate": new Date(),
      "description": "",
      "timesheetDataProject": {
        "projectId": 1,
      },
      "timesheetDataStaff":{
        "staffId": 1,
      }
      });
  }

  saveReceiptVoucher() {

    let IsValid = true;
    let errMsg = "";
    // var tabledata = this.hotRegisterer.getInstance(this.hotid).getData();
    var tabledata = this.multiStafftimesheetData;

    console.log("savevoucher");

    const NewTimesheetData: Array<any> = tabledata.filter(k => k.timesheetDataProjectId != null &&
      k.endTime != "00:00" && k.startTime != "00:00" &&  k.timesheetDataStaffID != null);

    // const NewTimesheetData: Array<any> = tabledata.filter(k => k[0] != null &&
    //   k[1] != null && k[2] != null/*&&  k[3] != null*/);

    console.log(NewTimesheetData);

    // const NewTimesheetData:Array<any> = tabledata.filter( k => k.hasOwnProperty('timesheetDataProject')&& 
    // k.hasOwnProperty('startTime')&& k.hasOwnProperty('endTime')&& k.hasOwnProperty('description'));


    if (NewTimesheetData.length == 0) { IsValid = false; errMsg = ":Empty"; }

    // Object.keys(NewTimesheetData).map(function (TimeIndex) {
    //   let TimesheetRow = NewTimesheetData[TimeIndex];
    //   //console.log(TimesheetRow['endTime']);
    //   if (TimesheetRow[1] == null) { errMsg = "ROW :" + (TimeIndex + 2) + "-Please check StartTime - Is Null"; IsValid = false; } else {
    //     let starttime = TimesheetRow[2].split(":");
    //     if (starttime.length != 2 || TimesheetRow[2].length > 6 && TimesheetRow[2].length < 3 || (starttime[0] % 2 == NaN || starttime[1] % 2 == NaN)) { IsValid = false; errMsg = "ROW :" + (TimeIndex + 2) + "-Please check StartTime"; }
    //   }
    //   if (TimesheetRow['2'] == null) { IsValid = false; errMsg = "ROW :" + (TimeIndex + 2) + "-Please check Endtime -IS NULL"; } else {
    //     let endtime = TimesheetRow[3].split(":");
    //     if (endtime.length != 2 || (TimesheetRow[3].length > 6 && TimesheetRow[3].length < 3) || (endtime[0] % 2 == NaN && endtime[1] % 2 == NaN)) { IsValid = false; errMsg = "ROW :" + (TimeIndex + 2) + "-Please check EndTime-Not Valid"; }
    //   }
    //   // return TimesheetRow;
    // });

    if (!IsValid) {

      this.messageService.add({ severity: 'error', summary: errMsg, detail: errMsg });

      //this.msgs = [{severity:'error', summary: errMsg, detail:errMsg}]; 
      return false;
    }

    IsValid = true;
    console.log(NewTimesheetData);
    this.NewTimesheetData = NewTimesheetData;

    this.confirm1();

  }


  confirm1() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveTimesheetData();
        //  this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You are Canceled' });

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }

  saveTimesheetData() {

    var filterData: string[][] = this.NewTimesheetData.map((m) => {
      var dta = [
        m.timesheetDataStaff.staffId.toString(),
         m.timesheetDataProject.projectId.toString(),
         typeof(m.startTime) != 'string'? m.startTime.toLocaleTimeString():m.startTime,
         typeof(m.endTime) != 'string'?m.endTime.toLocaleTimeString():m.endTime,
         typeof(m.endDate) != 'string'?m.endDate.toLocaleDateString(): m.endDate,
         m.description
        
      ]
       return dta;
      });

    this.TimesheetMultiStaffDataModel = {
      empID: this.currentUserData.id,
      timesheetData: filterData,
      // timesheetData: this.NewTimesheetData,
      //timesheetData :this.timesheetEntry.data.filter( k => k.hasOwnProperty('timesheetDataProject')&& k.hasOwnProperty('startTime')&& k.hasOwnProperty('endTime')&& k.hasOwnProperty('description')),
      // TimesheetDate: this.timesheetMultiStaffFormGroup.get('TimesheetDate').value
      TimesheetDate: this.date1.toDateString()
    }
    this.timesheetMultiStaffService.create(this.TimesheetMultiStaffDataModel).subscribe(k => {

      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Success Fully Added' });
      this.newTimesheetFlag = true;
      this.GetTimeSheetData() ;
      //this.new();
      //this.valueChange.emit();
    }, D => {
      // this.msgs = [{severity:'success', summary:'Failed!', detail:''}];
      this.messageService.add({ severity: 'error', summary: 'Fail Message', detail: 'Cant process now, Try Again..' });
    });

  }
  getProjectList() {
    // this.projectservice.GetProjects().subscribe(k => {
    //   this.projectList = k.map(ar => ar.projectName.trim());
    this.projectservice.GetProjects().subscribe(k => {
      var data = k.map((ar) => {
        return {label : ar.projectName,
        value: ar.projectId};
      })
      this.projectList = data;

      //   this.jobArray = k;0

      //  this.projectList = k.map((kl => ({ projectId : kl.projectName});
      //   this.jobArry = k.map(ar => ar.jobMasterJobName.trim());
    });
    //this.projectList =['Project A', 'Project B', 'Project B2', 'Project B6', 'Project B7', 'Project B8'];
  }

  getStaffs() {
    this.projectservice.GetStaffs().subscribe(k => {
      var datanew = k.map((ar) => {
        return {label : ar.fullName.trim(),
        value: ar.staffId};
      })
      this.staffList = datanew;

      // this.staffList = k.map(ar => ar.fullName.trim());
      // console.log('Testing Staff list');
      // console.log(this.staffList);
    });
    
  }


  clearMessages() {
    setTimeout(() => {
      this.msgs = [];
    }, 2000);

  }

  GetTimeSheetData() {
    var myDate = new Date();

    // console.log(this.timesheetMultiStaffFormGroup.get('TimesheetDate').value.toDateString());
    // this.timesheetMultiStaffService.GetTimesheetDataByDate(this.timesheetMultiStaffFormGroup.get('TimesheetDate').value.toDateString(), this.currentUserData.id).subscribe(res => {

      this.timesheetMultiStaffService.GetTimesheetDataByDate(this.date1.toDateString(), this.currentUserData.id).subscribe(res => {


      console.log("success data");
  //     if (res == null)
  //       this.newTimesheetFlag = true;
  //     else this.newTimesheetFlag = false;
  //     console.log('dsgsssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',res);
  //     this.multiStafftimesheetData = res;
  //     // this.timesheetEntry.data = res;

  //     //if(res.length >0) this.newTimesheetFlag= false;
  //     setTimeout(() => {

  //     }, 2000);

  //     console.log(this.multiStafftimesheetEntry.data);

  //   })
  //   this.initializeControls(this.multiStafftimesheetData);

  // }

  if (res == null)
        this.newTimesheetFlag = true;
      else this.newTimesheetFlag = false;

      if(res?.length > 0) {

        this.multiStafftimesheetData = res.map((c) => {
          c.endDate = new Date(c.endDate);
          return c;
        });
        this.newTimesheetFlag = false;
     
      this.initializeControls(this.multiStafftimesheetData);
      this.multiStafftimesheetData.push({
        "timesheetDataId": 0,
        "timesheetId": 0,
        "timesheetDataProjectId": 1,
        "timesheetDataStaffID" : 1,
        "startTime": "00:00",
        "endTime": "00:00",
        "endDate": new Date(),
        "description": "",
        "timesheetDataProject": {
          "projectId": 1,
        },
        "timesheetDataStaff":{
          "staffId": 1,
        }
        });
  }else {
    this.new();
    
  }
      console.log ('Timesheet data here',res);
      // this.timesheetEntry.data = res;

      //if(res.length >0) this.newTimesheetFlag= false;
      // setTimeout(() => {

      // }, 2000);

      // console.log(this.timesheetEntry.data);

    })
    this.initializeControls(this.multiStafftimesheetData);
   
  }


  onBeforeChange = (hotInstance, changes, source) => {
    console.log(hotInstance);
    // context -> AppComponent
    if (this.bindingFromDate == null) {
      this.msgs = [{ severity: 'error', summary: 'Failed!', detail: 'Select timesheet date..' }];
      return false; // returns value in Handsontable
    }
    return true;
  }


  addNewRow(event, timesheetData,index) {
    console.log('rowIndex',index);
    console.log('this.multiStafftimesheetData.length',this.multiStafftimesheetData.length);
    if((index + 1) == this.multiStafftimesheetData.length) {
      this.multiStafftimesheetData.push({
        "timesheetDataId": 0,
        "timesheetId": 0,
        "timesheetDataProjectId": 1,
        "timesheetDataStaffID" : 1,
        "startTime": "00:00",
        "endTime": "00:00",
        "endDate": new Date(),
        "description": "",
        "timesheetDataProject": {
          "projectId": 1,
        },
        "timesheetDataStaff":{
          "staffId": 1,
        }
        });
    }
  }




  // setter:boolean;
  // onAfterChange = (hotInstance, changes) => {
  //   if(hotInstance[0][1]=="startTime" ||hotInstance[0][1]=='endTime' )

  //   if(hotInstance[0][2]> hotInstance[0][3])   
  //    console.log("--------BIG 1---------"); else   console.log("-----BIG 2------------");


  //    console.log("-----selection------------");

  //       console.log(this.handsontableCurrentRowData)

  //   console.log("-----------------");


  //   //const hotInstance = this.hotRegisterer.getInstance(this.hotid);
  //     // hotInstance.setDataAtCell(0, 1, 'C');
  //     //   if (!this.setter) {
  //     //     this.setter = true;
  //     //     hotInstance.setDataAtCell(0, 0, 'Change');
  //     //   } else {
  //     //     this.setter = false;
  //     //   }
  //     //  console.log( hotInstance.get(0, 0));

  // }

}

