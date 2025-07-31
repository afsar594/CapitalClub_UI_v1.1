import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';
import {  MemoModel } from '../_models/memo.model';
import { map } from 'rxjs/operators';
import { ViewLeaveDataModel } from '../_models/viewLeavData.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    apiUrl:string;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    constructor(private http: HttpClient) {
        this.apiUrl = environment.apiUrl;
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    GetCount(empid:number){
        return this.http.get<any>( this.apiUrl+"leave/GetCount/"+empid).pipe(map(leavedatas=>{
            return leavedatas
        }))
    }
    ReadMemoDatas(empid:number){
        return this.http.get<Array<MemoModel>>( this.apiUrl+"memo/get/"+empid).pipe(map(memodata=>{
            return memodata
        }))
    }
    ReadLeavePendingDatas(empid:number){
        return this.http.get<Array<ViewLeaveDataModel>>( this.apiUrl+"leave/getleavependingdata/"+empid).pipe(map(leavedatas=>{
            return leavedatas
        }))
    }
}