import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectModel } from '../_models/projects.model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StaffModel } from '../_models/Staff.Model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    apiUrl:string;
    constructor(private http: HttpClient) {
        this.apiUrl= environment.apiUrl;
    }

    GetProjects(){
        return this.http.get<Array<ProjectModel>>( this.apiUrl+"timesheet/getprojects").pipe(map(leavedatas=>{
            return leavedatas
        }))
    }
    GetStaffs(){
        return this.http.get<Array<StaffModel>>( this.apiUrl+"multistafftimesheet/getstaffs").pipe(map(staffdatas=>{
            return staffdatas
        }))
    }

}

