import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Base URL for the backend API
  private readonly baseUrl: string = 'https://example.com/api'; // Replace with your backend URL

  // Inject HttpClient for HTTP communication
  constructor(private readonly http: HttpClient) {}

  // Method to log in a user
  public login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // Method to register a new user
  public register(user: { email: string; password: string; name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
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
