import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ServiceCardType} from "../../../types/service-card.type";
import {ArticlesService} from "../../shared/services/articles.service";
import {ServiceTypeEnum} from "../../../enums/service-type.enum";
import {FormBuilder, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActionsService} from "../../shared/services/actions.service";
import {MatDialogRef} from "@angular/material/dialog/dialog-ref";
import {DefaultResponseType} from "../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {reviews} from "../../../assets/data/reviews";
import {ReviewType} from "../../../types/review.type";
import {articleCards} from "../../../assets/data/article-cards";
import {RequestTypeEnum} from "../../../enums/request-type.enum";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;

  @ViewChild('requestPopup') requestPopup!: ElementRef<HTMLElement>;

  @ViewChild('sentSuccess') sentSuccess!: ElementRef<HTMLElement>;

  /**
   * Попап
   */
  public dialogRef: MatDialogRef<any, any> | null = null;

  /**
   * Настройки слайдера с акциями
   */
  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }

  public customOptionsRev: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 26,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
    },
  }

  /**
   * Массивы отзывов
   */
  public reviews: ReviewType[] = reviews;

  /**
   * Массив популярных статей
   */
  public popularArticles: ServiceCardType[] = [];

  /**
   * Карточки услуг
   */
  public serviceCards: ServiceCardType[] = articleCards;

  /**
   * Форма с данными Личного кабинета
   */
  public serviceRequestForm = this.fb.group({
    serviceType: ['', Validators.required],
    firstName: ['', Validators.required],
    phone: ['', Validators.required],
  });

  constructor(private readonly articlesService: ArticlesService,
              private readonly matDialog: MatDialog,
              private readonly fb: FormBuilder,
              private readonly _snackBar: MatSnackBar,
              private readonly actionsService: ActionsService,) {
  }

  /**
   * Геттер для поля Услуга
   */
  public get serviceType() {
    return this.serviceRequestForm.get('serviceType');
  }

  /**
   * Геттер для поля Имя
   */
  public get firstName() {
    return this.serviceRequestForm.get('firstName');
  }

  /**
   * Геттер для поля Номер телефона
   */
  public get phone() {
    return this.serviceRequestForm.get('phone');
  }

  ngOnInit(): void {
    this.articlesService.getPopularArticles().subscribe(
      (data: ServiceCardType[]) => {
        this.popularArticles = data;
      });
  }

  /**
   * Открытие попапа с формой заявки
   */
  public openFormPopup(): void {
    this.dialogRef = this.matDialog.open(this.popup);
  }

  /**
   * Закрытие попапа по крестику
   */
  public closeFormPopup(): void {
    this.dialogRef?.close();
    if (this.serviceRequestForm && this.serviceType && this.firstName && this.phone) {
      this.serviceType.setValue('');
      this.firstName.setValue('');
      this.phone.setValue('');
      this.serviceRequestForm.markAsUntouched();
      this.serviceRequestForm.markAsPristine();
    }
  }

  /**
   * Оставление заявки
   */
  public addServiceRequest(): void {
    if (this.serviceRequestForm.valid && this.serviceType?.value && this.firstName?.value && this.phone?.value) {
      const paramsObject: { name: string, phone: string, service: string, type: string } = {
        name: this.firstName?.value,
        phone: this.phone?.value,
        service: this.serviceType?.value,
        type: RequestTypeEnum.Order,
      }

      this.actionsService.sendServiceRequest(paramsObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if ((data as DefaultResponseType).error) {
              throw new Error((data as DefaultResponseType).message);
            }

            if (this.serviceRequestForm && this.serviceType && this.firstName && this.phone) {
              this.serviceType.setValue(null);
              this.firstName.setValue('');
              this.phone.setValue('');
              this.serviceRequestForm.markAsUntouched();
              this.serviceRequestForm.markAsPristine();
            }

            if (this.requestPopup && this.sentSuccess) {
              this.requestPopup.nativeElement.style.display = 'none';
              this.sentSuccess.nativeElement.style.display = 'block';
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка при отправлении заявки');
            }
          },
        });
    } else {
      this.serviceRequestForm.markAllAsTouched();
      this._snackBar.open('Заполните все поля формы');
    }
  }
}
