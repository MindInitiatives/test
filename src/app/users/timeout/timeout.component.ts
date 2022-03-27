import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Idle } from '@ng-idle/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-timeout',
  templateUrl: './timeout.component.html',
  styleUrls: ['./timeout.component.css'],
})
export class TimeoutComponent implements OnInit, OnDestroy {
  @Input() public message: any;
  @Input() public countdown: any;

  public timer: any;
  constructor(
    private idle: Idle,
    private accountService: AccountService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.activeModal.close();
        this.logout();
      }
    }, 1000);
  }
  stayLogged() {
    this.accountService.refreshToken().subscribe((res) => {
      console.log(res);
      this.activeModal.close();
      clearInterval(this.timer);
    });
  }

  logout() {
    this.activeModal.close();
    clearInterval(this.timer);
    this.idle.stop();
    this.accountService.logout();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
}
}
