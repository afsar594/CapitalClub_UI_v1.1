import { DecimalPipe } from '@angular/common';
import { Selectitem } from './selectItem.model';

export interface NewAttendanceModel{
    comment?:string;
    empID?:number;
    checkStatus?:number;
    coordinates?:CoordinatesModel;
    location?:Selectitem;
    file?:FormData;
}

export interface CoordinatesModel{
    latitude?:string;
    longitude?:string;
    punchdate?:string;
}