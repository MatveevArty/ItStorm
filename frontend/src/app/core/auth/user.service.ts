import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {UserinfoResponseType} from "../../../types/userinfo-response.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  /**
   * Запрос на получение данных пользователя
   */
  public getUserInfo(): Observable<UserinfoResponseType> {
    return this.http.get<UserinfoResponseType>(environment.api + 'users');
  }
}
