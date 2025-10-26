import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleResponseType} from "../../../../types/article-response.type";
import {ServiceCardType} from "../../../../types/service-card.type";
import {environment} from "../../../../environments/environment";
import {FormBuilder, Validators} from "@angular/forms";
import {ActionsService} from "../../../shared/services/actions.service";
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {ReactionTypeEnum} from "../../../../enums/reaction-type.enum";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  @ViewChild('articleText') articleText!: ElementRef;

  /**
   * Статья текущей страницы
   */
  public article: ArticleResponseType | null = null;

  /**
   * Массив связанных статей для данной статьи
   */
  public relatedArticles: ServiceCardType[] = [];

  /**
   * Путь до папки с картинками на бэкенде
   */
  public serverStaticPath = environment.serverStaticPath;

  /**
   * Комментарии для данной статьи
   */
  public articleComments: CommentType[] = [];

  /**
   * Количество отображаемых в данный момент комментариев для данной статьи
   */
  public articleCommentsShownNow: number = 0;

  /**
   * Есть ли ещё комментарии для данной статьи помимо отображаемых
   */
  public haveMoreArticleComments: boolean = false;

  /**
   * Общее количество комментариев для данной статьи
   */
  public totalArticleComments: number = 0;

  /**
   * Флаг факта логина пользователем
   */
  public isLoggedIn: boolean = false;

  /**
   * Форма с данными заказа
   */
  public commentForm = this.fb.group({
    comment: ['', Validators.required],
  });

  /**
   * Массив комментариев для данной статьи с реакциями данного пользователя
   */
  public currentUserArticleCommentWithReactions: { comment: string, action: string }[] = [];

  /**
   * Типы реакций для комментария
   * @protected ччч
   */
  protected readonly ReactionTypeEnum = ReactionTypeEnum;

  constructor(private readonly articlesService: ArticlesService,
              private readonly actionsService: ActionsService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly fb: FormBuilder,
              private readonly authService: AuthService,
              private _snackBar: MatSnackBar,) {
    this.isLoggedIn = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLoggedSubject.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.activatedRoute.params.subscribe(params => {
      this.articlesService.getArticle(params['url']).subscribe(
        (data: ArticleResponseType) => {
          this.article = data;

          this.articlesService.getRelatedArticles(this.article.url).subscribe(
            (data: ServiceCardType[]) => {
              this.relatedArticles = data;
            }
          );

          this.actionsService.getArticleComments(this.article.id, 0).subscribe(
            (data) => {
              this.totalArticleComments = data.allCount;

              if (data.comments.length > 3) {
                for (let i = 0; i <= 2; i++) {
                  this.articleComments.push(data.comments[i]);
                  this.articleCommentsShownNow += 1;
                }
                this.haveMoreArticleComments = true;
              } else {
                this.articleComments = data.comments;
                this.articleCommentsShownNow = this.articleComments.length;
                this.haveMoreArticleComments = false;
              }

              console.log(this.articleComments);
              console.log(this.articleCommentsShownNow);
              console.log(this.haveMoreArticleComments);

              if (this.isLoggedIn) {
                this.setActiveLikesDislikes();
              }
            }
          );
        }
      );
    })
  }

  public setActiveLikesDislikes() {
    if (this.article) {
      this.actionsService.getUserCommentsWithReactionForArticle(this.article.id).subscribe(data => {
        this.currentUserArticleCommentWithReactions = data;

        this.currentUserArticleCommentWithReactions.forEach(item => {
          const foundComment = this.articleComments.find(comment => comment.id === item.comment);

          if (foundComment) {
            if (item.action === ReactionTypeEnum.Like) {
              foundComment.isLikePressed = true;
            } else if (item.action === ReactionTypeEnum.Dislike) {
              foundComment.isDislikePressed = true;
            }
          }
        })
      });
    }
  }

  /**
   * Геттер для поля Комментарий
   */
  get comment() {
    return this.commentForm.get('comment');
  }

  /**
   * Соаздние заказа
   */
  public addComment(): void {
    if (this.article) {
      if (this.commentForm.valid && this.comment?.value) {
        const paramsObject: { comment: string, article: string } = {
          comment: this.comment?.value,
          article: this.article.id ? this.article.id : '',
        }

        this.actionsService.addCommentToArticle(paramsObject)
          .subscribe({
            next: (data: DefaultResponseType) => {
              if ((data as DefaultResponseType).error) {
                throw new Error((data as DefaultResponseType).message);
              }

              this._snackBar.open('Комментарий успешно добавлен');

              if (this.comment) {
                this.comment.setValue('');
                this.commentForm.markAsUntouched();
                this.commentForm.markAsPristine();
              }

              if (this.article) {
                this.actionsService.getArticleComments(this.article.id, 0).subscribe(
                  (data) => {
                    this.articleComments = [data.comments[0], ...this.articleComments];
                    this.articleCommentsShownNow += 1;

                    console.log(this.articleComments);
                    console.log(this.articleCommentsShownNow);
                    console.log(this.haveMoreArticleComments);
                  }
                );
              }
            },
            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error && errorResponse.error.message) {
                this._snackBar.open(errorResponse.error.message);
              } else {
                this._snackBar.open('Ошибка при добавлении комментария');
              }
            },
          });
      } else {
        this.commentForm.markAllAsTouched();
        this._snackBar.open('Заполните поле комментария');
      }
    }
  }

  /**
   * Получение комментариев
   */
  public getAllComments() {
    if (this.article && this.article.id) {
      this.actionsService.getArticleComments(this.article.id, this.articleCommentsShownNow).subscribe(
        (data) => {
          this.totalArticleComments = data.allCount;

          if (data.allCount - this.articleCommentsShownNow > 10) {
            for (let i = 0; i < 9; i++) {
              this.articleComments.push(data.comments[i]);
              this.articleCommentsShownNow += 1;
              this.haveMoreArticleComments = true;
            }

            console.log(this.articleComments);
            console.log(this.articleCommentsShownNow);
            console.log(this.haveMoreArticleComments);

          } else {
            data.comments.forEach(comment => this.articleComments.push(comment));
            this.articleCommentsShownNow = this.articleComments.length;
            this.haveMoreArticleComments = false;

            console.log(this.articleComments);
            console.log(this.articleCommentsShownNow);
            console.log(this.haveMoreArticleComments);
          }

          if (this.isLoggedIn) {
            this.setActiveLikesDislikes();
          }
        });
    }
  }


  public applyReactionToComment(commentId: string, reactionType: ReactionTypeEnum): void {
    if (this.isLoggedIn) {
      this.actionsService.addReactionToComment(commentId, reactionType).subscribe({
        next: (data: DefaultResponseType) => {
          if ((data as DefaultResponseType).error) {
            this._snackBar.open('Ошибка при добавлении реакции к комментарию');
            throw new Error((data as DefaultResponseType).message);
          }

          if (reactionType === ReactionTypeEnum.Like) {
            this._snackBar.open('Лайк к комментарию успешно добавлен');
          } else if (reactionType === ReactionTypeEnum.Dislike) {
            this._snackBar.open('Дизлайк к комментарию успешно добавлен');
          } else if (reactionType === ReactionTypeEnum.Violate) {
            this._snackBar.open('Жаолба к комментарию успешно добавлена');
          }

          if (reactionType !== ReactionTypeEnum.Violate) {
            let currentCommentLikes = 0;
            let currentCommentDislikes = 0;

            this.actionsService.getReactionsToComment(commentId).subscribe(data => {
              data.forEach(item => {
                if (item.comment === commentId && item.action === ReactionTypeEnum.Like) {
                  currentCommentLikes += 1;
                  const currentComment = this.articleComments.find(articleComment => articleComment.id === commentId);

                  if (currentComment) {
                    currentComment.isLikePressed = true;
                    currentComment.isDislikePressed = false;
                  }

                } else if (item.comment === commentId && item.action === ReactionTypeEnum.Dislike) {
                  currentCommentDislikes += 1;

                  const currentComment = this.articleComments.find(articleComment => articleComment.id === commentId);

                  if (currentComment) {
                    currentComment.isDislikePressed = true;
                    currentComment.isLikePressed = false;
                  }
                }
              });

              const currentComment = this.articleComments.find(comment => comment.id === commentId);

              if (currentComment) {
                currentComment.likesCount = currentCommentLikes;
                currentComment.dislikesCount = currentCommentDislikes;
              }
            });
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка при добавлении реакции к комментарию');
          }
        }
      })
    } else {
      this._snackBar.open('Необходимо авторизация для добавления реакций к комментариям');
    }
  }


}
