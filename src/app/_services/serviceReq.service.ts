import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceTypeReqModel } from '../_models/serviceTypeReq.model';
import { map } from 'rxjs/operators';
import { NewServiceReqModel } from '../_models/newServiceReq.model';
import { ViewServiceRequestModel } from '../_models/viewserviceReq.model';
import { ViewStaffModel } from '../_models/viewserviceReq.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ServiceReqService {
    apiUrl:string;
    constructor(private http: HttpClient) {
        this.apiUrl= environment.apiUrl;

    }

        SendNewServiceRequest(ReqData: NewServiceReqModel){
            console.log(ReqData);
        return this.http.post<NewServiceReqModel>(this.apiUrl+'service/sendrequest', ReqData).pipe(map(ReqData=>{
        return ReqData;
        }));
        }
    ReadServiceDatas(empid:number){
        return this.http.get<Array<ViewServiceRequestModel>>(this.apiUrl+"service/getservices/"+empid).pipe(map(Services=>{
             return Services
        }))
     }

     ReadStaffDatas(empid:number){
        return this.http.get<ViewStaffModel>(this.apiUrl+"service/getStaffById/"+empid).pipe(map(Services=>{
             return Services
        }))
     }

     FilterServiceDatas(empid:number, fromdate:string, enddate:string){
     
        return this.http.get<Array<ViewServiceRequestModel>>( this.apiUrl+"service/getserviceFldata/"+empid+"/"+fromdate+"/"+enddate).pipe(map(leavedatas=>{
            return leavedatas
        }))
    }

     ReadServiceDataById(SId:number){
        return this.http.get<Array<ViewServiceRequestModel>>(this.apiUrl+"service/getservicesbyId/"+SId).pipe(map(Services=>{
             return Services
        }))
     }

    //  ReadAllServiceDatas(){
    //     return this.http.get<Array<ViewServiceRequestModel>>(this.apiUrl+"service/getallservice").pipe(map(Services=>{
    //          return Services
    //     }))
    //  }

     ReadAllServiceDatas(staffName:number , fromdate:string, enddate:string,companyId:number,typeId){
      
        return this.http.get<Array<ViewServiceRequestModel>>( this.apiUrl+"service/getallservice/"+staffName+"/"+fromdate+"/"+enddate+"/"+companyId+"/"+typeId).pipe(map(Services=>{
            return Services
        }))
    }
   ReadAllApprovedServiceDatas(staffName:number , fromdate:string, enddate:string, companyId:number, typeId:number,serviceReqStatus:number) {
  return this.http.get(this.apiUrl + "service/getall_Approved_Service/" + staffName + "/" + fromdate + "/" + enddate + "/" + companyId + "/" + typeId + "/"+serviceReqStatus)
    .pipe(map(Services => {
      return Services;
    }));
}



    GetServiceType(){
        return this.http.get<Array<ServiceTypeReqModel>>(this.apiUrl+"service/getserviceType").pipe(map(ServiceTypes=>{
            return ServiceTypes;
        }))
    }
    DeleteLeaveData(leaveData: number){
        return this.http.get<ServiceTypeReqModel>( this.apiUrl+'service/delete/'+leaveData).pipe(map(LeaveData=>{
            return LeaveData;
        }));
    }

    UpdateApprovalData(leaveData: number,empid:number){
        return this.http.get<ServiceTypeReqModel>( this.apiUrl+'service/UpdateApproval/'+leaveData +'/' +empid).pipe(map(LeaveData=>{
            return LeaveData;
        }));
    }


    ServiceApproval(Sid: number,Stid:number,empid:number,StRem:string){
        return this.http.get<ServiceTypeReqModel>( this.apiUrl+'service/UpdateApproval/' +Sid +'/' + Stid +'/' +empid + '/'+ StRem).pipe(map(LeaveData=>{
            return LeaveData;
        }));
    }
    GetAllStaff(){
        return this.http.get(this.apiUrl+"service/getallstaff").pipe(map(ServiceTypes=>{
            return ServiceTypes;
        }))
    }
}