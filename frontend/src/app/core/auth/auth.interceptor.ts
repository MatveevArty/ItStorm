import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router,) {
  }

  /**
   * Добавление параметра x-auth к запросам
   * @param req запрос
   * @param next next
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokens = this.authService.getTokens();

    if (tokens && tokens.accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken),
      });

      return next.handle(authReq)
        .pipe(
          catchError((err) => {
            if (err.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
              return this.handle401Error(authReq, next);
            }
            return throwError(() => err);
          })
        );
    }

    return next.handle(req);
  }

  /**
   * Обработка 401 ошибки
   * @param req запрос
   * @param next next
   */
  public handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refresh()
      .pipe(
        switchMap((result: DefaultResponseType | LoginResponseType) => {
          let error = '';

          if ((result as DefaultResponseType).error !== undefined) {
            error = (result as DefaultResponseType).message;
          }

          const refreshResult = result as LoginResponseType;

          if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
            error = 'Auth error';
          }

          if (error) {
            return throwError(() => new Error(error));
          }

          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);

          const authReq = req.clone({
            headers: req.headers.set('x-access-token', refreshResult.accessToken),
          });

          return next.handle(authReq)
        }),
        catchError(error => {
          this.authService.removeTokens();
          this.router.navigate(['/']);
          return throwError(() => error);
        })

      )
  }
}
