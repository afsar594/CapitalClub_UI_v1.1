// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-password',
//   templateUrl: './password.component.html',
//   styleUrls: ['./password.component.scss']
// })
// export class PasswordComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { AuthenticationService } from 'src/app/_services';
import { LeaveDataService } from 'src/app/_services/leaveData.service';
import { environment } from 'src/environments/environment';
import { OldPwdValidators } from './old-pwd.validators';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {
  ChangePassword: FormGroup; 
  currentUserData: User;
  apiUrl:string;
  @Output() dialogClose = new EventEmitter<boolean>();
  constructor(fb: FormBuilder,
    private UserCheck: LeaveDataService,
    private AuthService: AuthenticationService,
    private http: HttpClient
    ){
    this.ChangePassword = fb.group({
    //  'oldPwd': ['',Validators.required,OldPwdValidators.shouldBe1234],
    'oldPwd': ['',Validators.required,OldPwdValidators.shouldBe1234],
      'newPwd': ['',Validators.required],
      'confirmPwd': ['',Validators.required],
    
    }, {
      validator: OldPwdValidators.matchPwds

    });
    this.currentUserData = this.AuthService.currentUserValue;
    this.apiUrl =  environment.apiUrl;
  }

  get oldPwd(){
    return this.ChangePassword.get(this.currentUserData.userPwd);
  }

   get newPwd(){
    return this.ChangePassword.get('newPwd');
  }

   get confirmPwd(){
    return this.ChangePassword.get('confirmPwd');
  }
  SavePwd(){
    this.http.get<any>( this.apiUrl+'user/Updatepassword/'+ this.currentUserData.id +'/'+ this.newPwd.value).subscribe((k) =>{
      console.log(k);
    });    
    this.dialogClose.emit(true);
  }
}