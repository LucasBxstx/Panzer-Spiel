import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';
import {CreateUserRequest, UpdateUserRequest, UserResponse} from './shared/models/user/user';


@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly http = inject(HttpClient);

  public getUser(userId: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${environment.apiUrl}/user/${userId}`);
  }

  public getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${environment.apiUrl}/user`);
  }

  public createUser(createUserRequest: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/user`, createUserRequest);
  }

  public updateUser(userId: string, updateUserRequest: UpdateUserRequest): Observable<UserResponse> {
    return this.http.patch<UserResponse>(`${environment.apiUrl}/user/${userId}`, updateUserRequest);
  }
}
