import {Component, Input} from '@angular/core';
import {ServiceCardType} from "../../../../types/service-card.type";
import {environment} from "../../../../environments/environment";

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

  constructor() { }


}
