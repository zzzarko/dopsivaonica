import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  public signupForm: FormGroup
  private subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { 
    this.createForm();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
  }

  private createForm(): void{
     this.signupForm = this.fb.group(
       {
         firstName:['', [Validators.required]],
         lastName:['', [Validators.required]],
         email: ['', [Validators.required, Validators.email]],
         password: ['', [Validators.required, Validators.minLength(6)]]
       }
     );
  }

  public submit(): void{
    if(this.signupForm.valid){
      const {firstName, lastName, email, password} = this.signupForm.value;

      this.subscriptions.push(
        this.authService.signup( firstName, lastName, email, password).subscribe(success => {
          if (success){
            this.router.navigate(['/login']);
          }
        })  
      );
    }
  }

}
