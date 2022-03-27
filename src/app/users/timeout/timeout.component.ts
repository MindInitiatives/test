import { Component, Input, OnInit } from '@angular/core';
import { Idle } from '@ng-idle/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-timeout',
  templateUrl: './timeout.component.html',
  styleUrls: ['./timeout.component.css']
})
export class TimeoutComponent implements OnInit {
  @Input() public message:any;
  constructor(
    private idle: Idle,
   private accountService: AccountService
  ) { }

  ngOnInit(): void {
    
  }
  stayLogged(){
  this.accountService.refreshToken()
  .subscribe((res)=>{
console.log(res);

  })
  }
  logout(){

  }

}
