import { Component, OnInit } from '@angular/core';
import { TreeNode, MessageService } from 'primeng/api';
import { TimesheetService } from 'src/app/_services/timesheet.service';
import { ViewTimesheetModel } from 'src/app/_models/viewtimesheet.model';
import { TimesheetPreviewModel } from 'src/app/_models/timesheetPreview.model';
import { AuthenticationService } from 'src/app/_services';
import { User } from 'src/app/_models/user';
import { TimesheetMultiStaffService } from 'src/app/_services/timesheetMultiStaff.service';

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss'],
  providers: [MessageService]

})
export class TimeSheetComponent implements OnInit {

  todayTimesheet:boolean;

  filtermonth:number;
  filteryrear:number;

  files1: TreeNode[];
  display:boolean;
  displaynew:boolean;

  nodes:TreeNode[];
  selectedFile: TreeNode;
  TimesheetDatas:TimesheetPreviewModel[];
  heading:string;

  timesheets: Array<ViewTimesheetModel>;

  /** Handsontable  */
  tableSettings: any = {
    viewportColumnRenderingOffset: 27,
    viewportRowRenderingOffset: "auto",
    height: 450,
    allowInsertRow: false,
    stretchH: "all",
    maxRows: 22,
    manualRowResize: false,
    manualColumnResize: false,
    autoWrapRow: true,
    minSpareRows: false,
    columnSorting: true,
    fillHandle: false,
    licenseKey: 'non-commercial-and-evaluation',

     columns: [
      {
        data: 'timesheetDataStaff.fullName',
        type: 'text',
        width: 140,
        readOnly: true

      },
        {
          data: 'timesheetDataProject.projectName',
          type: 'text',
          width: 140,
          readOnly: true

        },
        {
          data: 'startTime',
          type: 'time',
          width: 40,
          timeFormat: 'h:mm:ss a',
          correctFormat: true,
    
          readOnly: true
                },
                {
                  data: 'endTime',
                  type: 'time',
                  width: 40,
                  readOnly: true,
                },
                {
                  data: 'endDate',
                  type: 'date',
                  width: 40,
                  readOnly: true,
                },
                {
                  data: 'description',
                  type: 'text',
                  width: 40,
                  readOnly: true,
                },
      ],
    colHeaders: ["Staff Name ","Project", "Start Time", "End Time", "End Date",  "Description"],
    manualRowMove: true,
    manualColumnMove: true,
    contextMenu: true,
    filters: true,
    dropdownMenu: true,
    afterValidate: function(isValid, value, row, prop){

      console.log(row);

      if(value == false){

        	console.log( value, row, prop)    
          alert("Invalid")
          //Value = isValid
          // row = inserted invalid value
          //prop = row index changed
      }
			
    }
  };



  constructor(private timesheetService:TimesheetMultiStaffService,
    private authService:AuthenticationService,
    private messageService: MessageService
    ) { }
    currentUserData:User;
    years:any;
    months:any;

  ngOnInit(): void {

    this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});

this.todayTimesheet =true;

    this.years = [
      {name: '2022', value:2022},
      {name: '2021', value:2021},
      {name: '2020', value:2020},
      {name: '2019', value:2019},
      {name: '2018', value:2018},
  ];
  this.months = [
    {name: "January", value:1},
    {name: 'February', value:2},
    {name: 'March', value:3},
    {name: 'April', value:4},
    {name: 'May', value:5},
    {name: 'June', value:6},
    {name: 'July', value:7},
    {name: 'August', value:8},
    {name: 'September', value:9},
    {name: 'October', value:10},
    {name: 'November', value:11},
    {name: 'December', value:12}

];


    this.currentUserData = this.authService.currentUserValue;

    this.display = false;
    this.timesheetService.GetTimesheets(this.currentUserData.id).subscribe(res=>{
      this.timesheets = res;
      console.log(this.timesheets);
      console.log("--------tim sheet---------");
      res.forEach(obj => {
        this.files1 = Array.from({length: this.timesheets.length}).map((_,i) => this.createNode(this.timesheets[i],1, 1000));
          });
     
     });

    
     this.timesheetService.GetCurrentTimesheet(this.currentUserData.id).subscribe(res=>{
       console.log('safasfasfsafasfasfasf',res)
             this.TimesheetDatas = res;

      if(this.TimesheetDatas== null){
        this.todayTimesheet = false;
      }else{
      this.todayTimesheet = true;
      }
    });

        // this.timesheets.map((_,i) =>{
        // console.log(i);
        // });

    //this.nodeService.getFiles().then(files => this.files1 = files);
  }
  createNode(data:ViewTimesheetModel, i: number, children: number) :TreeNode{


  
    let node: TreeNode = {
        label: data.year.toString(),
       // data: 'Node ' + i,
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        children: 
          
            Array.from({length: data.treeMonths.length}).map((_,j) => {
             // [{
              return {
                label: data.treeMonths[j].monthName,
                collapsedIcon: 'pi pi-folder',
                expandedIcon: 'pi pi-folder-open',
                children:Array.from({length: data.treeMonths[j].treeDay.length}).map((_,k) => {
                  return {
                      label: data.treeMonths[j].treeDay[k].day+"-"+ data.treeMonths[j].treeDay[k].dayName, 
                      data: data.treeMonths[j].treeDay[k].timesheetID, 
                      icon: 'pi pi-file-o'
                  }
                })
              }
    })
              //}]
          
      // })
    };
  console.log('alll',data);
    return node;
}

filter(){
this.currentUserData = this.authService.currentUserValue;

this.display = false;
this.timesheetService.filtertmesheets(this.currentUserData.id, this.filtermonth['value'],this.filteryrear['value']).subscribe(res=>{
  this.timesheets = res;
  console.log(res);

  if( res.length ==0){   
    this.messageService.add({severity: 'error', summary: "No Data", detail: "Timesheet not found"}); }
 // console.log(this.timesheets);
  //console.log("--------tim sheet---------");
  res.forEach(obj => {
    console.log(obj);
    this.files1 = Array.from({length: this.timesheets.length}).map((_,i) => this.createNode(this.timesheets[i],1, 1000));
      });
 
 });

}

GettodayTimesheet(){
  var ndate=  new Date().toDateString();
  this.timesheetService.GetTimesheetDataByDate1(ndate, this.currentUserData.id).subscribe(res=>{
    this.TimesheetDatas = res;
    this.heading="Today ";
    if(this.TimesheetDatas== null){
      this.todayTimesheet = false;
    }else{
    this.todayTimesheet = true;
    }
  });
}
nodeSelect(event) {
  if(event.node.data != null){
    this.timesheetService.GetTimesheetData(event.node.data ).subscribe(res=>{
      this.heading= event.node.label+"-"+event.node.parent.label+"-"+event.node.parent.parent.label;
     console.log('terin',res)
      this.TimesheetDatas = res;
      if(this.TimesheetDatas== null){
        this.todayTimesheet = false;
      }else{
      this.todayTimesheet = true;
      }
      console.log(res);
    })
  }
  console.dir(event.node);
 // this.messageService.add({severity: 'info', summary: 'Node Selected', detail: event.node.label});
}

  showDialog() {
    this.display = true;
}

MultiStaffshowDialog() {
  this.displaynew = true;
}

ReloadData(){
  this.currentUserData = this.authService.currentUserValue;

  this.timesheetService.GetTimesheets(this.currentUserData.id).subscribe(res=>{
    this.timesheets = res;
    console.log(this.timesheets);
    res.forEach(obj => {
      //console.log(obj);
      console.log("554");
      this.files1 = Array.from({length: this.timesheets.length}).map((_,i) => this.createNode(this.timesheets[i],1, 1000));
        });
   
   }
   );
  this.display = false;
}


ReloadDataMulti(){
  this.currentUserData = this.authService.currentUserValue;

  this.timesheetService.GetTimesheets(this.currentUserData.id).subscribe(res=>{
    this.timesheets = res;
    console.log(this.timesheets);
    res.forEach(obj => {
      //console.log(obj);
      console.log("554");
      this.files1 = Array.from({length: this.timesheets.length}).map((_,i) => this.createNode(this.timesheets[i],1, 1000));
        });
   
   }
   );
  this.display = false;
}

}
