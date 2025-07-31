import { Component, OnInit } from '@angular/core';
import { RouteIndexComponent } from '../../route-index/route-index.component';
import { User } from 'src/app/_models/user';
import { AuthenticationService } from 'src/app/_services';
//import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  display1: boolean = false;
  currentUserData: User;
username:string;
usrImg: any;
userstaffName:string;
userPassportNo:string;
userDesignation:string;
userPwd:string


  constructor(public app:RouteIndexComponent, private authService :AuthenticationService) {

    this.currentUserData =  this.authService.currentUserValue
    this.username = this.currentUserData.username;
    this.userPwd = this.currentUserData.userPwd;
    this.usrImg = this.currentUserData.userImg != null && this.currentUserData.userImg?.length > 0 ? 'data:image/png;base64,' + this.currentUserData.userImg : null
    console.log(this.currentUserData.userImg);
    this.userstaffName =  this.currentUserData.userstaffName;
    this.userPassportNo = this.currentUserData.userPassportNo;
    this.userDesignation = this.currentUser.userDesignation;
   }
   signout(){
    this.authService.logout();
    
    
   }
    get currentUser(): User {
    return this.currentUserData
    }

    showDialog(event) {
      this.display1 = true;
      event.preventDefault();
    }
    dialogevent(evt) {
     this.display1 = false;
    }
  ngOnInit(): void {
  }

}
