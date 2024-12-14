import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/service/AuthService/auth.service';
import { SubscriptionManager } from '../../core/subscriptionManager/subscriptionManager';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthInterface } from '../../shared/models/auth-interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public type: string = 'password';
  public isText: boolean = false;
  public isLoading: boolean = false;
  public submitted: boolean = false;
  public showPasswordIcon: string = '../../../assets/showPassword.svg';
  public hidePasswordIcon: string = '../../../assets/hide-password.svg';

  private subscriptionManager = new SubscriptionManager();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  public loginForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(2)]],
  });
  

  public hideShowPassword() {
    this.isText = !this.isText;
    if (this.isText) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  public onRegister() {
    if (this.loginForm.valid) {
      this.authService.register(this.loginForm.value as AuthInterface).subscribe({
        next: (response) => {
          console.log(response);
          localStorage.setItem('token',response.token)
            this.router.navigate(['/admin-page/dashboard']);
    
        },
        error: (error) => {
          console.error('Login failed:', error); // Log error for debugging
          alert('Login failed. Please check your credentials and try again.');
        },
        complete: () => {
        },
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }


  public getUsers(){
  this.authService.getUsers().subscribe((users) => {
    console.log(users);
    
  })
  }
}
