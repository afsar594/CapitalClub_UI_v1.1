import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteIndexComponent } from './route-index/route-index.component';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TopbarComponent } from './layout/topbar/topbar.component';
import { MenuService } from './layout/menu/service/app.menu.service';
import { AppMenuComponent } from './layout/menu/component/app.menu.component';
import { AppMenuitemComponent } from './layout/menu/component/app.menuitem.component';
import { LeaveDataComponent } from './leave-data/leave-data.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TagModule } from 'primeng/tag';
/**-------------PRIME NG MODULE ------------------------------------- */
import { PrimeModuleModule } from '../../core/primeNg/prime-module/prime-module.module'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { HotTableModule } from '@handsontable/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewLeaveRequestComponent } from './new-leave-request/new-leave-request.component';
import { TimeSheetComponent } from './time-sheet/time-sheet.component';
import { NewTimesheetComponent } from './new-timesheet/new-timesheet.component';
import { NewServiceComponent } from './new-service/new-service.component';
import { MemoComponent } from './memo/memo.component';
import { ServiceRequestComponent } from './service-request/service-request.component';
import { AttendanceComponent } from './attendance/attendance.component';
// import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core'; 
import { GoogleMapsModule } from '@angular/google-maps'

// import { GMapModule } from 'primeng/gmap';

// import {AgmMap, MouseEvent,MapsAPILoader  } from '@agm/core';
import { OpeningBalanceEntryComponent } from './opening-balance-entry/opening-balance-entry.component';
import { MessageService } from 'primeng/api';

import { ConnectionServiceModule, ConnectionServiceOptions, ConnectionServiceOptionsToken } from 'projects/connection-service/src/public_api';
import { TimesheetAllComponent } from './timesheet-multistaff/timesheet-multistaff.component';
//import { TimesheetComponent } from './timesheet/timesheet.component';
import { TimesheetSingleComponent } from './timesheet-single/timesheet-single.component';
import { TimesheetSinglestaffComponent } from './timesheet-singlestaff/timesheet-singlestaff.component';
import { LeaveapproveComponent } from './leaveapprove/leaveapprove.component';
import { ServiceapproveComponent } from './serviceapprove/serviceapprove.component';
import { LeaverequestComponent } from './leaverequest/leaverequest.component';
import { LeaveapprovalComponent } from './leaveapproval/leaveapproval.component';
import { PageHeaderComponent } from 'src/app/_shared/page-header/page-header.component';

import { ServiceapprovalComponent } from './serviceapproval/serviceapproval.component';
import { LeavebalComponent } from './leavebal/leavebal.component';
import { PasswordComponent } from './layout/password/password.component';
// import { HttpClientModule } from '@angular/common/http';
import { LeavesapprovedComponent } from './leavesapproved/leavesapproved.component';
import { ToastModule } from 'primeng/toast';
import { HistoryReportComponent } from './history-report/history-report.component';
import { LoginnewComponent } from './loginnew/loginnew.component';
import { UserListComponent } from './user-list/user-list.component';
import { LeaveapproveMultiComponent } from './leaveapprovemulti/leaveapprovemulti.component';
import { LeaveapprovalMultiComponent } from './leaveapprovalmulti/leaveapprovalmulti.component';
const moduleRoutes1: Routes = [
  {
    path: '', component: RouteIndexComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'leavedata', component: LeaveDataComponent, pathMatch: 'full' },
      { path: 'leaveapprove', component: LeaveapproveComponent, pathMatch: 'full' },
      { path: 'leaveapproval', component: LeaveapprovalComponent, pathMatch: 'full' },
      { path: 'leaveapproved', component: LeavesapprovedComponent, pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
      { path: 'userlist', component: UserListComponent, pathMatch: 'full' },
            { path: 'timesheet', component: TimeSheetComponent, pathMatch: 'full' },
      { path: 'timesheetsingle', component: TimesheetSingleComponent, pathMatch: 'full' },
      // { path: 'multistafftimesheet',  component: TimesheetAllComponent, pathMatch: 'full'},
      { path: 'leavebal', component: LeavebalComponent, pathMatch: 'full' },
      { path: 'memo', component: MemoComponent, pathMatch: 'full' },
      { path: 'service', component: ServiceRequestComponent, pathMatch: 'full' },
      { path: 'serviceapprove', component: ServiceapproveComponent, pathMatch: 'full' },
      { path: 'serviceapproval', component: ServiceapprovalComponent, pathMatch: 'full' },
      { path: 'attendance', component: AttendanceComponent, pathMatch: 'full' },
      { path: 'test', component: OpeningBalanceEntryComponent, pathMatch: 'full' },
      { path: 'historyreport', component: HistoryReportComponent, pathMatch: 'full' },
      { path: 'loginnew', component: LoginnewComponent, pathMatch: 'full' },
      { path: 'leaveapprovemulti', component: LeaveapproveMultiComponent, pathMatch: 'full' },
      { path: 'leaveapprovalmulti', component: LeaveapprovalMultiComponent, pathMatch: 'full' },
    ]
  }
]

@NgModule({

  declarations: [RouteIndexComponent, TopbarComponent, PageHeaderComponent,
    OpeningBalanceEntryComponent, AttendanceComponent, LeaveDataComponent, ServiceRequestComponent,
    NewServiceComponent, TimeSheetComponent, MemoComponent, LeavebalComponent, AppMenuComponent,
    AppMenuitemComponent, DashboardComponent, UserListComponent, NewLeaveRequestComponent, NewTimesheetComponent,
    NewServiceComponent, MemoComponent, OpeningBalanceEntryComponent, TimesheetAllComponent,
    TimeSheetComponent, TimesheetSingleComponent, TimesheetSinglestaffComponent,
    LeaveapproveComponent, ServiceapproveComponent, LeaverequestComponent,
    LeaveapprovalComponent, ServiceapprovalComponent, LeavebalComponent,
    PasswordComponent, LeavesapprovedComponent,HistoryReportComponent,LoginnewComponent,
    LeaveapproveMultiComponent,LeaveapprovalMultiComponent],
  providers: [
    MessageService,
    // {
    //   provide: ConnectionServiceOptionsToken,
    //   useValue: <ConnectionServiceOptions>{
    //     // enableHeartbeat: false,
    //     // heartbeatUrl: '/assets/ping.json',
    //     // requestMethod: 'get',
    //     // heartbeatInterval: 3000
    //   }
    // }
  ],
  imports: [
    CommonModule,
    //NgxImgZoomModule,
    PrimeModuleModule,
    RouterModule.forChild(moduleRoutes1),
    HotTableModule,
    FontAwesomeModule,
    TagModule,
    // GMapModule,
    ToastModule,
    ConnectionServiceModule,
    //HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // google map
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyAKUF7YjEOOk0R8F-3KjdOkCfnQHZRtOvM'

    // }),

    GoogleMapsModule

  ],
  exports: [RouterModule],
})
export class RoutesModule { }
