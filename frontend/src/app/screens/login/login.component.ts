import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Router,
} from '@angular/router';
import { SubscriptionManager } from '../../core/subscriptionManager/subscriptionManager';
import { AuthService } from '../../shared/services/AuthService/auth.service';
import { AuthInterface } from '../../shared/models/auth-interface';
import { ToastrService } from 'ngx-toastr';


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

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

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
      this.subscriptionManager.add = this.authService.login(this.loginForm.value as AuthInterface).subscribe({
        next: (response) => {
          console.log(response);
          localStorage.setItem('token', response.token)

          setTimeout(() => {
            this.toastr.success('Account created succesfully', 'Success', { closeButton: true })
          }, 2000)
        },
        error: (error) => {
          this.toastr.error(error, 'Error', { closeButton: true })
        },
        complete: () => {
        },
      });
    } else {
      this.toastr.error('Please fill in all required fields correctly.', 'Error', { closeButton: true })
    }
  }
}