import { Component, OnInit } from '@angular/core';
import { TreeNode, MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { TimesheetService } from 'src/app/_services/timesheet.service';
import { ViewTimesheetModel } from 'src/app/_models/viewtimesheet.model';
import { TimesheetPreviewModel } from 'src/app/_models/timesheetPreview.model';
import { AuthenticationService } from 'src/app/_services';
import { User } from 'src/app/_models/user';
import { TimesheetMultiStaffService } from 'src/app/_services/timesheetMultiStaff.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
   selector: 'app-timesheet-single',
  templateUrl: './timesheet-single.component.html',
  styleUrls: ['./timesheet-single.component.scss'],
  providers: [MessageService]

})
export class TimesheetSingleComponent implements OnInit {

  todayTimesheet:boolean;

  filtermonth:number;
  filteryrear:number;
  formgroup: FormGroup;
  RDarray : FormArray;

  files1: TreeNode[];
  display:boolean;  
  displayNew:boolean;
 
  nodes:TreeNode[];
  selectedFile: TreeNode;
  TimesheetDatasNew:TimesheetPreviewModel[];
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
    minRows:2,
    width: 'auto',
    manualRowResize: false,
    manualColumnResize: false,
    // autoWrapRow: true,
    minSpareRows: true,
    columnSorting: true,
    fillHandle: false,
    licenseKey: 'non-commercial-and-evaluation',
    // rowHeaders: true,
     columns: [
        {
          data: 'timesheetDataProject.projectName',
          type: 'text',
       //   width: 120,
          readOnly: true

        },
        {
          data: 'startTime',
          type: 'time',
         // width: 60,
          timeFormat: 'h:mm:ss a',
          correctFormat: true,
    
          readOnly: true
        },
        {
          data: 'endTime',
          type: 'time',
         // width: 60,
          readOnly: true,
        },
        {
          data: 'endDate',
          type: 'date',
       //   width: 50,
          readOnly: true,
        },
        {
          data: 'description',
          type: 'text',
        //  width: 80,
          readOnly: true,
        },
      ],
    colHeaders: ["Project", "Start Time", "End Time", "End Date",  "Description"],
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


  constructor(private timesheetService:TimesheetService,
    private authService:AuthenticationService,
    private messageService: MessageService,
    private blankrow: FormBuilder

    ) { }
    currentUserData:User;
    years:any;
    months:any;

  ngOnInit(): void {

    this.formgroup = this.blankrow.group({
      itemRows: this.blankrow.array([this.initNewrows()]),
    });
  

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
             this.TimesheetDatasNew = res;

      if(this.TimesheetDatasNew== null){
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


  initNewrows() {
    return this.blankrow.group({
      project :[''],
      starttime: [''],
      endtime:[''],
      enddate:[''],
      description: ['']
    });
  }

  addnewRows(){
    const control = <FormArray>this.formgroup.controls['itemRows']
    control.push(this.initNewrows());
    //this.timesheets.push(this.initNewrows());

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
    this.TimesheetDatasNew = res;
    this.heading="Today ";
    if(this.TimesheetDatasNew== null){
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
      this.TimesheetDatasNew = res;
      if(this.TimesheetDatasNew== null){
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

SingleStaffshowDialog() {
  this.displayNew = true;
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


// ReloadDataMulti(){
//   this.currentUserData = this.authService.currentUserValue;

//   this.timesheetService.GetTimesheets(this.currentUserData.id).subscribe(res=>{
//     this.timesheets = res;
//     console.log(this.timesheets);
//     res.forEach(obj => {
//       //console.log(obj);
//       console.log("554");
//       this.files1 = Array.from({length: this.timesheets.length}).map((_,i) => this.createNode(this.timesheets[i],1, 1000));
//         });
   
//    }
//    );
//   this.display = false;
// }

}