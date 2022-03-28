import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AccountService } from "../services/account.service";


@Injectable({ providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService
        
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):any{
        const user = this.accountService.userToken;
        // console.log(user);
        
        if (user) {
     
                 
            //autorized return true
            return true;
        }
        // not logged in redirect to signin
       
        
        this.router.navigate(['/account/signin'], {queryParams: { returnUrl: state.url}});
        return false;
    }

}