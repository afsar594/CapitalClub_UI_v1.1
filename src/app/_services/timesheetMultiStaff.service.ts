import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TimesheetDataModel } from '../_models/timesheetData.model';
import { map } from 'rxjs/operators';
import { ViewTimesheetModel } from '../_models/viewtimesheet.model';
import { TimesheetPreviewModel } from '../_models/timesheetPreview.model';
import { environment } from 'src/environments/environment';
import { TimesheetMultiStaffDataModel } from '../_models/timesheetMultiStaffData.model';

@Injectable({ providedIn: 'root' })
export class TimesheetMultiStaffService {
    apiUrl:string;
    constructor(private http: HttpClient) {
        this.apiUrl =environment.apiUrl;
    }

    create(timesheetmultiStaff: TimesheetMultiStaffDataModel){
        console.dir(timesheetmultiStaff);
        return this.http.post<TimesheetMultiStaffDataModel>(this.apiUrl+'multistafftimesheet/newtimesheet', timesheetmultiStaff).pipe(map(timesheet=>{
            return timesheetmultiStaff;
        }));
    }
    
    GetTimesheets(empid:number){
        return this.http.get<Array<ViewTimesheetModel>>(this.apiUrl+'multistafftimesheet/Get/'+empid).pipe(map(timesheetmultiStaff=>{
            return timesheetmultiStaff;
        }));
    }
    filtertmesheets(empid:number, month:number, year:number){
        return this.http.get<Array<ViewTimesheetModel>>(this.apiUrl+'multistafftimesheet/filtertmesheets/'+empid+'/'+month+'/'+year).pipe(map(timesheetmultiStaff=>{
            return timesheetmultiStaff;
        }));
    }
    GetCurrentTimesheet(empid:number){
        return this.http.get<Array<TimesheetPreviewModel>>(this.apiUrl+'multistafftimesheet/getcurrent/'+empid).pipe(map(timesheetmultiStaff=>{
            return timesheetmultiStaff;
        }));
    }
    GetTimesheetData(id:number){
        return this.http.get<Array<TimesheetPreviewModel>>(this.apiUrl+'multistafftimesheet/GetData/'+id).pipe(map(timesheetData=>{
            return timesheetData;
        }));
    }
    GetTimesheetDataByDate1(Tdate:string, empid:number){
        return this.http.get<Array<TimesheetPreviewModel>>(this.apiUrl+'multistafftimesheet/getdatabydate/'+Tdate+'/'+empid+'/'+true).pipe(map(timesheetData=>{
            return timesheetData;
        }));
    }
    GetTimesheetDataByDate(Tdate:string, empid:number){
        return this.http.get<Array<TimesheetPreviewModel>>(this.apiUrl+'multistafftimesheet/getdatabydate/'+Tdate+'/'+empid+'/'+false).pipe(map(timesheetData=>{
            return timesheetData;
        }));
    }

}