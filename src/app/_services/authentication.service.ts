import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
// import { AuthenticateRequestModel } from '../_models/authenticateRequest.Model';


const users: User[] = [
    { id: 1, username: 'admin', userPwd: '1234', workgroupid: 1 },
    { id: 2, username: 'user', userPwd: '1234', workgroupid: 2 }
];

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    apiUrl: string;
    constructor(private http: HttpClient) {
        this.apiUrl = environment.apiUrl;

        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {

        return this.currentUserSubject.value;
    }

    login(Userdata: any) {
        return this.http.post<any>(this.apiUrl + 'user/authenticate', Userdata)
            .pipe(map(user => {

                if (user && user.token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;

            }));
    }

    GetEmployees() {
        
        return this.http.get<any>(this.apiUrl + 'user').pipe(map(users => {

            return users;
        }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}