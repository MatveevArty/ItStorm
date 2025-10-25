import {Component, Input} from '@angular/core';
import {ServiceCardType} from "../../../../types/service-card.type";
import {environment} from "../../../../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent  {

  @Input() serviceCard!: ServiceCardType;

  @Input() isMainPageService: boolean = false;

  @Input() mainPageServiceNumber: number = 0;

  public assetsPath: string = 'assets/images/pages/main/';

  /**
   * Путь до папки с картинками на бэкенде
   */
  public serverStaticPath = environment.serverStaticPath;

  /**
   * Путь до папки с картинками на бэкенде
   */
  public api = environment.api;

  constructor(private readonly router: Router,) { }


  /**
   * Перенаправление на страницу сстатьи данной карточки
   */
  public navigate() {
    this.router.navigate(['/article/' + this.serviceCard.url]);
  }
}
