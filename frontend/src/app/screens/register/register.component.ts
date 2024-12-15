import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/AuthService/auth.service';
import { SubscriptionManager } from '../../core/subscriptionManager/subscriptionManager';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthInterface } from '../../shared/models/auth-interface';
import { ToastrService } from 'ngx-toastr';

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
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  public registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(2)]],
  });



  public onRegister() {
    this.isLoading = true
    if (this.registerForm.valid) {
      this.subscriptionManager.add = this.authService.register(this.registerForm.value as AuthInterface).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token)
          setTimeout(() => {
            this.isLoading = false
            this.toastr.success(response.message, 'Success', { closeButton: true })
            this.router.navigate(['/login']);
          }, 2000)


        },
        error: (error) => {
          setTimeout(() => {
            this.isLoading = false
            this.toastr.error(error.error.message, 'Error', { closeButton: true })
          }, 2000)
        },
      });
    } else {
      alert('Please all fields are required.');
    }
  }


}
