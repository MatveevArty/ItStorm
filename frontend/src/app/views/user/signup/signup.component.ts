import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  /**
   * Форма с данными для входа
   */
  public signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^([А-ЯЁ][а-яё]*)(\s[А-ЯЁ][а-яё]*)*$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
    agree: [false, [Validators.requiredTrue]],
  });

  /**
   * Геттер для поля Имя
   */
  public get name() {
    return this.signupForm.get('name');
  }

  /**
   * Геттер для поля Почта
   */
  public get email() {
    return this.signupForm.get('email');
  }

  /**
   * Геттер для поля Пароль
   */
  public get password() {
    return this.signupForm.get('password');
  }

  /**
   * Геттер для поля Согласен с правилами
   */
  public get agree() {
    return this.signupForm.get('agree');
  }

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,) { }

  /**
   * Регистрация в системе
   */
  public signup() {
    if (this.signupForm.valid && this.name?.value && this.email?.value && this.password?.value && this.agree?.value) {
      this.authService.signup(this.name.value, this.email.value, this.password.value).subscribe({
        next: (data: LoginResponseType | DefaultResponseType) => {
          let error = null;
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          const loginResponse = data as LoginResponseType;
          if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
            error = 'Ошибка авторизации';
          }

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
          this.authService.userId = loginResponse.userId;
          this._snackBar.open('Вы успешно зарегистрировались');
          this.router.navigate(['/'])
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка регистрации');
          }
        }
      });
    }
  }
}
