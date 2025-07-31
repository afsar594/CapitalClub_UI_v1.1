import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CheckinModel } from '../_models/checkin.model';
import { CurrentInfo } from '../_models/currentInfo.model';
import { NewAttendanceModel } from '../_models/newAttendance.model';
import { BreakTimeModel } from '../_models/breakTime.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AttendanceService {

    apiUrl:string;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.apiUrl =  environment.apiUrl;

        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    
    GetStatus(){
        return this.http.get<CheckinModel>(this.apiUrl+'atd/status/'+this.currentUserValue.id).pipe(map(CheckInDet=>{
            return CheckInDet;
        }));
    }
    
    GetTime(){
        return this.http.get<CurrentInfo>(this.apiUrl+'atd/currenttime').pipe(map(currentInfo=>{
            //console.log("sdfds");
    
        return currentInfo;
        }));
    }
    GetBreakTime(){
        return this.http.get<BreakTimeModel>(this.apiUrl+'atd/breaktime/'+this.currentUserValue.id).pipe(map(lastbreakTime=>{
            return lastbreakTime;
        }));
    }

    DochekIN(Newdata:FormData){
      //  Newdata. =this.currentUserValue.id;
console.dir(Newdata);
        console.dir(Newdata);

        return this.http.post<any>(this.apiUrl+'atd/checkin', Newdata).pipe(map(Res=>{
            return Res;
        }));
    }

    DochekIN2(Newdata:FormData){

        Newdata.append('empId', this.currentUserValue.id.toString());

        //  Newdata. =this.currentUserValue.id;
  
          return this.http.post<any>(this.apiUrl+'atd/checkin2', Newdata).pipe(map(Res=>{
              return Res;
          }));
      }
    DoBreak(Newdata:NewAttendanceModel){
        Newdata.empID =this.currentUserValue.id;
        return this.http.post<any>(this.apiUrl+'atd/checkin', Newdata).pipe(map(Res=>{
            return Res;
        }));
    }
}