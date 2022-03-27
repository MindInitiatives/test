import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  fieldTextType!: boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService :AccountService,
    private alertService : AlertService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['eve.holt@reqres.in', [Validators.required,Validators.email]],
      password : ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]]
    })
  }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

  onSubmit(){
   this.submitted = true;

   //reset all alert on submit
   this.alertService.clear();
   //stoo  if form is invalid
   if(this.form.invalid){
     return
   }
   this.loading = true;
   this.accountService.login(this.f.email.value, this.f.password.value)
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
       this.loading=false;
     }
   })

  }

// <!-- Switching method
toggleFieldTextType() {
  this.fieldTextType = !this.fieldTextType;
}

}
