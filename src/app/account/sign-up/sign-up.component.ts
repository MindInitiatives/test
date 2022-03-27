import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
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
      email: ['', [Validators.required,Validators.email]],
      password : ['', [Validators.required,Validators.minLength(8)]]
    })
  }
   // convenience getter for easy access to form fields
   get f() { return this.form.controls; }



// <!-- Switching method
toggleFieldTextType() {
  this.fieldTextType = !this.fieldTextType;
}
onSubmit() {
  this.submitted = true;

  // reset alerts on submit
  this.alertService.clear();

  // stop here if form is invalid
  if (this.form.invalid) {
      return;
  }

  this.loading = true;
  console.log(this.form.value);
  
  this.accountService.register(this.form.value)
      .pipe(first())
      .subscribe({
          next: () => {
              this.alertService.success('Registration successful', { keepAfterRouteChange: true });
              this.router.navigate(['../login'], { relativeTo: this.route });
          },
          error: error => {
            console.log(error.error);
            console.log(error)
              this.alertService.error(error.error.error);
              this.loading = false;
          }
      });
}

}
