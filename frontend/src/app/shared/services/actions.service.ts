import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CommentType} from "../../../types/comment.type";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(private http: HttpClient,) { }

  /**
   * Запрос на получение комментариев данной статьи
   * @param articleUrl url данной статьи
   * @param offset количество комментариев к скрытию
   */
  public getArticleComments(articleUrl: string, offset: number): Observable<{ allCount: number, comments: CommentType[]}> {
    return this.http.get<{ allCount: number, comments: CommentType[]}>(environment.api + 'comments', {
      params: { offset, article: articleUrl },
    });
  }

  /**
   * Запрос на добавление комментария для данной статьи
   * @param paramsObject комментарий и айди данной статьи
   */
  public addCommentToArticle(paramsObject: { comment: string, article: string }): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: paramsObject.comment, article: paramsObject.article
    })
  }
}
