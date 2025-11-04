import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat'
})
export class PriceFormatPipe implements PipeTransform {
  /**
   * Форматирование цены с добавлением пробела после каждого порядка 10 в 3
   * @param value цена
   */
  public transform(value: number | undefined): string {
    if (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    } else {
      return '';
    }
  }
}
