import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LeaveTypeModel } from '../_models/leaveType.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../_models/newleavedata.model';

@Injectable({ providedIn: 'root' })
export class LeaveTypeService {

    apiUrl:string;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    constructor(private http: HttpClient) {
        this.apiUrl = environment.apiUrl;
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        
    }



    
   getLeaveTypeById(userId: any) {
  console.log("id in service");

  return this.http.get<Array<LeaveTypeModel>>(`${this.apiUrl}leavetype/GetLeaveTypebyId/${userId}`)
    .pipe(
      map(leaveTypes => {
        console.log(leaveTypes);
        return leaveTypes;
      })
    );
}


    GetLeaveType(){
        return this.http.get<Array<LeaveTypeModel>>( this.apiUrl+'leavetype/get').pipe(map(leaveTypes=>{
           // console.log("66666");
           console.log(leaveTypes)
            return leaveTypes;
        }));
    } 

GetAllUsers() {
  return this.http.get(this.apiUrl + 'leavetype/GetAllUsers')
    .pipe(
      map(leaveTypes => {
        console.log(leaveTypes);
        return leaveTypes;
      })
    );
}



    getLeaveBalances(empid: number,workgroupId:number) {
        return this.http.get<ApiResponse<any[]>>(this.apiUrl + 'leave/getallLeaveBalanace/'+ empid+"/"+workgroupId);
      }

   getholidaysbyDate(fromdate:string, enddate:string){
           
              return this.http.get<Array<any>>( this.apiUrl+"leave/getalllHolidaysbyDate/"+fromdate+"/"+enddate).pipe(map(leavedatas=>{
                  return leavedatas
              }))
          }
      
}