import { Component, OnInit } from '@angular/core';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
//library.add(fas, far);
import { DashboardService } from "../../../_services/dashboard.service"
import { MemoModel } from 'src/app/_models/memo.model';
import { AuthenticationService } from 'src/app/_services';
import { User } from 'src/app/_models/user';
import { ViewLeaveDataModel } from 'src/app/_models/viewLeavData.model';
import { LeaveTypeService } from 'src/app/_services/leaveType.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
 displayModal: boolean = false;
  username: string;
  userPwd: string;
  usrImg: string;
  userstaffName: string;
  userDesignation: any;
  userPassportNo: string;
  showModal() {
    this.displayModal = true;
  }
    // rowHeaders: true,
  tableSettings: any = {
    viewportColumnRenderingOffset: 27,
    viewportRowRenderingOffset: "auto",
    minSpareRows: true,
    height: 450,
    stretchH: "all",

    manualRowResize: false,
    manualColumnResize: false,
    autoWrapRow: true,
    columnSorting: true,
    fillHandle: false,

    columns: [
      {
        data: 'memoId',
        type: 'numeric',
        width: 40,
        readOnly: true

      },
      {
        data: 'memoDate',

        type: 'date',
        readOnly: true,
        dateFormat: 'MM/DD/YYYY'
      },
      {
        data: 'reply',
        type: 'text',
        readOnly: true
      },
      {
        data: 'remarks',
        type: 'text',
        readOnly: true,
      }

    ],
    colHeaders: ["Memo ID", "Date", "Reply", "Remarks"],
    manualRowMove: true,
    manualColumnMove: true,
    contextMenu: true,
    licenseKey: 'non-commercial-and-evaluation',

    filters: true,
    dropdownMenu: true,
    afterValidate: function (isValid, value, row, prop) {

      console.log(row);

      if (value == false) {

        console.log(value, row, prop)

      }

    }
  };


  /** Handsontable  */
  tableSettings1: any = {

    viewportColumnRenderingOffset: 27,
    viewportRowRenderingOffset: "auto",

    height: 450,

    stretchH: "all",

    maxRows: 22,
    manualRowResize: false,
    manualColumnResize: false,
    autoWrapRow: true,
    //minSpareRows: true,
    columnSorting: true,
    fillHandle: false,
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
        dateFormat: 'MM/DD/YYYY'
      },
      {
        data: 'leaveDataTo',
        type: 'date',
        readOnly: true,
        dateFormat: 'MM/DD/YYYY'
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

    ],
    colHeaders: ["ID", "Leave Type", "From Date", "End Date", "Total Days", "Reason", "ReqDate", "Status"],
    manualRowMove: true,
    manualColumnMove: true,
    licenseKey: 'non-commercial-and-evaluation',

    contextMenu: true,
    filters: true,
    dropdownMenu: true,
    afterValidate: function (isValid, value, row, prop) {

      console.log(row);

      if (value == false) {

        console.log(value, row, prop)

        //Value = isValid
        // row = inserted invalid value
        //prop = row index changed
      }

    }
  };


  MemoData: Array<MemoModel>;
  PendingREquest: Array<ViewLeaveDataModel>;
  leavedataApproval: number;
  leavedataPending: number;
  servicedataApproval: number;
  servicedataPending: number;

  currentUserData: User;
  constructor(
    private DashboardService: DashboardService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.currentUserData = this.authService.currentUserValue;
    this.username = this.currentUserData.username;
    this.userPwd = this.currentUserData.userPwd;
    this.usrImg = this.currentUserData.userImg != null && this.currentUserData.userImg?.length > 0 ? 'data:image/png;base64,' + this.currentUserData.userImg : null
    this.userstaffName =  this.currentUserData.userstaffName;
    this.userPassportNo = this.currentUserData.userPassportNo;
    this.userDesignation = this.currentUserData.userDesignation;

   console.table(this.currentUserData)
    this.DashboardService.GetCount(this.currentUserData.id).subscribe(res => {
      this.leavedataApproval = res["approval"];
      this.leavedataPending = res["pending"];
      this.servicedataApproval = res["serviceApproval"];
      this.servicedataPending = res["servicePending"];    
    })

    this.DashboardService.ReadMemoDatas(this.currentUserData.id).subscribe(res => {
      this.MemoData = res;
    })
    this.DashboardService.ReadLeavePendingDatas(this.currentUserData.id).subscribe(res => {
      this.PendingREquest = res;

    })
   
  }

  ngAfterViewInit() {

    //   this.tableInstance = this.hotRegisterer.getInstance('table-instance1');

    //  // let columnData = this.generateColumns();

    //   this.tableInstance.updateSettings({
    //     data: this.PendingREquest,
    //   });
    // this.tableInstance.render();

  }
}
