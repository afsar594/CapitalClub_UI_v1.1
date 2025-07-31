import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { MemoModel } from '../_models/memo.model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class MemoService {
    apiUrl:string;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    constructor(private http: HttpClient) {
        this.apiUrl = environment.apiUrl;
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    ReadMemoDatas(empid:number){
        return this.http.get<Array<MemoModel>>( this.apiUrl+"memo/getall/"+empid).pipe(map(memodata=>{
            return memodata
        }))
    }

}