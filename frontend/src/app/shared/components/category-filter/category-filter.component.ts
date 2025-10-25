import {Component, Input, OnInit} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {

  @Input() category: CategoryType | null = null;

  public isChecked: boolean = false;

  /**
   * Массив выбранных категорий
   */
  public activeParams: ActiveParamsType = { categories: [] };

  constructor(private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,) { }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const activeParams: ActiveParamsType = { categories: [] };

      if (params.hasOwnProperty('categories')) {
        activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
      }

      if (params.hasOwnProperty('page')) {
        activeParams.page = Number(params['page']);
      }

      this.activeParams = activeParams;

      this.activeParams.categories = [];
      if (params['categories']) {
        this.activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
      };

      const isCurrentCategorySelected = this.activeParams.categories.some(item => item === this.category?.url);

      if (isCurrentCategorySelected) {
        this.isChecked = true;
      }

      console.log(this.activeParams.categories);
    });
  }

  /**
   * Обработка массива activeParams при выборе категорий в фильтре
   * @param url урл данной категории фильтра
   */
  public updateFilterParam(url: string) {
    this.isChecked = !this.isChecked;

    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingTypeInParams = this.activeParams.categories.find(item => item === url);

      if (existingTypeInParams && !this.isChecked) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingTypeInParams && this.isChecked) {
        // this.activeParams.types.push(url);
        this.activeParams.categories = [...this.activeParams.categories, url]
      }
    } else if (this.isChecked) {
      this.activeParams.categories = [url];
    }

    this.activeParams.page = 1;

    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams,
    });
  }
}
