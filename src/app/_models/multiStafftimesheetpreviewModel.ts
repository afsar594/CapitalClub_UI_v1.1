import { Time } from '@angular/common';

export interface MultiStaffTimesheetPreviewModel{
    startTime:Time;
    endTime:Time;
    endDate: Date;
    description:string;
    timesheetDataStaff:timesheetDataStaff;
    timesheetDataProject:timesheetDataProject
}
export interface timesheetDataProject{
    projectName:string;
}

export interface timesheetDataStaff{
    staffName:string;
}