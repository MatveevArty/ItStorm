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

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;

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

  public reviews = [
    {
      name: 'Станислав',
      image: 'reviews-avatar-1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
    },
    {
      name: 'Алёна',
      image: 'reviews-avatar-2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
    },
    {
      name: 'Мария',
      image: 'reviews-avatar-3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },
    {
      name: 'Аделина',
      image: 'reviews-avatar-1.png',
      text: 'Хочу поблагодарить всю команду за помощь в подборе подарка для моей мамы! Все просто в восторге от мини-сада! А самое главное, что за ним удобно ухаживать, ведь в комплекте мне дали целую инструкцию.',
    },
    {
      name: 'Яника',
      image: 'reviews-avatar-1.png',
      text: 'Спасибо большое за мою обновлённую коллекцию суккулентов! Сервис просто на 5+: быстро, удобно, недорого. Что ещё нужно клиенту для счастья?',
    },
    {
      name: 'Марина',
      image: 'reviews-avatar-1.png',
      text: 'Для меня всегда важным аспектом было наличие не только физического магазина, но и онлайн-маркета, ведь не всегда есть возможность прийти на место. Ещё нигде не встречала такого огромного ассортимента!',
    },
  ]

  /**
   * Массив популярных статей
   */
  public popularArticles: ServiceCardType[] = [];

  /**
   * Карточки услуг
   */
  public serviceCards: ServiceCardType[] = [
    {
      image: 'service-image-1.png',
      title: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 7500,
      serviceType: ServiceTypeEnum.WebDevelopment,
      id: '',
      date: '',
      category: 'Фриланс',
      url: '',
    },
    {
      image: 'service-image-2.png',
      title: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 3500,
      serviceType: ServiceTypeEnum.SeoPromotion,
      id: '',
      date: '',
      category: '',
      url: '',
    },
    {
      image: 'service-image-3.png',
      title: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 1000,
      serviceType: ServiceTypeEnum.Advertising,
      id: '',
      date: '',
      category: '',
      url: '',
    },
    {
      image: 'service-image-4.png',
      title: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 750,
      serviceType: ServiceTypeEnum.Copywriting,
      id: '',
      date: '',
      category: '',
      url: '',
    },
  ]

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
        type: 'order',
      }

      this.actionsService.sendServiceRequest(paramsObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if ((data as DefaultResponseType).error) {
              throw new Error((data as DefaultResponseType).message);
            }

            this._snackBar.open('Заявка успешно отправлена');

            if (this.serviceRequestForm && this.serviceType && this.firstName && this.phone) {
              this.serviceType.setValue(null);
              this.firstName.setValue('');
              this.phone.setValue('');
              this.serviceRequestForm.markAsUntouched();
              this.serviceRequestForm.markAsPristine();
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
