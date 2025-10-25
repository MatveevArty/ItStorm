import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleResponseType} from "../../../../types/article-response.type";
import {ServiceCardType} from "../../../../types/service-card.type";
import {environment} from "../../../../environments/environment";
import {FormBuilder, Validators} from "@angular/forms";
import {ActionsService} from "../../../shared/services/actions.service";
import {CommentType} from "../../../../types/comment.type";

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
   * Форма с данными заказа
   */
  public commentForm = this.fb.group({
    comment: ['', Validators.required],
  });


  constructor(private readonly articlesService: ArticlesService,
              private readonly actionsService: ActionsService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly fb: FormBuilder,) {
  }

  ngOnInit(): void {
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
              if (data.comments.length > 3) {
                for (let i = 0; i <= 2; i++) {
                  this.articleComments.push(data.comments[i]);
                  this.articleCommentsShownNow += 1;
                  this.haveMoreArticleComments = true;
                }
              } else {
                this.articleComments = data.comments;
                this.articleCommentsShownNow = this.articleComments.length;
                this.haveMoreArticleComments = false;
              }

              console.log(this.articleComments);
              console.log(this.articleCommentsShownNow);
              console.log(this.haveMoreArticleComments);
            }
          );
        }
      );
    })
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
  public createOrder(): void {
    if (this.commentForm.valid && this.comment?.value) {

      const paramsObject: { comment: string, article: string } = {
        comment: this.comment?.value,
        article: this.article?.url ? this.article?.url : '',
      }

      console.log(paramsObject);


      //   this.orderService.createOrder(paramsObject)
      //     .subscribe({
      //       next: (data: OrderType | DefaultResponseType) => {
      //         if ((data as DefaultResponseType).error !== undefined) {
      //           throw new Error((data as DefaultResponseType).message);
      //         }
      //
      //         this.dialogRef = this.matDialog.open(this.popup);
      //         this.dialogRef.backdropClick()
      //           .subscribe(() => {
      //             this.router.navigate(['/']);
      //           })
      //
      //         this.cartService.setCount(0);
      //       },
      //       error: (errorResponse: HttpErrorResponse) => {
      //         if (errorResponse.error && errorResponse.error.message) {
      //           this._snackBar.open(errorResponse.error.message);
      //         } else {
      //           this._snackBar.open('Ошибка создания заказа');
      //         }
      //       },
      //     });
      // } else {
      //   this.orderForm.markAllAsTouched();
      //   this._snackBar.open('Заполните необходимые поля');
      // }
    }
  }

  public getAllComments() {
    if (this.article && this.article.id) {
      this.actionsService.getArticleComments(this.article.id, this.articleCommentsShownNow).subscribe(
        (data) => {
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
        });
    }
  }
}
