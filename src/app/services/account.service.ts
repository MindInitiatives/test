import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../models';

@Injectable({ providedIn: 'root'})
export class AccountService{
    private userSubject!: BehaviorSubject<User>;
    public user :Observable<User>;

    constructor(
        private router:Router,
        private http: HttpClient
    ){
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')!));
        
        this.user = this.userSubject.asObservable()
    }
    public get userToken(): User {
        return this.userSubject.value;
    }
    login(email:any, password:any) {
        return this.http.post<User>(`${environment.apiUrl}/login`, {email,password})
        .pipe(map(user=>{
                // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            this.startRefreshTokenTimer();
            return user;
        }));
    }
    refreshToken() {
        return this.http.post<any>(`${environment.apiUrl}/users/refresh-token`, {}, { withCredentials: true })
            .pipe(map((user) => {
                this.userSubject.next(user);
                this.startRefreshTokenTimer();
                return user;
            }));
    }

    private refreshTokenTimeout:any | undefined;

    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        // const jwtToken = JSON.parse(atob(this.userToken.token.split('.')[1]));
       
        const jwtToken =  10;
        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
        console.log(this.refreshTokenTimeout,'hey here');
        
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
    getIp(){
        return this.http.get<any>("http://api.ipify.org/?format=json")
      }
    register(user:User) {
        return this.http.post(`${environment.apiUrl}/register`, user)
    }
    getLocation(ip:string){
        return this.http.get<any>(`http://ip-api.com/json/${ip}`)
    }
    logout(){
        // this.http.post<any>(`${environment.apiUrl}/users/revoke-token`, {}, { withCredentials: true }).subscribe();
        // this.stopRefreshTokenTimer();
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        
        this.userSubject.next(null!);
        this.router.navigate(['/account/signin'])
    }
}