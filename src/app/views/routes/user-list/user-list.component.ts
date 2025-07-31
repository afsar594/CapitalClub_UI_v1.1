import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services';
import { LeaveTypeService } from 'src/app/_services/leaveType.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
import { LeaveDataService } from 'src/app/_services/leaveData.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  currentUserData: any;
  Userlist: any = 0;
  companies: any;
  constructor(
    private leaveTypeAService: LeaveTypeService,
    private authService: AuthenticationService,
    private messageService: MessageService,
    private LeavdataService: LeaveDataService,
  ) {

  }
  ngOnInit(): void {
    this.currentUserData = this.authService.currentUserValue;
    this.GeComapnyMasterGroup()
    if (this.currentUserData.workgroupid == 1) {
      this.GetAllUsers()
    }
  }

  GetAllUsers() {
    this.leaveTypeAService.GetAllUsers().subscribe(res => {
      this.Userlist = res
    })
  }
  exportToExcel(): void {
    if (this.Userlist.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Alert',
        detail: 'No Users available to export',
      });
      return;
    }
    // Convert leaveBalances to a new format where headers are in uppercase
    const formattedLeaveBalances = this.Userlist?.map((item: any) =>
    ({
      'Staff_CODE': item.staffCode,
      'NAME': item.staffName,
      'COMPANY': this.getCompanyNameById(item.companyId),
      'USER_NAME': item.userName,
      'PASSWORD': item.passwd
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
      { wch: 50 },  // Company column width
      { wch: 20 },  // Company column width
      { wch: 30 },  // Date of Join column width
      { wch: 10 }   // Balance column width
    ];

    // Create a workbook and add the worksheet
    const workbook: XLSX.WorkBook = {
      Sheets: { 'User List': worksheet },
      SheetNames: ['User List'],
    };

    // Generate the Excel file and trigger the download
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'User List');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
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
  getCompanyNameById(id) {
    return this.companies.find((res) => res.value == id)?.label;
  }

}
