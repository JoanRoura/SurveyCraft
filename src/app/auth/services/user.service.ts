import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this._baseUrl}/api/users`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this._baseUrl}/api/create-user`, user);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this._baseUrl}/api/get-user/${id}`);
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this._baseUrl}/api/delete-user/${id}`);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this._baseUrl}/api/update-user/${id}`, user);
  }
}
