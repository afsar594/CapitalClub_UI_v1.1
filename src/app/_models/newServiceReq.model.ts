import { ServiceTypeReqModel } from './serviceTypeReq.model';

export interface NewServiceReqModel{
    serviceReqType:ServiceTypeReqModel;
    serviceReqDate:Date;
    serviceReqEmp:number;
    serviceReqReason;
}