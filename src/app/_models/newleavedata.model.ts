import { LeaveTypeModel } from './leaveType.model';

export interface NewLeaveDataModel{

    LeaveType:LeaveTypeModel;
    Fromdate:Date;
    EndDate:Date;
    Reason:string;
    EmployeeID?:number;
    TotalDays?:number;
    imageFile?:any;
}

export class ApiResponse<T>
{
    result?: T;
    valid?: boolean;
    error?: boolean;
    message?: string;
    exception?: string;
    status?:string;
}