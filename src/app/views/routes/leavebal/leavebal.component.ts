import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeaveBalModel } from 'src/app/_models/leavebal.model';
import { User } from 'src/app/_models/user';
import { AuthenticationService } from 'src/app/_services';
import { LeaveDataService } from 'src/app/_services/leaveData.service';
import { LeaveTypeService } from 'src/app/_services/leaveType.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-leavebal',
  templateUrl: './leavebal.component.html',
  styleUrls: ['./leavebal.component.scss']
})
export class LeavebalComponent implements OnInit {
delpartmentID:any
  leaveBalances: any[]=[];
  currentUserData: User;
  delpartmentArray: any;
     constructor( 
      private activatedroute:ActivatedRoute,
      private leavetype:LeaveTypeService,
      private authService: AuthenticationService,
      private messageService: MessageService,
      private LeavdataService: LeaveDataService,
      ) { }


      
    ngOnInit(): void {
    
      this.currentUserData = this.authService.currentUserValue;
      this.getAllDepartments()
     // this.fetchLeaveBalances();
     this.filterData()
    }
    fetchLeaveBalances(): void {
      this.leavetype.getLeaveBalances(this.currentUserData.id,this.currentUserData.workgroupid,-1).subscribe(
        (data: any) => {
          this.leaveBalances = data;
           this.delpartmentID = null;        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Alert',
            detail: 'Error fetching leave balances',
          });
        }
      );
    }
    exportToExcel(): void {
      if (this.leaveBalances.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Alert',
          detail: 'No leave balances available to export',
        });
        return;
      }
      // Convert leaveBalances to a new format where headers are in uppercase
      const formattedLeaveBalances = this.leaveBalances.map((item: any) => 
        ({
        'STAFF CODE': item.staffCode,
        'NAME': item.fullName,
        'LEAVE TYPE':item.leaveType,
        'COMPANY': item.companyName,
        'DATE OF JOIN': item.joiningDate,
        'BALANCE': item.totalLeaveBalance
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
        { wch: 20 },  // Company column width
        { wch: 20 },  // Company column width
        { wch: 30 },  // Date of Join column width
        { wch: 10 }   // Balance column width
      ];
    
      // Create a workbook and add the worksheet
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Leave Balances': worksheet },
        SheetNames: ['Leave Balances'],
      };
    
      // Generate the Excel file and trigger the download
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'leave_balances');
    }
    
    private saveAsExcelFile(buffer: any, fileName: string): void {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, `${fileName}.xlsx`);
    }
    

     filterData() {

   
    var departmentId = null;
 

    if (this.delpartmentID == null || this.delpartmentID == undefined) {
      departmentId = -1;

    }
    else {
      departmentId = this.delpartmentID;
    }

     this.leavetype.getLeaveBalances(this.currentUserData.id,this.currentUserData.workgroupid,departmentId).subscribe(
        (data: any) => {
          this.leaveBalances = data;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Alert',
            detail: 'Error fetching leave balances',
          });
        }
      );
  };
  getAllDepartments()
  {
    this.LeavdataService.Getalldepartments().subscribe((response)=>{
    if (response && response.length > 0) {

        this.delpartmentArray = response.map((data) => ({
          label: data.department,
          value: data.departmentId
        }))
      //  this.delpartmentArray.unshift({ label: '--Select--', value: -1 });
      }

    })
  }
  clear()
  {
     this.fetchLeaveBalances();
  }
    
}
