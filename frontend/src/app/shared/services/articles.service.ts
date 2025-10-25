import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ServiceCardType} from "../../../types/service-card.type";
import {environment} from "../../../environments/environment";
import {CategoryType} from "../../../types/category.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ArticleResponseType} from "../../../types/article-response.type";

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
   * Запрос на получение статей
   * @param activeParams параметры запроса: категории и страница
   */
  public getArticles(activeParams: ActiveParamsType): Observable<{ count: number, pages: number, items: ServiceCardType[]}> {
    return this.http.get<{ count: number, pages: number, items: ServiceCardType[]}>(environment.api + 'articles', {
      params: activeParams
    });
  }

  /**
   * Запрос на получение отдельнй статьи
   * @param articleUrl
   */
  public getArticle(articleUrl: string): Observable<ArticleResponseType> {
    return this.http.get<ArticleResponseType>(environment.api + 'articles/' + articleUrl);
  }

  /**
   * Запрос на получение связанных статей с текущей статьёй
   * @param articleUrl
   */
  public getRelatedArticles(articleUrl: string): Observable<ServiceCardType[]> {
    return this.http.get<ServiceCardType[]>(environment.api + 'articles/related/' + articleUrl);
  }

  /**
   * Запрос на получение категорий
   */
  public getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api + 'categories');
  }
}
