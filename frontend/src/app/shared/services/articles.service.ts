import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ServiceCardType} from "../../../types/service-card.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient,) { }

  /**
   * Запрос на получение популярных статей
   */
  public getPopularArticles(): Observable<ServiceCardType[]> {
    return this.http.get<ServiceCardType[]>(environment.api + 'articles/top');
  }
}
