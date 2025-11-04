import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  /**
   * Форматирование даты в формат ДД.ММ.ГГГГ ЧЧ:ММ из ISO 8601
   * @param value
   */
  public transform(value: string): string {
    if (value) {
      const date = new Date(value);

      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${day}.${month}.${year} ${hours}:${minutes}`;
    } else {
      return '';
    }
  }
}
