import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {ArticlesService} from "../../services/articles.service";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActionsService} from "../../services/actions.service";
import {MatDialogRef} from "@angular/material/dialog/dialog-ref";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {RequestTypeEnum} from "../../../../enums/request-type.enum";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @ViewChild('popupConsultation') popupConsultation!: TemplateRef<ElementRef>;

  @ViewChild('requestPopup') requestPopup!: ElementRef<HTMLElement>;

  @ViewChild('sentSuccess') sentSuccess!: ElementRef<HTMLElement>;

  /**
   * Попап
   */
  public dialogConsulationRef: MatDialogRef<any, any> | null = null;

  /**
   * Форма с данными Личного кабинета
   */
  public consultationRequestForm = this.fb.group({
    firstNameConsult: ['', Validators.required],
    phoneConsult: ['', Validators.required],
  })

  constructor(private readonly articlesService: ArticlesService,
              private readonly matDialog: MatDialog,
              private readonly fb: FormBuilder,
              private readonly _snackBar: MatSnackBar,
              private readonly actionsService: ActionsService,) {
  }

  /**
   * Геттер для поля Имя
   */
  public get firstNameConsult() {
    return this.consultationRequestForm.get('firstNameConsult');
  }

  /**
   * Геттер для поля Номер телефона
   */
  public get phoneConsult() {
    return this.consultationRequestForm.get('phoneConsult');
  }

  /**
   * Открытие попапа с формой консультации
   */
  public openConsultationFormPopup(): void {
    this.dialogConsulationRef = this.matDialog.open(this.popupConsultation);
  }

  /**
   * Закрытие попапа по крестику
   */
  public closeConsultationFormPopup(): void {
    this.dialogConsulationRef?.close();
    if (this.consultationRequestForm && this.firstNameConsult && this.phoneConsult) {
      this.firstNameConsult.setValue('');
      this.phoneConsult.setValue('');
      this.consultationRequestForm.markAsUntouched();
      this.consultationRequestForm.markAsPristine();
    }
  }

  /**
   * Оставление заявки
   */
  public addConsultationRequest(): void {
    if (this.consultationRequestForm.valid && this.firstNameConsult?.value && this.phoneConsult?.value) {
      const paramsObject: { name: string, phone: string, type: string } = {
        name: this.firstNameConsult?.value,
        phone: this.phoneConsult?.value,
        type: RequestTypeEnum.Consultation,
      }

      this.actionsService.sendServiceRequest(paramsObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if ((data as DefaultResponseType).error) {
              throw new Error((data as DefaultResponseType).message);
            }

            if (this.consultationRequestForm && this.firstNameConsult && this.phoneConsult) {
              this.firstNameConsult.setValue('');
              this.phoneConsult.setValue('');
              this.consultationRequestForm.markAsUntouched();
              this.consultationRequestForm.markAsPristine();
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
              this._snackBar.open('Ошибка при отправлении заявки на консультацию');
            }
          },
        });
    } else {
      this.consultationRequestForm.markAllAsTouched();
      this._snackBar.open('Заполните все поля формы');
    }
  }

}
