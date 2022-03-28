import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  form!: FormGroup;
  id!: number;
    isAddMode!: boolean;
  loading = false;
  submitted = false;
  
  constructor(private fb:FormBuilder, private router:Router, private alertService:AlertService, private userService:UserService, private route:ActivatedRoute) { }
 

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
   this.id = 12
    this.form = this.fb.group({
      name: ['', Validators.required],
      job: ['', Validators.required],
     
  });
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    // console.log(this.form.value)
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    this.updateUser()
   
}
updateUser(){
  this.userService.updateUser(this.id,this.form.value)
.pipe(first())
.subscribe({
  next:()=>{
    this.alertService.success('User updated successfully', { keepAfterRouteChange: true });
    setTimeout(()=>{
      window.location.reload()
      }, 2000)
  },
  error: error => {
    this.alertService.error(error);
    this.loading = false;
}
})
}
    close(){

    }
}
