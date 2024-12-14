import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthInterface } from '../../models/auth-interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Base URL for the backend API
  private readonly baseUrl: string = 'http://localhost:5000/api/auth/'; // Replace with your backend URL

  // Inject HttpClient for HTTP communication
  constructor(private readonly http: HttpClient) {}

  // Method to log in a user
	public login(loginData: AuthInterface) {

		return this.http.post<AuthInterface>(
			`${this.baseUrl}/login`,
			loginData,
		);
	}

  // Method to register a new user
  public register(user: { email: string; password: string; name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }
  public getUsers(){
    return this.http.get(`${this.baseUrl}/getUsers`,);
  }

  // Method to log out the user
  public logout(): void {
    localStorage.removeItem('token');
  }

  // Method to check if the user is logged in
  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
