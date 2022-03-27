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
  idleState = 'Not started.';
  timedOut = false;
  lastPing: any = null;
  constructor(private accountService: AccountService, private idle: Idle, private keepalive: Keepalive,private _modalService:NgbModal) {
    this.accountService.user.subscribe(x => this.user = x);
    let timeout = 6
    // sets an idle timeout of 10 minutes, for testing purposes.
    idle.setIdle(timeout);
    // sets a timeout period of 10 minutes. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(timeout);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      const modalRef = this._modalService.open(TimeoutComponent);
      this.idleState = 'No longer idle.';
      console.log('hi');
      
      modalRef.componentInstance.message = this.idleState;
    }
    );
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.logout();
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');
    idle.watch();
    // sets the ping interval to 15 seconds
    keepalive.interval(15);
    keepalive.start();
    keepalive.onPing.subscribe(() => {
      this.lastPing = new Date()
      console.log("ping" + this.lastPing)
    });

    this.reset();
}

reset() {
  this.idle.watch();
  this.idleState = 'Started.';
  this.timedOut = false;
}


  logout() {
    this.accountService.logout();
}
}
