import {Component, ElementRef, Input, TemplateRef, ViewChild} from '@angular/core';
import {ServiceCardType} from "../../../../types/service-card.type";
import {environment} from "../../../../environments/environment";
import {Router} from "@angular/router";
import {MatDialogRef} from "@angular/material/dialog/dialog-ref";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActionsService} from "../../services/actions.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {ServiceTypeEnum} from "../../../../enums/service-type.enum";

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent {

  @Input() serviceCard!: ServiceCardType;

  @Input() isMainPageService: boolean = false;

  @Input() mainPageServiceNumber: number = 0;

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;

  @ViewChild('sentSuccess') sentSuccess!: TemplateRef<ElementRef>;

  public assetsPath: string = 'assets/images/pages/main/';

  /**
   * Попап
   */
  public dialogRef: MatDialogRef<any, any> | null = null;

  /**
   * Путь до папки с картинками на бэкенде
   */
  public serverStaticPath = environment.serverStaticPath;

  /**
   * Путь до папки с картинками на бэкенде
   */
  public api = environment.api;

  /**
   * Форма с данными Личного кабинета
   */
  public serviceRequestForm = this.fb.group({
    serviceType: ['', Validators.required],
    firstName: ['', Validators.required],
    phone: ['', Validators.required],
  })

  constructor(private readonly router: Router,
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

  /**
   * Открытие попапа с формой
   */
  public openFormPopup(): void {
    this.dialogRef = this.matDialog.open(this.popup);

    if (this.serviceType && this.serviceCard && this.serviceCard.serviceType) {
      this.serviceType.setValue(this.serviceCard.serviceType);
    }
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
   * Перенаправление на страницу сстатьи данной карточки
   */
  public navigate() {
    this.router.navigate(['/article/' + this.serviceCard.url]);
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

            if (this.sentSuccess && this.sentSuccess.elementRef) {
              this.sentSuccess.elementRef.nativeElement.style.display = 'block';
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
