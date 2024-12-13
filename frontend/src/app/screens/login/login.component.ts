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
export class LoginComponent implements OnInit, OnDestroy {
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
		email: ['', [ Validators.required]],
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
						if (
							response.role === 'ADMIN' ||
							response.role === 'EMPLOYEE' ||
							response.role === 'SUPPORT' ||
							response.role === 'SALES'
						) {
							this.tokenService.storeToken(response.token);
							setTimeout(() => {
								this.router.navigate(['/admin-page/dashboard']).then(() => {
									this.clearBrowserHistory();
									this.isLoading = false;
								});
							}, 2000);
							this.toaster.showToast(
								'Login Successfully',
								'Congratulations. ',
								'success'
							);
						} else if (response.role === 'CUSTOMER') {
							this.tokenService.storeToken(response.token);
							setTimeout(() => {
								this.router.navigate(['/customer-page/dashboard']).then(() => {
									this.isLoading = false;
								});
							}, 2000);
							this.toaster.showToast(
								'Login Successfully',
								'Congratulations. ',
								'success'
							);
						} else if (response.role === 'SUPER_ADMIN') {
							this.tokenService.storeToken(response.token);
							setTimeout(() => {
								this.router
									.navigate(['/super-admin-page/dashboard'])
									.then(() => {
										this.isLoading = false;
									});
							}, 2000);
							this.toaster.showToast(
								'Login Successfully',
								'Congratulations. ',
								'success'
							);
						} else {
							this.tokenService.storeToken(response.token);
							setTimeout(() => {
								this.router.navigate(['/admin-page/dashboard']).then(() => {
									this.clearBrowserHistory();
									this.isLoading = false;
								});
							}, 2000);
							this.toaster.showToast(
								'Login Successfully',
								'Congratulations. ',
								'success'
							);
						}
					} else {
						setTimeout(() => {
							this.toaster.showToast(
								response.error.message,
								'Error detected. ',
								'error'
							);
							this.isLoading = false;
						}, 2000);
					}
				},
				error: (error) => {
					setTimeout(() => {
						this.toaster.showToast(
							error.error.message,
							'',
							'error'
						);
						this.isLoading = false;
					}, 2000);
				},
			});
		} else if (
			this.loginForm.get('email')?.invalid &&
			this.loginForm.get('email')?.dirty
		) {
			this.submitted = true;
			this.toaster.showToast(
				'invalid email or password',
				'Error detected. ',
				'error'
			);
		} else {
			formValidation.validateAllFormFields(this.loginForm);
			this.toaster.showToast(
				'Please all fields are required.',
				'Error detected. ',
				'error'
			);
		}
	}
	ngOnDestroy(): void {
		this.subscriptionManager.dispose();
	}
}