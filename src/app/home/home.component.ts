// import { MapsAPILoader } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { throwError } from 'rxjs';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import {AgmMap,MapsAPILoader  } from '@agm/core'; 
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

  constructor( 
    private accountService:AccountService,
    private http:HttpClient,private MapsAPILoader: MapsAPILoader, private ngZone:NgZone

    ) {
    this.user = this.accountService.userToken
   }

  ngOnInit(): void {
    this.getIPAddress();
    this.getLocation()
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
 
  getIPAddress()
  {
    this.accountService.getIp().subscribe((res:any)=>{
      this.ipAddress = res.ip;
    });
  }
  getLocation(){
   
    this.accountService.getLocation(this.ipAddress).subscribe((res)=>{
     this.address= res?.city + ' ' + res?.country
    })
  }
 

}
