export interface  ViewLeaveDataModel{
    length: any;
    leavDataId:number;
    leaveDataFrom:string;
    leaveDataTo:Date;
    leaveDays:number
    leaveDataReason:string;
    reqDate:Date;
    approveDate;
    status:number;
    leaveDataTypeNavigation:LeaveDataTypeNavigation;
    leaveemp?:LeaveEmp;
    leaveEmpName?:string;
    companyName:string;
}

export interface CompanyDataModel{
    id:number;
     name:string;
}

export interface LeaveDataTypeNavigation{
    leaveType:string;
}

export interface LeaveEmp{
    userName : string;
}