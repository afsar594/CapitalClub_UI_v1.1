export interface ViewTimesheetModel{
    year:number;
    //timesheetdate:Date;
    treeMonths:treeMonths[]
}

export interface treeMonths{
    month:number;
    monthName:string;
    treeDay:treeDay[]
}
export interface treeDay{
    day:number;
    dayName:string;
    timesheetID:number;
}