import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from "@angular/common/http";
import { identifierModuleUrl } from "@angular/compiler";
import { Injectable } from "@angular/core";


import { Observable, of, throwError } from "rxjs";
import { delay, dematerialize, materialize } from "rxjs/operators";
import { User } from "../models";

// array in local storage for registered users
const usersKey = 'mydemouserstopopmama';
let users = JSON.parse(localStorage.getItem(usersKey)!) || [];


@Injectable()
export class BackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers,body} = request;
        return handleRoute()
      
   
       function handleRoute(){
        switch (true) {
            case url.endsWith('/users/authenticate') && method === 'POST':
                return authenticate();
            case url.endsWith('/users/register') && method === 'POST':
                return register();
            case url.endsWith('/users') && method ==='GET':
                return getUsers()
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            
        }
     }

        //  route functions

        function authenticate(){
            const{ email, password } = body;
            const user = users.find((x: { email: any; password: any; }) => x.email ===email && x.password ===password);
            if (!user) return error('Username or password is incorrect ');
            return ok({
                ...basicDetails(user),
                token: 'my-token-here'
            })
        }
   

        function register(){
            
            const user = body
console.log(user);

            if (users.find((x: { email: any; }) => x.email === user.email)){
               console.log();
               
                return error ('Email"' + user.email + '" is already taken')
            }
            user.id = user.length ? Math.max(...users.map((x: { id: any; }) => x.id)) + 1 : 1;
            users.push(user)
            localStorage.setItem(usersKey, JSON.stringify(users));
            console.log('got here')
            return ok();
        }
        function updateUser(){
            if(!isLoggedIn()) return unauthorized();
        
            let params = body;
            let user = users.find((x: { id: number; }) => x.id === idFromUrl());

            //only update password if entered
            if(!params.password) {
                delete params.password
            }
            //update and save user
            Object.assign(user,params);
            localStorage.setItem(usersKey, JSON.stringify(users));

            return ok();
        }

        function isLoggedIn () {
            return headers.get('Authorization') === 'Bearer my-token-here';
        }
        function deleteUser(){
            if(!isLoggedIn()) return unauthorized();

            users = users.filter((x: { id: any; }) => x.id !== idFromUrl());
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok();
        }

       function getUsers() {
           if(!isLoggedIn()) return unauthorized()
           return ok(users.map((x: User)=>basicDetails(x)))
        }
        // function getUserById() {
        //     if (!isLoggedIn()) return unauthorized();

        //     const user = users.find((x: { id: number; }) => x.id === idFromUrl());
        //     return ok(users.map((x: User)=>basicDetails(x)))
        // }
        //helper functions 
        function ok(body?:any) {
            return of(new HttpResponse({status:200, body}))
        }
        function unauthorized() {
            return throwError ({status:401, error:{message:'Unauthorized'} })
            .pipe(materialize(), delay(500), dematerialize());
        }
        function idFromUrl(){
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.find((x: { id: number; }) => x.id === idFromUrl());
            return ok(basicDetails(user));
        }
        function  basicDetails(user:any){
            const { id, email,firstName, lastName } = user;
            return {id, email, firstName, lastName};
            }
            function error(message: string) {
                return throwError({ error: { message } })
                    .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
            }
    }
}
export const BackendProvider = {
     // use fake backend in place of Http service for backend-less development
    provide : HTTP_INTERCEPTORS,
    useClass: BackendInterceptor,
    multi:true
}