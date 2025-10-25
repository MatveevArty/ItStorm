import {ActiveParamsType} from "../../../types/active-params.type";
import {Params} from "@angular/router";

export class ActiveParamsUtil {

  /**
   * Обработка url query-параметров с определением выбранных категорий фильтра
   * @param params url query-параметры
   */
  static processParams(params: Params): ActiveParamsType {
    const activeParams: ActiveParamsType = { categories: [] };

    if (params.hasOwnProperty('categories')) {
      activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
    }

    if (params.hasOwnProperty('page')) {
      activeParams.page = Number(params['page']);
    }

    return activeParams;
  }
}
