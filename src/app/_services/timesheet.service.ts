import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TimesheetDataModel } from '../_models/timesheetData.model';
import { map } from 'rxjs/operators';
import { ViewTimesheetModel } from '../_models/viewtimesheet.model';
import { TimesheetPreviewModel } from '../_models/timesheetPreview.model';
import { MultiStaffTimesheetPreviewModel } from '../_models/multiStafftimesheetpreviewModel';
import { environment } from 'src/environments/environment';
import { TimesheetMultiStaffDataModel } from '../_models/timesheetMultiStaffData.model';

@Injectable({ providedIn: 'root' })
export class TimesheetService {
    apiUrl:string;
    constructor(private http: HttpClient) {
        this.apiUrl =environment.apiUrl;
    }

    create(timesheet: TimesheetDataModel){

        return this.http.post<TimesheetDataModel>(this.apiUrl+'timesheet/newtimesheet', timesheet).pipe(map(timesheet=>{
            return timesheet;
        }));
    }
    
    // UpdateTSheet(timesheet: TimesheetDataModel){

    //     return this.http.post<TimesheetDataModel>(this.apiUrl+'timesheet/Updatetimesheet', timesheet).pipe(map(timesheet=>{
    //         return timesheet;
    //     }));
    // }

    GetTimesheets(empid:number){
        return this.http.get<Array<ViewTimesheetModel>>(this.apiUrl+'timesheet/Get/'+empid).pipe(map(timesheets=>{
            return timesheets;
        }));
    }
    filtertmesheets(empid:number, month:number, year:number){
        return this.http.get<Array<ViewTimesheetModel>>(this.apiUrl+'timesheet/filtertmesheets/'+empid+'/'+month+'/'+year).pipe(map(timesheets=>{
            return timesheets;
        }));
    }
    GetCurrentTimesheet(empid:number){
        return this.http.get<Array<MultiStaffTimesheetPreviewModel>>(this.apiUrl+'timesheet/getcurrent/'+empid).pipe(map(timesheets=>{
            return timesheets;
        }));
    }
    // GetTimesheetData(id:number){
    //     return this.http.get<Array<MultiStaffTimesheetPreviewModel>>(this.apiUrl+'multistafftimesheet/GetData/'+id).pipe(map(timesheetData=>{
    //         return timesheetData;
    //     }));
    // }

    GetTimesheetData(id:number){
        return this.http.get<any>(this.apiUrl+'timesheet/GetData/'+id)
        .pipe(map(timesheetData=>{
            return timesheetData;
        }));
    }

    GetTimesheetDataByDate1(Tdate:string, empid:number){
        return this.http.get<Array<MultiStaffTimesheetPreviewModel>>(this.apiUrl+'timesheet/getdatabydate/'+Tdate+'/'+empid+'/'+true).pipe(map(timesheetData=>{
            return timesheetData;
        }));
    }
    GetTimesheetDataByDate(Tdate:string, empid:number){
        return this.http.get<Array<MultiStaffTimesheetPreviewModel>>(this.apiUrl+'timesheet/getdatabydate/'+Tdate+'/'+empid+'/'+false).pipe(map(timesheetData=>{
            return timesheetData;
        }));
    }

}