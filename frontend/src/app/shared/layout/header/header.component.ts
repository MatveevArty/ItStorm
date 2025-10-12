import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserinfoResponseType} from "../../../../types/userinfo-response.type";
import {UserService} from "../../../core/auth/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  /**
   * Флаг факта логина пользователем
   */
  public isLoggedIn: boolean = false;

  /**
   * Имя пользователя
   */
  public username: string = '';

  constructor(private readonly authService: AuthService,
              private readonly userService: UserService,
              private readonly _snackBar: MatSnackBar,
              private readonly router: Router,) {
    this.isLoggedIn = this.authService.getIsLoggedIn();
  }

  public ngOnInit(): void {
    this.authService.isLoggedSubject.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;

      if (this.isLoggedIn) {
        this.getAndSetUsername();
      }
    })

    if (this.isLoggedIn) {
      this.getAndSetUsername();
    }
  }

  /**
   * Получение и установка username
   */
  public getAndSetUsername(): void {
    this.userService.getUserInfo()
      .subscribe({
        next: (data: UserinfoResponseType) => {
          this.username = data.name;
        },
        error: (err: Error) => {
          this.username = 'пользователь';
        }
      })
  }

  /**
   * Выход из системы
   */
  public logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.doLogout();
      },
      error: () => {
        this.doLogout();
      }
    });
  }

  /**
   * Удаление токенов из localStorage и отображение попапа об успешном выходе
   */
  public doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы успешно вышли из системы');
    this.router.navigate(['/']);
  }
}
