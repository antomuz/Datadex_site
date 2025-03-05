import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    // Create the Base64-encoded Basic Auth token
    const authToken = btoa(`${username}:${password}`);

    // Construct the headers
    const headers = new HttpHeaders({
      Authorization: `Basic ${authToken}`
    });

    // Then do a GET request with these headers
    return this.http.get<any>(`${this.baseUrl}/users`, { headers, responseType: 'text' as 'json' });
  }

  register(userData: any): Observable<any> {
    // userData = { user, password, id, roles }
    // Build an object that matches your desired JSON structure
    const sendData = {
      user: userData.user,
      password: userData.password,
      id: "OK",
      roles: "ADMIN"
    };
    return this.http.post<any>(`${this.baseUrl}/users`, sendData);
  }
}
