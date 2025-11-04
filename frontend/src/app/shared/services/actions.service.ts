import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CommentType} from "../../../types/comment.type";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ReactionTypeEnum} from "../../../enums/reaction-type.enum";

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(private http: HttpClient,) {
  }

  /**
   * Запрос на получение комментариев данной статьи
   * @param articleId id данной статьи
   * @param offset количество комментариев к скрытию
   */
  public getArticleComments(articleId: string, offset: number): Observable<{
    allCount: number,
    comments: CommentType[]
  }> {
    return this.http.get<{ allCount: number, comments: CommentType[] }>(environment.api + 'comments', {
      params: {offset, article: articleId},
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

  /**
   * Запрос на добавление реакции комментарию для данной статьи
   * @param commentId айди комментария
   * @param reactionType тип реакции: лайк, дизлайк, жалоба
   */
  public addReactionToComment(commentId: string, reactionType: ReactionTypeEnum): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {action: reactionType});
  }

  /**
   * Запрос на получение реакций к комментарию для данной статьи
   * @param commentId айди комментария
   */
  public getReactionsToComment(commentId: string): Observable<{ comment: string, action: ReactionTypeEnum }[]> {
    return this.http.get<{
      comment: string,
      action: ReactionTypeEnum
    }[]>(environment.api + 'comments/' + commentId + '/actions');
  }

  /**
   * Запрос на получение всех комментариев текущего пользователя с реакцями для данной статьи
   * @param articleId айди данной статьи
   */
  public getUserCommentsWithReactionForArticle(articleId: string): Observable<{
    comment: string,
    action: ReactionTypeEnum
  }[]> {
    return this.http.get<{
      comment: string,
      action: ReactionTypeEnum
    }[]>(environment.api + 'comments/article-comment-actions', {
      params: {articleId},
    });
  }

  /**
   * Запрос на оставление заявки на заказ/консультацию
   * @param paramsObject имя, номер теелфона, тип заявки: consultation/order, формулирвока заявки
   */
  public sendServiceRequest(paramsObject: {
    name: string,
    phone: string,
    type: string,
    service?: string
  }): Observable<DefaultResponseType> {
    if (paramsObject.service) {
      return this.http.post<DefaultResponseType>(environment.api + 'requests', {
        name: paramsObject.name,
        phone: paramsObject.phone,
        type: paramsObject.type,
        service: paramsObject.service
      });
    } else {
      return this.http.post<DefaultResponseType>(environment.api + 'requests', {
        name: paramsObject.name,
        phone: paramsObject.phone,
        type: paramsObject.type
      });
    }
  }
}
