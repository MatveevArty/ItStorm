import {ServiceTypeEnum} from "../enums/service-type.enum";

/**
 * Карточка услуги
 */
export type ServiceCardType = {
  id: string,
  title: string,
  description: string,
  image: string,
  date: string,
  category: string,
  url: string,
  price?: number,
  serviceType?: ServiceTypeEnum,
}
