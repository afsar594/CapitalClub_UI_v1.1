import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlobalRoutes } from './Global-routes.const';
// import { HistoryReportComponent } from './views/routes/history-report/history-report.component';
// import { LoginnewComponent } from './views/loginnew/loginnew.component';


const routes: Routes = [

 ];

@NgModule({
  imports: [
    RouterModule.forRoot(GlobalRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
