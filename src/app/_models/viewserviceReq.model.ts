import { ServiceTypeReqModel } from './serviceTypeReq.model';

export interface ViewServiceRequestModel{
    serviceReqId:number;
    serviceReqDate:Date;
    serviceReqReason:string;
    serviceReqTypeNavigation:ServiceTypeReqModel;
    serviceReqStatus:number;
    hruser:string;
    companyName:string;
}


export interface ViewStaffModel{
    staffId:number;
    doj:Date;
  
}


export interface ServiceEmp{
    userName : string;
}