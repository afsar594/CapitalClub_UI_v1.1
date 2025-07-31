import { Component, OnInit } from '@angular/core';
import { LeaveDataService } from 'src/app/_services/leaveData.service';
import { User } from 'src/app/_models/user';
import { AuthenticationService } from 'src/app/_services';
import { ViewLeaveDataModel } from 'src/app/_models/viewLeavData.model';


import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaveapprove',
  templateUrl: './leaveapprove.component.html',
  styleUrls: ['./leaveapprove.component.scss']
})
export class LeaveapproveComponent implements OnInit {
  display: boolean = false;
  items: MenuItem[];
  title: string;

  approveRemarks: string;
  filtercompany: any;
  currentUserData: User;
  LeaveDatas: Array<ViewLeaveDataModel>;
  fromdate: Date;

    sortOrder: 'asc' | 'desc' = 'asc';
      sortedData: any[] = [];


  enddate: Date;
  empName: string;
  companies: any[] = [];

  /** Handsontable  */
  tableSettings: any = {
    viewportColumnRenderingOffset: 27,
    viewportRowRenderingOffset: "auto",
    height: 450,
    allowInsertColumn: false,
    allowInsertRow: false,
    stretchH: "all",
    maxRows: 22,
    manualRowResize: true,
    manualColumnResize: true,
    autoWrapRow: true,
    minSpareRows: false,
    columnSorting: true,
    fillHandle: true,
    licenseKey: 'non-commercial-and-evaluation',

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
          if (value == 0) TD.innerHTML = `Pending  .  <button class="delete" style="background:red; color:#fff; border:1px solid #ddd;">Approve</button>`;
          if (value == 1) TD.innerHTML = `Processed<button  class="delete" style="background:red; color:#fff; border:1px solid #ddd;">Approve</button>`;
          // if (value == 2) TD.innerHTML = `<button  style="background:red; border:1px solid #ddd;">Rejected</button>`;

          return TD;
        }
      }
    ],
    afterOnCellMouseDown: (event, coords, TD) => {
      if (event.realTarget.nodeName.toLowerCase() === 'button' && coords.col === 7) {
        this.uploaddata(coords["row"], coords["col"]);

      }
    },
    colHeaders: ["ID", "Leave Type", "From Date", "End Date", "Total Days", "Reason", "ReqDate", "Status"],
    manualRowMove: true,
    manualColumnMove: true,
    contextMenu: true,
    filters: true,
    dropdownMenu: true,


  };
  staffList: any;


  updatestatus() {
    return "<h1>sdfdsfds</h1>"
  }

  showDialog() {
    this.display = true;
  }


  /** Hands-on-table  */

  constructor(private LeavdataService: LeaveDataService,
    private authService: AuthenticationService,
    private navCtrl: Router,
    private messageService: MessageService,

  ) { }

  ngOnInit(): void {
    this.title = "Next";
    this.fromdate;
    this.LeaveDatas = [];
    this.GeComapnyMasterGroup()
    this.currentUserData = this.authService.currentUserValue;
    this.filterData();
    this.GetallStaff()
    this.sortItems();
   //this.GetallStaffBYworkgroupId( this.currentUserData.id,this.currentUserData.workgroupid)
  }

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


  GeComapnyMasterGroup() {
    this.LeavdataService.GetCompanyMasterDropdown().subscribe((response: any) => {
      //   alert(JSON.stringify(response))
      if (response && response.length > 0) {

        this.companies = response.map((data) => ({
          label: data.name,
          value: data.id
        }))

        this.companies.unshift({ label: '--Select--', value: -1 });
        // alert(JSON.stringify(this.companies))
      }
    })
  }


  Aproveforward(leavDataId: number) {
    this.navCtrl.navigateByUrl(`/user/leaveapproval?leaveId=${leavDataId}`)
    // this.navCtrl.navigate(['/user/leaveapprovad'], {
    //   queryParams: {
    //     leaveId: leavDataId
    //   },
    //   queryParamsHandling: 'merge', // Optional: use if you want to merge with existing query params
    // });
  }
  getSeverity(status: number) {
    switch (status) {
      case 0:
        return 'danger';

      case 1:
        return 'success';

     
    }
  }

  updateleave(Leavid: number) {
    this.approveRemarks = "";

    this.LeavdataService.ApproveLeaveData(Leavid, 2, this.currentUserData.id, this.approveRemarks).subscribe(res => {

      if (res == null)

        this.messageService.add({ severity: 'error', summary: 'Network error', detail: 'Netwrok error, try again' });
      else

        this.messageService.add({ severity: 'success', summary: 'Update Successfully', detail: 'Approved' });
      this.ReloadData();

    },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'cant Approve ' });
      }
    )
  }

  uploaddata(row: number, col: number) {
    this.approveRemarks = "";

    this.LeavdataService.ApproveLeaveData(this.LeaveDatas[row]["leavDataId"], 2, this.currentUserData.id, this.approveRemarks).subscribe(res => {

      if (res == null)

        this.messageService.add({ severity: 'error', summary: 'Network error', detail: 'Netwrok error, try again' });
      else

        this.messageService.add({ severity: 'success', summary: 'Update Successfully', detail: 'Approved' });
      this.ReloadData();

    },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'cant Approve ' });
      }
    )
  }


  ReloadData() {

    this.filterData();
    this.display = false;
  }

  GetDate(date: Date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    let returnDate = yyyy + '-' + mm + '-' + dd;
    return returnDate;
  }
  filterData() {

    var fromDateStr: any = "";
    var endDateStr: any = "";
    var empNameStr = null;
    if (this.fromdate == null)
      fromDateStr = "01-01-1900";
    else
      //fromDateStr = this.fromdate;
      fromDateStr = this.GetDate(new Date(this.fromdate));
    if (this.enddate == null)
      endDateStr = "01-01-2080";
    else
      //endDateStr =this.GetDate(this.enddate);
      endDateStr = this.GetDate(new Date(this.enddate));

    if (this.empName == null || this.empName == undefined || this.empName == "") {
      empNameStr = -1;

    }
    else {
      empNameStr = this.empName;
    }

    var companyId = 0;
    // alert(JSON.stringify(this.filtercompany));

    if (this.filtercompany == null || this.filtercompany == undefined) {
      companyId = -1;

    }
    else {
      companyId = this.filtercompany;
    }

    this.LeavdataService.FilterPendingLeavesDatas(empNameStr, fromDateStr, endDateStr, companyId).subscribe(res => {

      this.LeaveDatas = res;
       this.sortedData = [...this.LeaveDatas];

      this.title = this.fromdate.toDateString() + "  - " + this.enddate.toDateString() + " (" + this.LeaveDatas.length + ")";

    }
    );
  };
  GetallStaff(){
    this.LeavdataService.GetallStaff().subscribe(res=>{
      if (res && res.length > 0) {
        this.staffList = res.map((data) => ({
          label: data?.fullName,
          value: data?.staffId
        }))
  
        this.staffList.unshift({ label: '--Select--', value: -1 });
      }
  
    })
  }
    GetallStaffBYworkgroupId(id,workgroupid){
    this.LeavdataService.GetallStaffBYworkgroupId(id,workgroupid).subscribe(res=>{
      console.log("get staff by Id",res)
      if (res && res.length > 0) {
        this.staffList = res.map((data) => ({
          label: data?.staff.fullName,
          value: data?.staff.staffId
        }))
  
        this.staffList.unshift({ label: '--Select--', value: -1 });
      }
  
    })
  }
}
