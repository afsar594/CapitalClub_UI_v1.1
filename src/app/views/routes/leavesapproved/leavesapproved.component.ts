import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { User } from 'src/app/_models/user';
import { ViewLeaveDataModel } from 'src/app/_models/viewLeavData.model';
import { AuthenticationService } from 'src/app/_services';
import { LeaveDataService } from 'src/app/_services/leaveData.service';

@Component({
  selector: 'app-leavesapproved',
  templateUrl: './leavesapproved.component.html',
  styleUrls: ['./leavesapproved.component.scss']
})
export class LeavesapprovedComponent implements OnInit {
  display: boolean = false;
  items: MenuItem[];
  title: string;
  filtercompany:any

  approveRemarks: string;

  currentUserData: User;
  LeaveDatas: Array<ViewLeaveDataModel>;
  fromdate: Date;
  enddate: Date;

      sortOrder: 'asc' | 'desc' = 'asc';
      sortedData: any[] = [];

  empName: any=null;

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
          if (value == 0) TD.innerHTML = `Pending `;
          if (value == 1) TD.innerHTML = `Processed`;
          if (value == 2) TD.innerHTML = `Approved `;
          if (value == 3) TD.innerHTML = `Rejected`;

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
    afterValidate: function (isValid, value, row, prop) {


      if (value == false) {

        alert("Invalid")
      }

    }
  };
  companies: any;
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
    this.currentUserData = this.authService.currentUserValue;
    this.filterData();
    this.title = "LEAVE APPROVED / REJECTED";

    // this.LeavdataService.ReadLeaveDatas(this.currentUserData.id).subscribe(res => {
    //   this.LeavdataService. FilterApprovedLeaveDatas().subscribe(res => {

    //   this.LeaveDatas = res;
   
 
     

    // }
    // );

    this.items = [
      //   {label: 'Pending', icon: 'pi pi-minus-circle', command: () => {
      //      // this.update();
      //   }},
    ];
    this.GeComapnyMasterGroup()
    this.GetallStaff();
    this.sortItems();

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

  // Aproveforward(levid:number){
  //   this.navCtrl.navigate(['/user/leaveapproval'],{
  //     queryParams: {
  //       leaveId: levid
  //     } ,queryParamsHandling: 'merge',
  //   });
  // }

 updateleave(Leavid:number){
  this.approveRemarks = "";

  this.LeavdataService.ApproveLeaveData(Leavid,2,this.currentUserData.id,this.approveRemarks).subscribe(res => {

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

    this.LeavdataService.ApproveLeaveData(this.LeaveDatas[row]["leavDataId"],2,this.currentUserData.id,this.approveRemarks).subscribe(res => {

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

  /** HANDSONTABLE FUNCTION  */

  detectChanges = (hotInstance, changes, source) => {
    console.log(changes);

  };




  filterData() {

    var fromDateStr="";
    var endDateStr="";
    var empNameStr=null;
    var companyId=null;
    if(this.fromdate==null)
    fromDateStr="01-01-1900";
    else
    fromDateStr=this.fromdate.toDateString();
    if(this.enddate==null)
    endDateStr="01-01-2080";
  else
  endDateStr=this.enddate.toDateString();

  if(this.empName==null || this.empName==undefined || this.empName=="")
  {
    empNameStr=-1;

  }
  else
  {
    empNameStr=this.empName;
  }
  if(this.filtercompany==null || this.filtercompany==undefined || this.filtercompany=="")
    {
      companyId=-1;
  
    }
    else
    {
      companyId=this.filtercompany;
    }


  //  if (this.fromdate != null && this.enddate != null)
      this.LeavdataService.FilterApprovedLeaveDatas(empNameStr, fromDateStr,endDateStr,companyId).subscribe(res => {

        this.LeaveDatas = res;
        this.sortedData = [...this.LeaveDatas];


        // if (!text) {
        //   this.LeaveDatas = this.LeaveDatas;
        //   return;
        // }

        // this.LeaveDatas = this.LeaveDatas.filter(
        //   housingLocation => housingLocation?.leaveEmpName.toLowerCase().includes(text.toLowerCase())
        // );
        this.title = this.fromdate.toDateString() + "  - " + this.enddate.toDateString() + " (" + this.LeaveDatas.length + ")";

      }
      );
  };

  // filterData() {
  //     this.LeavdataService.FilterApprovedLeaveDatas().subscribe(res => {

  //       this.LeaveDatas = res;
  //       this.title = this.fromdate.toDateString() + "  - " + this.enddate.toDateString() + " (" + this.LeaveDatas.length + ")";

  //     }
  //     );
  // };
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
}
