import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './views/index/index.component';

import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthModule } from './views/auth/auth.module';

import { MenuService } from './views/routes/layout/menu/service/app.menu.service';
import { TopbarComponent } from './views/routes/layout/topbar/topbar.component';
import { PrimeModuleModule } from './core/primeNg/prime-module/prime-module.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AuthenticationService } from './_services';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { fakeBackendProvider } from './_helpers/fake-backend';
//import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { GoogleMapsModule } from '@angular/google-maps'
import { ConnectionServiceModule } from 'ng-connection-service';
import { AppConfigService } from './_services/configuration.services';
import { NgxImgZoomModule  } from 'ngx-img-zoom';
 import { TableModule } from 'primeng/table';

export function appInit(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}
@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
     
    // ApprovedLeavesComponent,
  ],
  imports: [
  // NgxImgZoomModule,
    BrowserModule,
    AuthModule, 
    PrimeModuleModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TableModule
  ],
  providers: [
    MenuService,AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [AppConfigService]
    },
  // fakeBackendProvider
  provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [IndexComponent]
})
export class AppModule { }

