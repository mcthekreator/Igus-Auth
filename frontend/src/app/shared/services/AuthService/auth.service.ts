import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthInterface } from '../../models/auth-interface';
import { env } from '../../../core/env/env';
import { TokenService } from '../TokenService/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = env.BACKENDURL
  private readonly http = inject(HttpClient)
  private tokenService = inject(TokenService)

	public login(loginData: AuthInterface) {
		return this.http.post<AuthInterface>(
			`${this.baseUrl}/auth/login`,
			loginData,
		);
	}
  

	public register(loginData: AuthInterface) {
		return this.http.post<AuthInterface>(
			`${this.baseUrl}/auth/register`,
			loginData,
		);
	}


  public isLoggedIn(): boolean {
    return !!this.tokenService.getToken();;
  }
}
