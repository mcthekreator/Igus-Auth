import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  RouterLink,
  Router,
} from '@angular/router';
import { SubscriptionManager } from '../../core/subscriptionManager/subscriptionManager';
import { AuthService } from '../../shared/service/AuthService/auth.service';
import { AuthInterface } from '../../shared/models/auth-interface';


@Component({

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
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
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        localStorage.setItem('lastUrl', event.urlAfterRedirects);
      }
    });
  }

  public loginForm = this.fb.group({
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

  public onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value as AuthInterface).subscribe({
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