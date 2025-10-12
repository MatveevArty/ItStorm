import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  /**
   * Форма с данными для входа
   */
  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  /**
   * Геттер для поля Почта
   */
  public get email() {
    return this.loginForm.get('email');
  }

  /**
   * Геттер для поля Пароль
   */
  public get password() {
    return this.loginForm.get('password');
  }

  /**
   * Геттер для поля Запомнить меня
   */
  public get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,) { }

  /**
   * Вход в систему
   */
  public login(): void {
    if (this.loginForm.valid && this.email?.value && this.password?.value) {
      this.authService.login(this.email.value, this.password.value, Boolean(this.loginForm.value.rememberMe)).subscribe({
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
          this._snackBar.open('Вы успешно авторизовались');
          this.router.navigate(['/']).then();
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка авторизации');
          }
        }
      })
    }
  }
}
