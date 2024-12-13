import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public type: string = 'password';
  public isText: boolean = false;
  public isLoading: boolean = false;
  public submitted: boolean = false;
  private verified: string = 'true';
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
    email: ['', [Validators.required]],
    password: ['', Validators.required],
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
      this.isLoading = true;
      this.authService.login(this.loginForm.value as AuthInterface).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            {
              setTimeout(() => {
                this.router.navigate(['/admin-page/dashboard']).then(() => {

                });
              }, 2000);

            }
          }
        },
        error: (error) => {
          setTimeout(() => {


          });
        }

      })
    }
  }
}