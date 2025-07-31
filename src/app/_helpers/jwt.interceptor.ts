import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../_services/authentication.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        const currentUser = this.authenticationService.currentUserValue;
        const isLoggedIn = currentUser && currentUser.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        // console.log("=======");

        // console.log(isLoggedIn);
        // console.log( isApiUrl);
        // console.log("=======");

        if (isLoggedIn && isApiUrl) {
            // if(request.method =="OPTIONS"){

            // }
            //console.log(request.method);
           /* request = request.clone(
                {
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`,
                }
            });*/
            const clonedReq = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + currentUser.token)
            });
            return next.handle(clonedReq).pipe(
                tap(
                    succ => { },
                    err => {
                        if (err.status == 401){
                            localStorage.removeItem('token');
                            this.router.navigateByUrl('/login');
                        }
                    }
                )
            )
        }else
        return next.handle(request.clone());

       // return next.handle(request);
    }
}