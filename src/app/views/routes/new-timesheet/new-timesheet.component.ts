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
import { User } from 'src/app/_models/user';
import { AuthenticationService } from 'src/app/_services';
import { DatePipe } from '@angular/common';


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
  selector: 'app-new-timesheet',
  templateUrl: './new-timesheet.component.html',
  styleUrls: ['./new-timesheet.component.scss'],
  providers: [MessageService, ConfirmationService]
})

export class NewTimesheetComponent implements OnInit {

  @Output() valueChange = new EventEmitter();

  handsontableCurrentRowData: any; // Focus on handsontable : current row result
  tableActive: boolean = true;

  newTimesheetFlag: boolean;

  // bindingFromDate: Date;
  bindingFromDate: string;

  timesheetData: Array<any>=[];

  private hotRegisterer = new HotTableRegisterer();
  hotid = 'receiptVouchrEntry';
  timesheetEntry: Handsontable.GridSettings;
  timesheetFormGroup: FormGroup;

  TimesheetDataModel: TimesheetDataModel;
  /*------------------*/
  flag: boolean;
  licensekey: string;
  msgs: Message[] = [];

  NewTimesheetData: any;

  date1:Date = new Date();
  projectList: SelectItem[]=[];

  Tdate : Date;
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
    private authService: AuthenticationService
  ) {

    this.licensekey = "non-commercial-and-evaluation";
  }
  currentUserData: User;
  ngOnInit(): void {
    let today = new Date();
    this.bindingFromDate = new Date().toISOString();

    this.newTimesheetFlag = true;
    this.currentUserData = this.authService.currentUserValue;
    this.timesheetData = [];

    this.initializeControls(this.timesheetData);

    this.timesheetFormGroup = this.fb.group({
      TimesheetDate: [new Date(), [Validators.required]],
     
    });

    this.getProjectList();
    this.GetTimeSheetData();

    // this.date1 = new Date().toLocaleDateString();
    this.Tdate = new Date()
  }

  get f() {
    return this.timesheetFormGroup.controls;
  }

  

  initializeControls(Tarray: Array<any>) {
    //  this.GetTimeSheetDate();


    this.timesheetEntry = {
      rowHeaders: true,
     // viewportColumnRenderingOffset: 27,
     // viewportRowRenderingOffset: 'auto',
     // colWidths: [40, 10, 10, 20, 60],
      minRows: 100,
      width: 'auto',
      height: '600px',
      rowHeights: 23,
      // fillHandle: {
      //   direction: 'vertical',
      //   autoInsertRow: true
      // },
      data: this.timesheetData,
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
      manualRowResize: true,
      manualColumnResize: true,
      hiddenColumns: {
        //columns: [6],
        //  indicators: true
      },
      licenseKey: 'non-commercial-and-evaluation',
// 841932624
      // rowHeaders: true,
      columns: [
        {
          data: 'timesheetDataProject.projectName',
          type: 'dropdown',
          width: 120,
          source: (query, callback) => {
            // callback(this.projectList);
          },
          correctFormat: true,
        },
        {
          data: 'startTime',
          width: 60,
          // renderer: coverRenderer,
          //readOnly:true,
          editor: PasswordEditor,
          //          timeFormat: 'H:mm',
          correctFormat: true
        },
        {
          data: 'endTime',
          width: 60,
          editor: PasswordEditor,
          correctFormat: true
        },
        {
          data: 'endDate',
          width: 80,
          editor: DateEditor,
          correctFormat: true
        },
        {
          data: 'description',
          width: 120,
          type: 'text',
        },
        // {
        //   data: 'id',
        //   type: 'numeric'

        // }
      ],
      colHeaders: [
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

        var row = changes[0][0];
        if (this.handsontableCurrentRowData[2] == null && this.handsontableCurrentRowData[1] == null)
          return false;
        if (changes[0][1] == "startTime" /*||changes[0][1]=='endTime'*/) {
          if (changes[0][3] > this.handsontableCurrentRowData[2]) {
            alert(" Error: select Valid time, kindly check start and end time");
            this.setDataAtCell(row, 1, changes[0][2], 'internal');
          }
        }
        if (changes[0][1] == 'endTime') {
          if (changes[0][3] < this.handsontableCurrentRowData[1]) {
            alert(" Error: select Valid time, kindly check start and end time");

            this.setDataAtCell(row, 2, changes[0][2], 'internal');
          }
        }

      }

    };



    this.timesheetEntry.afterValidate = (isValid, value, row, prop, valueHolder) => {
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
  display: boolean;



  new() {
     this.timesheetFormGroup.reset();
    // this.timesheetEntry.data = [];
    // this.timesheetData = [];
    // this.timesheetEntry.readOnly = false;
    // this.hotRegisterer.getInstance(this.hotid).updateSettings(this.timesheetEntry);
    this.date1 = new Date();
    this.timesheetData = [];
    this.timesheetData.push({
      "timesheetDataId": 0,
      "timesheetId": 0,
      "timesheetDataProjectId":-1,
      "startTime": "00:00",
      "endTime": "00:00",
      "endDate": new Date(),
      "description": "",
      "timesheetDataProject": {
        "projectId": -1,
      }
      });
  }

  saveReceiptVoucher() {

    let IsValid = true;
    let errMsg = "";
    // var tabledata = this.hotRegisterer.getInstance(this.hotid).getData();
    var tabledata = this.timesheetData;

    console.log("savevoucher",this.timesheetData);
    const NewTimesheetData: Array<any> = tabledata.filter(k => k.timesheetDataProjectId != null &&
      k.endTime != "00:00" && k.startTime != "00:00"/*&&  k[3] != null*/);

    console.log(NewTimesheetData);

    // const NewTimesheetData:Array<any> = tabledata.filter( k => k.hasOwnProperty('timesheetDataProject')&& 
    // k.hasOwnProperty('startTime')&& k.hasOwnProperty('endTime')&& k.hasOwnProperty('description'));


    if (NewTimesheetData.length == 0) { IsValid = false; errMsg = ":Empty"; }

    // Object.keys(NewTimesheetData).map(function (TimeIndex) {
    //   let TimesheetRow = NewTimesheetData[TimeIndex];
    //   //console.log(TimesheetRow['endTime']);
    //   if (TimesheetRow[1] == null) { errMsg = "ROW :" + (TimeIndex + 1) + "-Please check StartTime - Is Null"; IsValid = false; } else {
    //     let starttime = TimesheetRow[1].split(":");
    //     if (starttime.length != 2 || TimesheetRow[1].length > 6 && TimesheetRow[1].length < 3 || (starttime[0] % 2 == NaN || starttime[1] % 2 == NaN)) { IsValid = false; errMsg = "ROW :" + (TimeIndex + 1) + "-Please check StartTime"; }
    //   }
    //   if (TimesheetRow['2'] == null) { IsValid = false; errMsg = "ROW :" + (TimeIndex + 1) + "-Please check Endtime -IS NULL"; } else {
    //     let endtime = TimesheetRow[2].split(":");
    //     if (endtime.length != 2 || (TimesheetRow[2].length > 6 && TimesheetRow[2].length < 3) || (endtime[0] % 2 == NaN && endtime[1] % 2 == NaN)) { IsValid = false; errMsg = "ROW :" + (TimeIndex + 1) + "-Please check EndTime-Not Valid"; }
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
//     Description = rowdata[4],
//     EndTime = Convert.ToDateTime(rowdata[2]).TimeOfDay,
//     StartTime = Convert.ToDateTime(rowdata[1]).TimeOfDay,
//     EndDate = DateTime.TryParse(rowdata[3],out validValue)  ? validValue
// : (DateTime?) null,
//     TimesheetDataProjectId = rowdata[0],
   var filterData: string[][] = this.NewTimesheetData.map((m) => {
    var dta = [
       m.timesheetDataProject.projectId.toString(),
       typeof(m.startTime) != 'string'? m.startTime.toLocaleTimeString():m.startTime,
       typeof(m.endTime) != 'string'?m.endTime.toLocaleTimeString():m.endTime,
       typeof(m.endDate) != 'string'?m.endDate.toLocaleDateString(): m.endDate,
       m.description
      
    ]
     return dta;
    });
    console.log(filterData,'TEST');

    this.TimesheetDataModel = {
      empID: this.currentUserData.id,
      timesheetData: filterData,
      //timesheetData :this.timesheetEntry.data.filter( k => k.hasOwnProperty('timesheetDataProject')&& k.hasOwnProperty('startTime')&& k.hasOwnProperty('endTime')&& k.hasOwnProperty('description')),
      
      // TimesheetDate: this.timesheetFormGroup.get('TimesheetDate').value     
      TimesheetDate: this.date1.toDateString()
    }
    //  console.log(this.TimesheetDataModel, 'Date checking');
    //  console.log(this.timesheetFormGroup.get('TimesheetDate').value,'testing 2');
    this.timesheetService.create(this.TimesheetDataModel).subscribe(k => {

      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Success Fully Added' });
      this.newTimesheetFlag = true;
      this.GetTimeSheetData() ;
    
      // this.new();
      //this.valueChange.emit();
    }, D => {
      // this.msgs = [{severity:'success', summary:'Failed!', detail:''}];
      this.messageService.add({ severity: 'error', summary: 'Fail Message', detail: 'Cant process now, Try Again..' });
    });

  }


  
  getProjectList() {
    this.projectservice.GetProjects().subscribe(k => {
      var data = k.map((ar) => {
        return {label : ar.projectName,
        value: ar.projectId};
       
      })
      this.projectList = data;
      this.projectList.unshift({label : '--Select--', value: -1});
      //   this.jobArray = k;0

      //  this.projectList = k.map((kl => ({ projectId : kl.projectName});
      //   this.jobArry = k.map(ar => ar.jobMasterJobName.trim());
    });
    //this.projectList =['Project A', 'Project B', 'Project B2', 'Project B6', 'Project B7', 'Project B8'];
  }

  clearMessages() {
    setTimeout(() => {
      this.msgs = [];
    }, 2000);

  }

  GetTimeSheetData() {
    var myDate = new Date();

    // console.log(this.timesheetFormGroup.get('TimesheetDate')?.value.toDateString());
    this.timesheetService.GetTimesheetDataByDate(this.date1.toDateString(), this.currentUserData.id).subscribe(res => {


      console.log("success data");
      if (res == null)
        this.newTimesheetFlag = true;
      else this.newTimesheetFlag = false;

      if(res?.length > 0) {

        this.timesheetData = res.map((c) => {
          c.endDate = new Date(c.endDate);
          return c;
        });
        this.newTimesheetFlag = false;
     
      this.initializeControls(this.timesheetData);
      this.timesheetData.push({
        "timesheetDataId": 0,
        "timesheetId": 0,
        "timesheetDataProjectId": this.projectList[0].value,
        "startTime": "00:00",
        "endTime": "00:00",
        "endDate": new Date(),
        "description": "",
        "timesheetDataProject": {
          "projectId": this.projectList[0].value,
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
    this.initializeControls(this.timesheetData);
   
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
    console.log('this.timesheetData.length',this.timesheetData.length);
    if((index + 1) == this.timesheetData.length) {
      this.timesheetData.push({
        "timesheetDataId": 0,
        "timesheetId": 0,
        "timesheetDataProjectId": this.projectList[0].value,
        "startTime": "00:00",
        "endTime": "00:00",
        "endDate": new Date(),
        "description": "",
        "timesheetDataProject": {
          "projectId": this.projectList[0].value,
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
