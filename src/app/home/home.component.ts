// import { MapsAPILoader } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { throwError } from 'rxjs';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import {AgmMap,MapsAPILoader  } from '@agm/core'; 
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { TimeoutComponent } from '../users/timeout/timeout.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  
})
export class HomeComponent implements OnInit {
  @ViewChild(AgmMap,{static: true}) public agmMap!: AgmMap;  
  user!: User;
  ipAddress = '';
  address = '';
  getAddress: any;
  latitude!: number;
  longitude!: number;
  zoom: any ;
  currentLocation:any
  private geoCoder: any

  idleState = 'Not started.';
  timedOut = false;
  lastPing: any = null;
  countdown?: number;

  constructor( 
    private accountService:AccountService,
    private http:HttpClient,private MapsAPILoader: MapsAPILoader, private ngZone:NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private idle: Idle, private keepalive: Keepalive,private _modalService:NgbModal,
    private alertService : AlertService

    ) {
    this.user = this.accountService.userToken
      console.log(this.user)
    let countdown = 5
    let timeout = 600
    // sets an idle timeout of 10 minutes, for testing purposes.
    idle.setIdle(timeout);
    // sets a timeout period of 5 seconds. after 5 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(countdown);
   
   
    
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.accountService.logout();
    });
    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!'
      const modalRef = this._modalService.open(TimeoutComponent);
      modalRef.componentInstance.message = this.idleState;
      modalRef.componentInstance.countdown = countdown;
    });
    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!'
      console.log(this.idleState)
    });
    idle.watch();
    // sets the ping interval to 15 seconds
    keepalive.interval(15);
    keepalive.start();
    keepalive.onPing.subscribe(() => {
      this.lastPing = new Date()
      console.log("ping " + this.lastPing)
    });
   }

  ngOnInit(): void {
   
    this.MapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
    });
  }
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddresss(this.latitude, this.longitude);
      });
    }
  }
  getAddresss(latitude:any, longitude:any) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    
    });
  }
 
  refresh(){
    this.accountService.refreshToken()
   .pipe(first())
   .subscribe({
     next:()=>{
     // get return url from query parameters or default to home page
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigateByUrl(returnUrl);
     },
     error:error =>{
      this.alertService.error(error.error.error);
      // this.alertService.error(error);
    
     }
   })
  }
 

}
