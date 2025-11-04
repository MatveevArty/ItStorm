import {ServiceCardType} from "../../types/service-card.type";
import {ServiceTypeEnum} from "../../enums/service-type.enum";

export const articleCards: ServiceCardType[] = [
  {
    image: 'service-image-1.png',
    title: 'Создание сайтов',
    description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
    price: 7500,
    serviceType: ServiceTypeEnum.WebDevelopment,
    id: '',
    date: '',
    category: 'Фриланс',
    url: '',
  },
  {
    image: 'service-image-2.png',
    title: 'Продвижение',
    description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
    price: 3500,
    serviceType: ServiceTypeEnum.SeoPromotion,
    id: '',
    date: '',
    category: '',
    url: '',
  },
  {
    image: 'service-image-3.png',
    title: 'Реклама',
    description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
    price: 1000,
    serviceType: ServiceTypeEnum.Advertising,
    id: '',
    date: '',
    category: '',
    url: '',
  },
  {
    image: 'service-image-4.png',
    title: 'Копирайтинг',
    description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
    price: 750,
    serviceType: ServiceTypeEnum.Copywriting,
    id: '',
    date: '',
    category: '',
    url: '',
  },
];
