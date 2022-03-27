import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {
  
  @Input() public data:any;
  form!: FormGroup;
 
  loading = false;
  submitted = false;
       
  constructor(private fb:FormBuilder, private router:Router, private alertService:AlertService, private userService:UserService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data?.first_name, Validators.required],
      job: ['', Validators.required],
     
  });
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }
  onSubmit() {
    console.log(this.form.value)
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
  this.userService.updateUser(this.data?.id,this.form.value)
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
  window.location.reload()
}
}
