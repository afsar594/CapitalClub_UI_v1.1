import { Time } from '@angular/common';

export interface TimesheetPreviewModel{
    startTime:Time;
    endTime:Time;
    endDate: Date;
    description:string;
    timesheetDataProject:timesheetDataProject
}
export interface timesheetDataProject{
    projectName:string;
}