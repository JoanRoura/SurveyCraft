import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Survey } from '../../survey/interfaces/survey.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _baseUrl: string = environment.baseUrl;

  isLogged = false;

  currentUser: User | null = null;

  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    return this.isLogged;
  }

  login(userAuth: User): Observable<User> {
    return this.http.post<User>(`${this._baseUrl}/api/login`, userAuth).pipe(
      map(user => {
        this.isLogged = true;
        this.currentUser = user;
        return user;
      }),
      catchError(error => {
        this.isLogged = false;
        this.currentUser = null;
        throw error;
      })
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this._baseUrl}/api/create-user`, user);
  }

  logout(): void {
    this.isLogged = false;
    this.currentUser = null;

  }
}
