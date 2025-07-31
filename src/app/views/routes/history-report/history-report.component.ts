import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ViewLeaveDataModel } from 'src/app/_models/viewLeavData.model';
import { ViewServiceRequestModel } from 'src/app/_models/viewserviceReq.model';
import { LeaveDataService } from 'src/app/_services/leaveData.service';
import { ServiceReqService } from 'src/app/_services/serviceReq.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-history-report',

  templateUrl: './history-report.component.html',
  styleUrl: './history-report.component.scss'
})
export class HistoryReportComponent {
  display: boolean = false;
  staffList: any;
  companies: any;
  ServiceDatas: any
  serviceTypee: any;

  filtercompany: any
  title: string;
  fromdate: Date;
  enddate: Date;
  sortedData: any[] = [];
  empName: any = null;
  serviceReqStatus: any;
    Action = [
    { value: -1, label: 'All' },
    { value: 2, label: 'Approved' },
    { value: 3, label: 'Rejected' }
  ];

  selectedValue = -1;


  constructor(
    private serviceReqService: ServiceReqService,
    private LeavdataService: LeaveDataService,
    private messageService: MessageService,
    
  ) { }
  ngOnInit(): void {
    this.title = "Next";
    this.fromdate;
    this.ServiceDatas = [];
    // this.currentUserData = this.authService.currentUserValue;
    this.filterData();
    this.title = "APPROVED / REJECTED";

    // this.LeavdataService.ReadLeaveDatas(this.currentUserData.id).subscribe(res => {
    //   this.LeavdataService. FilterApprovedLeaveDatas().subscribe(res => {

    //   this.LeaveDatas = res;




    // }
    // );


    this.GeComapnyMasterGroup()
    this.GetallStaff();
    // this.sortItems();

  }

  ReloadData() {

    this.filterData();
    this.display = false;
  }


  filterData() {

    var fromDateStr = "";
    var endDateStr = "";
    var empNameStr = null;
    var companyId = null;
    var serviceReqStatus=null;
    var serviceTypeId = null;
    if (this.fromdate == null)
      fromDateStr = "01-01-1900";
    else
      fromDateStr = this.fromdate.toDateString();
    if (this.enddate == null)
      endDateStr = "01-01-2080";
    else
      endDateStr = this.enddate.toDateString();
    if (this.empName == null || this.empName == undefined || this.empName == "") {
      empNameStr = -1;

    }
    else {
      empNameStr = this.empName;
    }
    if (this.filtercompany == null || this.filtercompany == undefined || this.filtercompany == "") {
      companyId = -1;

    }
    else {
      companyId = this.filtercompany;
    }
    if (this.serviceTypee == null || this.serviceTypee == undefined || this.serviceTypee == "") {
      serviceTypeId = -1;

    }
    else {
      serviceTypeId = this.serviceTypee.serviceReqTypeId;
    }
     if (this.serviceReqStatus == null || this.serviceReqStatus == undefined || this.serviceReqStatus == "") {
      serviceReqStatus = -1;

    }
    else {
      serviceReqStatus = this.serviceReqStatus;
    }
    this.serviceReqService.ReadAllApprovedServiceDatas(empNameStr, fromDateStr, endDateStr, companyId, serviceTypeId,serviceReqStatus).subscribe(res => {
      this.ServiceDatas = res;
    }
    );
    this.display = false;


  };
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
  GetallStaff() {
    this.LeavdataService.GetallStaff().subscribe(res => {
      if (res && res.length > 0) {
        this.staffList = res.map((data) => ({
          label: data?.fullName,
          value: data?.staffId
        }))

        this.staffList.unshift({ label: '--Select--', value: -1 });
        // alert(JSON.stringify(this.companies))
      }

    })
  }
      exportToExcel(): void {
        if (this.ServiceDatas.length === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Alert',
            detail: 'No Service Data available to export',
          });
          return;
        }
        // Convert ServiceDatas to a new format where headers are in uppercase
        const formattedLeaveBalances = this.ServiceDatas.map((item: any) => 
          ({
          'Staff Code': item.serviceReqId,
          'Staff Name': item.hruser,
          'Company Name':item.companyName,
          'Type': item.serviceReqTypeNavigation.serviceReqTypeName,
          'Reason': item.serviceReqReason,
          'Requested Date': item.serviceReqDate,
          'Action': item.serviceReqStatus==2?'Approved':'Rejected',

        }));
      
        // Convert the JSON data to a worksheet
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedLeaveBalances);
      
        // Get the range of the worksheet to apply styles
        const range = XLSX.utils.decode_range(worksheet['!ref']!);
      
        // Apply styles to the header row (first row)
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // First row (header)
          if (!worksheet[cellAddress]) continue; // Skip if the cell doesn't exist
      
          // Set bold font, uppercase text, and center-align header cells
          worksheet[cellAddress].s = {
            font: { bold: true }, // Make the font bold
            alignment: { vertical: 'center', horizontal: 'center' }, // Center-align headers
          };
        }
      
        // Apply center alignment to all data cells
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellAddress]) continue; // Skip if the cell doesn't exist
      
            // Center-align all data entries
            worksheet[cellAddress].s = {
              alignment: { vertical: 'center', horizontal: 'center' }
            };
          }
        }
      
        // Set column widths (wch: width in characters)
        worksheet['!cols'] = [
          { wch: 15 },  // Staff Code column width
          { wch: 45 },  // Name column width
          { wch: 45 },  // Company column width
          { wch: 20 },  // Company column width
          { wch: 45 },  // Date of Join column width
          { wch: 20 } ,  // Balance column width
          { wch: 20 } 
        ];
      
        // Create a workbook and add the worksheet
        const workbook: XLSX.WorkBook = {
          Sheets: { 'Service History Report': worksheet },
          SheetNames: ['Service History Report'],
        };
      
        // Generate the Excel file and trigger the download
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'Service History Report');
      }
      
      private saveAsExcelFile(buffer: any, fileName: string): void {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `${fileName}.xlsx`);
      }

    }
