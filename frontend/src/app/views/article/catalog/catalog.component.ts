import {Component, OnInit} from '@angular/core';
import {ServiceCardType} from "../../../../types/service-card.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {CategoryType} from "../../../../types/category.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {debounceTime} from "rxjs";

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

  /**
   * Массив применённых фильтров
   */
  public appliedFilters: AppliedFilterType[] = [];

  /**
   * Массив выбранных категорий
   */
  public activeParams: ActiveParamsType = {categories: []};

  /**
   * Массив страниц
   */
  public pages: number[] = [];

  constructor(private readonly articlesService: ArticlesService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly router: Router,) {
  }

  ngOnInit(): void {
    this.articlesService.getCategories().subscribe(
      data => {
        this.categories = data;

        this.activatedRoute.queryParams
          .pipe(debounceTime(700))
          .subscribe((params) => {
          this.activeParams = ActiveParamsUtil.processParams(params);

          this.appliedFilters = [];
          this.activeParams.categories.forEach((categoryUrl) => {
            const foundType = this.categories.find((item) => item.url === categoryUrl);

            if (foundType) {
              this.appliedFilters.push({
                name: foundType.name,
                urlParam: foundType.url,
              })
            }
          });

          this.articlesService.getArticles(this.activeParams).subscribe(
            data => {
              this.pages = [];

              for (let i = 1; i <= data.pages; i++) {
                this.pages.push(i);
              }

              this.articles = data.items;
            }
          );
        });
      }
    );
  }

  /**
   * Обработка клика по кнопке Сортировка
   */
  public toggleSorting() {
    this.filterOpen = !this.filterOpen;
  }

  /**
   * Удаление фильтра из списка фильтров
   * @param appliedFilter удаляемый фильтр
   */
  public removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories
      .filter((category) => category !== appliedFilter.urlParam);

    this.activeParams.page = 1;

    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams,
    });
  }

  /**
   * Переход на предыдущую страницу в пагинации
   */
  public openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;

      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams,
      });
    }
  }

  /**
   * Переход на указанную страницу в пагинации
   * @param page
   */
  public openPage(page: number): void {
    this.activeParams.page = page;

    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams,
    });
  }

  /**
   * Переход на следующую страницу в пагинации
   */
  public openNextPage(): void {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;

      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams,
      });
    }
  }
}
