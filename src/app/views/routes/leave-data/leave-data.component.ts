import { Component, OnInit } from '@angular/core';
import { LeaveDataService } from 'src/app/_services/leaveData.service';
import { User } from 'src/app/_models/user';
import { AuthenticationService } from 'src/app/_services';
import { ViewLeaveDataModel } from 'src/app/_models/viewLeavData.model';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-leave-data',
  templateUrl: './leave-data.component.html',
  styleUrls: ['./leave-data.component.scss']
})
export class LeaveDataComponent implements OnInit {
  display: boolean = false;
  items: MenuItem[];
  title: string;

  currentUserData: User;
  LeaveDatas: Array<ViewLeaveDataModel>;
  fromdate: Date;
  enddate: Date;


  sortOrder: 'asc' | 'desc' = 'asc';
  sortedData: any[] = [];
  /** Handsontable  */
  tableSettings: any = {
    //rowHeaders: true,
    //colHeaders: true,
    viewportColumnRenderingOffset: 27,
    viewportRowRenderingOffset: "auto",
    //colWidths: 150,
    height: 450,
    allowInsertColumn: false,
    allowInsertRow: false,
    // allowRemoveColumn: false,
    // allowRemoveRow: false,
    // autoWrapRow: false,
    // autoWrapCol: false,
    stretchH: "all",
    //  width: 600,
    // autoWrapRow: true,
    //height: 487,

    maxRows: 22,
    manualRowResize: true,
    manualColumnResize: true,
    autoWrapRow: true,
    minSpareRows: false,
    columnSorting: true,
    fillHandle: true,
    licenseKey: 'non-commercial-and-evaluation',

    // rowHeaders: true,
    columns: [
      {
        data: 'leavDataId',
        type: 'numeric',
        width: 40,
        readOnly: true

      },
      {
        data: 'leaveDataTypeNavigation.leaveType',
        type: 'text',
        readOnly: true
      },
      {
        data: 'leaveDataFrom',
        type: 'date',
        readOnly: true,
        dateFormat: 'dd/MM/yyyy',
        correctFormat: true
      },
      {
        data: 'leaveDataTo',
        type: 'date',
        dateFormat: 'dd/MM/yyyy',
        correctFormat: true,
        defaultDate: '01/01/1900',
        readOnly: true,
      },
      {
        data: 'leaveDays',
        readOnly: true,
        type: 'numeric',
        numericFormat: {
          pattern: '0'
        }
      },

      {
        data: 'leaveDataReason',
        readOnly: true,
        type: 'text',

      },
      {
        data: 'reqDate',
        readOnly: true,
        type: 'date',
        dateFormat: 'dd/MM/yyyy'
      },
      {
        readOnly: true,
        data: 'status',
        renderer: (instance, TD, row, col, prop, value, cellProperties) => {
          if (value == 0) TD.innerHTML = `Pending<button class="delete" style="background:red; color:#fff; border:1px solid #ddd;">Delete</button>`;
          if (value == 1) TD.innerHTML = `<button  style="background:yellow; border:1px solid #ddd;">Processed</button>`;
          if (value == 2) TD.innerHTML = `<button  style="background:Green; border:1px solid #ddd;">Approved</button>`;
          if (value == 3) TD.innerHTML = `<button  style="background:red; border:1px solid #ddd;">Rejected</button>`;


          return TD;
        }
      }
    ],
    afterOnCellMouseDown: (event, coords, TD) => {
      if (event.realTarget.nodeName.toLowerCase() === 'button' && coords.col === 7) {
        this.delete(coords["row"], coords["col"]);

      }
    },
    colHeaders: ["ID", "Leave Type", "From Date", "End Date", "Total Days", "Reason", "ReqDate", "Status"],
    manualRowMove: true,
    manualColumnMove: true,
    contextMenu: true,
    filters: true,
    dropdownMenu: true,
    afterValidate: function (isValid, value, row, prop) {


      if (value == false) {

        alert("Invalid")
        //Value = isValid
        // row = inserted invalid value
        //prop = row index changed
      }

    }
  };


  updatestatus() {
    return "<h1>sdfdsfds</h1>"
  }
  showDialog() {
    this.display = true;
  }


  /** Hands-on-table  */

  /*any[] = [
    {id: 1, leavetype: 'Annual leave', from: '02-01-2018', to: '02-01-2018',totaldays:8, reason:'reson text', reqdate:'25-12-2017', status:'<button  style="background:yellow; border:1px solid yellow;padding:4px;">Pending</button>'},
  ];*/
  constructor(private LeavdataService: LeaveDataService,
    private authService: AuthenticationService,
    private messageService: MessageService,

  ) { }

  ngOnInit(): void {
    this.title = "Next";
        this.sortItems();

    this.fromdate;
    this.LeaveDatas = [];
    this.currentUserData = this.authService.currentUserValue;
    this.LeavdataService.ReadLeaveDatas(this.currentUserData.id).subscribe(res => {
      this.LeaveDatas = res;
       this.sortedData = [...this.LeaveDatas];
      this.title = "Active" + " (" + this.sortedData.length + ")";
      this.ReloadData();
      this.sortItems();

    }
    );

    this.items = [
      //   {label: 'Pending', icon: 'pi pi-minus-circle', command: () => {
      //      // this.update();
      //   }},
      //   {label: 'Approved', icon: 'pi pi-circle-on', command: () => {
      //      // this.delete();
      //   }},
      //   {label: 'Rejected', icon: 'pi pi-times-circle', command: () => {
      //     // this.delete();
      //  }}
      // {label: 'Angular.io', icon: 'pi pi-info', url: 'http://angular.io'},
      // {separator: true},
      // {label: 'Setup', icon: 'pi pi-cog', routerLink: ['/setup']}
    ];
  }
  deleteleave(lID: number) {

    this.LeavdataService.DeleteLeaveData(lID).subscribe(res => {

      if (res == null){

        this.messageService.add({ severity: 'error', summary: 'Network error', detail: 'Netwrok error, try again' });
       } else{
      this.ReloadData();

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully deleted ' });
       }
    },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'cant delete ' });
      }
    )
  }


  delete(row: number, col: number) {

    this.LeavdataService.DeleteLeaveData(this.LeaveDatas[row]["leavDataId"]).subscribe(res => {

      if (res == null){

        this.messageService.add({ severity: 'error', summary: 'Network error', detail: 'Netwrok error, try again' });
      }else{
      this.ReloadData();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully deleted ' });
      }
    },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'cant delete ' });
      }
    )
  }


  ReloadData() {
    this.LeavdataService.ReadLeaveDatas(this.currentUserData.id).subscribe(res => {
      this.LeaveDatas = res;
             this.sortedData = [...this.LeaveDatas];

      this.title = "Active" + " (" + this.LeaveDatas.length + ")";

    }
    );
    this.display = false;
  }

  /** HANDSONTABLE FUNCTION  */

  detectChanges = (hotInstance, changes, source) => {
    console.log(changes);

  };

  filterData() {
  //   if (this.fromdate != null && this.enddate != null)
  //     this.LeavdataService.FilterLeaveDatas(this.currentUserData.id, this.fromdate.toDateString(), this.enddate.toDateString()).subscribe(res => {

  //       this.LeaveDatas = res;
  //       this.title = this.fromdate.toDateString() + "  - " + this.enddate.toDateString() + " (" + this.LeaveDatas.length + ")";

  //     }
  //     );
  };
toggleSort(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortItems();
  }

sortItems(): void {
    this.sortedData.sort((a, b) => {
      const dateA = new Date(a.reqDate).getTime();
      const dateB = new Date(b.reqDate).getTime();
      return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }


  
}
