import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ServiceCardType} from "../../../types/service-card.type";
import {environment} from "../../../environments/environment";
import {CategoryType} from "../../../types/category.type";

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

  /**
   * Запрос на получение  статей
   */
  public getArticles(): Observable<{ count: number, pages: number, items: ServiceCardType[]}> {
    return this.http.get<{ count: number, pages: number, items: ServiceCardType[]}>(environment.api + 'articles');
  }

  /**
   * Запрос на получение категорий
   */
  public getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api + 'categories');
  }
}
