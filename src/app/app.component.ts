import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { User } from './models/user';
import { AccountService } from './services/account.service';
import { TimeoutComponent } from './users/timeout/timeout.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testTopup';
  user!: User;

  collapsed = false;
     
  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe(x => this.user = x);
}

  logout() {
    this.accountService.logout();

}
toggleCollapsed(): void {
  this.collapsed = !this.collapsed;
}
}
