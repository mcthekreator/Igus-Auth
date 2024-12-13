import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/service/AuthService/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public name: string = '';
  public email: string = '';
  public password: string = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  public register(): void {
    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Registration failed!');
      },
    });
  }
}
