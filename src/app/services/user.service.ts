import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../models';

@Injectable({ providedIn: 'root'})
export class UserService{
    private userSubject!: BehaviorSubject<User>;
    public user :Observable<User>;

    constructor(
        private router:Router,
        private http: HttpClient
    ){
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')!));
        
        this.user = this.userSubject.asObservable()
    }
 getUsers(params:any){
     return this.http.get<any>(`${environment.apiUrl}/users`,{params})
 }
 getUsersById(id:number){
    return this.http.get<any>(`${environment.apiUrl}/users/${id}`)
     
 }

 removeUser(id:number){
     return this.http.delete<any>(`${environment.apiUrl}/users/${id}`)
 }
 updateUser(id:number, params:any){
     return this.http.put(`${environment.apiUrl}/users/${id}`,params)
     .pipe(map(x=>{
         return x
     }))
 }
  
}