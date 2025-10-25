import { Component, OnInit } from '@angular/core';
import {ServiceCardType} from "../../../../types/service-card.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {CategoryType} from "../../../../types/category.type";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  /**
   * Флаг раскрытия фильтра
   */
  public filterOpen: boolean = false;

  /**
   * Карточки статей
   */
  public articles: ServiceCardType[] = [];

  /**
   * Категории статей
   */
  public categories: CategoryType[] = [];

  constructor(private readonly articlesService: ArticlesService,) { }

  ngOnInit(): void {
    this.articlesService.getArticles().subscribe(
      data => {
        this.articles = data.items;
      }
    );

    this.articlesService.getCategories().subscribe(
      data => {
        this.categories = data;
      }
    )
  }

  /**
   * Обработка клика по кнопке Сортировка
   */
  public toggleSorting() {
    this.filterOpen = !this.filterOpen;
  }
}
