import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { first } from 'rxjs/operators';
import { AuthenticateRequestModel } from 'src/app/_models/authenticateRequest.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  loading = false;
  Userdata: AuthenticateRequestModel;

  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      userImg: [null]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/user';
    this.authenticationService.GetEmployees().subscribe(c => {

      console.log(c);
    }
    );


  }

  get f() { return this.loginForm.controls; }

  /** LOGIN FORM */
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;

    this.Userdata = {
      Password: this.f.password.value,
      Username: this.f.username.value,
      userImg: this.f.userImg.value
    }
    this.authenticationService.login(this.Userdata).subscribe((res: any) => {
      this.router.navigate([this.returnUrl]);
    },
      error => {

        this.error = "Invalid Username or Password";
        this.loading = false;
      });


    // this.authenticationService.login(this.Userdata)
    // .pipe(first())
    // .subscribe(
    //     data => {

    //       console.log(this.returnUrl);
    //         this.router.navigate([this.returnUrl]);
    //     },
    //     error => {

    //         this.error = "Invalid Username or Password";
    //         this.loading = false;
    //     });
  }
}
