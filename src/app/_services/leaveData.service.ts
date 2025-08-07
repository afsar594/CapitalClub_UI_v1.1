import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { NewLeaveDataModel } from '../_models/newleavedata.model';
import { ApiResponse } from '../_models/newleavedata.model';
import { map } from 'rxjs/operators';
import { CompanyDataModel, ViewLeaveDataModel } from '../_models/viewLeavData.model';
import { environment } from 'src/environments/environment';
import { LeaveBalModel } from '../_models/leavebal.model';

@Injectable({ providedIn: 'root' })
export class LeaveDataService {
    getLeaveTypeById(arg0: number) {
      throw new Error('Method not implemented.');
    }
    apiUrl: string;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    constructor(private http: HttpClient) {
        this.apiUrl = environment.apiUrl;

        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    DeleteLeaveData(leaveData: number) {
        return this.http.get<NewLeaveDataModel>(this.apiUrl + 'leave/delete/' + leaveData).pipe(map(LeaveData => {
            return LeaveData;
        }));
    }

    ApproveLeaveData(leaveData: number, stStat: number, empid: number, StRem: string) {
        return this.http.get<NewLeaveDataModel>(this.apiUrl + 'leave/UpdateApprove/' + leaveData + "/" + stStat + "/" + empid + "/" + StRem).pipe(map(LeaveData => {
            return LeaveData;
        }));
    }

      UpdateApproveRequest(leaveData: number, stStat: number, empid: number, StRem: string,fromdate:string,enddate:string) {
        return this.http.get<NewLeaveDataModel>(this.apiUrl + 'leave/UpdateApproveRequest/' + leaveData + "/" + stStat + "/" + empid + "/" + StRem +"/"+ fromdate+"/"+ enddate).pipe(map(LeaveData => {
            return LeaveData;
        }));
    }

        ApproveMultiLeaveData(leaveData: number, stStat: number, empid: number, StRem: string) {
        return this.http.get<NewLeaveDataModel>(this.apiUrl + 'leave/UpdateMultiApprove/' + leaveData + "/" + stStat + "/" + empid + "/" + StRem).pipe(map(LeaveData => {
            return LeaveData;
        }));
    }

    GetCompanyMasterDropdown() {
        return this.http.get<Array<CompanyDataModel>>(this.apiUrl + 'leave/GetCompanies');
    }



    SendNewLeaveRequest(leaveData: NewLeaveDataModel) {
        return this.http.post<NewLeaveDataModel>(this.apiUrl + 'leave/sendrequest', leaveData).pipe(map(LeaveData => {
            return LeaveData;
        }));
    }
    ReadLeaveDatas(empid: number) {
        return this.http.get<Array<ViewLeaveDataModel>>(this.apiUrl + "leave/getleavedata/" + empid).pipe(map(leavedatas => {
            return leavedatas
        }))
    }

    ReadLeaveBalDatas(empid: number) {
        return this.http.get<Array<LeaveBalModel>>(this.apiUrl + "leave/getallLeaveBal/" + empid).pipe(map(leaveBaldata => {
            return leaveBaldata
        }))
    }
    ReadLeaveBalTypeDatas(empid: number, Lcode: number) {
        return this.http.get<Array<LeaveBalModel>>(this.apiUrl + "leave/getallLeaveBalType/" + empid + "/" + Lcode).pipe(map(leaveBaldata => {
            return leaveBaldata
        }))
    }


    FilterLeaveDatas(empid: number, fromdate: string, enddate: string) {
        return this.http.get<Array<ViewLeaveDataModel>>(this.apiUrl + "leave/getleaveFldata/" + empid + "/" + fromdate + "/" + enddate).pipe(map(leavedatas => {
            return leavedatas
        }))
    }

    LeaveDataswithID(Levid: number) {
        return this.http.get<ViewLeaveDataModel>(this.apiUrl + "leave/getleavedataID/" + Levid).pipe(map(leavedatas => {
            return leavedatas
        }))
    }

    FilterPendingLeaveDatas() {
        return this.http.get<Array<ViewLeaveDataModel>>(this.apiUrl + 'leave/getallleavependingdata').pipe(map(leavedatas => {
            return leavedatas
        }))
    }



    FilterPendingLeavesDatas(staffName: number, fromdate: string, enddate: string, companyId: number) {
        return this.http.get<Array<ViewLeaveDataModel>>(this.apiUrl + "leave/getallleavependingdata/" + staffName + "/" + fromdate + "/" + enddate + "/" + companyId).pipe(map(leavedatas => {
            return leavedatas
        }))
    }

   FilterPendingMultiLeavesDatas(staffName: number, fromdate: string, enddate: string, companyId: number, userId: number) {
       
        return this.http.get<Array<ViewLeaveDataModel>>(this.apiUrl + "leave/getallleavependingmultidata/" + staffName + "/" + fromdate + "/" + enddate + "/" + companyId+ "/" + userId).pipe(map(leavedatas => {
            return leavedatas
        }))
    }

    FilterApprovedLeaveDatas(staffName: number, fromdate: string, enddate: string,companyId:number) {
        return this.http.get<Array<ViewLeaveDataModel>>(this.apiUrl + "leave/getallleaveapproveddata/" + staffName + "/" + fromdate + "/" + enddate+"/"+companyId).pipe(map(leavedatas => {
            return leavedatas
        }))
    }
    GetallStaff() {
        return this.http.get<any>(this.apiUrl + 'leave/getallstaff');
    }
      Getalldepartments() {
        return this.http.get<any>(this.apiUrl + 'leave/getalldepartment');
    }

       GetallStaffBYworkgroupId(empid: number,WorkgroupId:number) {
        return this.http.get<Array<any>>(this.apiUrl + "leave/GetstaffByAdminId/" + empid+"/"+WorkgroupId).pipe(map(leaveBaldata => {
            return leaveBaldata
        }))
    }



}