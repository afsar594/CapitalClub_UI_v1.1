import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrimeModuleModule } from 'src/app/core/primeNg/prime-module/prime-module.module';
import { AuthenticationService } from 'src/app/_services/authentication.service';
 //import { HttpClientModule } from '@angular/common/http';

const moduleRoutes: Routes = [
  {
    path: '', component: LoginComponent,
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' }
    ]
  },
  

]

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeModuleModule,
    // HttpClientModule,

    RouterModule.forChild(moduleRoutes),
  ],

  exports: [LoginComponent]
})
export class AuthModule { }
