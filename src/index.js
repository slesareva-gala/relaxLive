/* Лендинг. Точка входа */
"use strict";


import { menu } from "./landing/menu";
import { ModalList } from "./landing/modalList";
import { secondPhoneNumber } from "./landing/secondPhoneNumber";
import { inputForm, SendForm } from "./landing/forms";
import { formula } from './landing/formula';
import { repairTypes } from './landing/repairTypes';
import { DataJSON } from "./modules/dataJSON";
import { catalog } from './landing/catalog';
import { portfolioSlider } from './landing/portfolio';
import { reviewsSlider } from './landing/reviewsSlider';
import { transparency } from './landing/transparency';
import { accordeon } from './landing/accordeon';
import { addPreloader } from "./modules/preloader";
menu();
// подключение сервиса открытия/закрытия модальных блоков
document.modalList = new ModalList('popup', 'active-popup');
// добавляем прелодер на document
addPreloader();

secondPhoneNumber();
inputForm();

// подключение сервиса отправки форм
// параметры: сервер отправки, дополнительные данные к отправке

document.sendForm = new SendForm({
  url: 'https://jsonplaceholder.typicode.com/posts',
  optionals:
  {
    // Получите консультацию от специалиста в удобное для Вас время (тел)
    feedback1: [{ name: "form", assign: "feedback1" }
    ],
    // Обсудите проект со специалистом или вызовите замерщика (имя,тел)
    feedback2: [
      { name: "form", assign: "feedback2" }
    ],
    // Получите консультацию от специалиста в удобное для Вас время (тел)
    feedback3: [
      { name: "form", assign: "feedback3" }
    ],
    // Обсудите проект со специалистом или вызовите замерщика (имя,тел)
    feedback4: [
      { name: "form", assign: "feedback4" }
    ],
    // Обсудите проект со специалистом или вызовите замерщика (имя,тел)
    feedback5: [
      { name: "form", assign: "feedback5" }
    ],
    // Получите консультацию от специалиста в удобное для Вас время (тел)
    feedback6: [
      { name: "form", assign: "feedback6" }
    ],
  }
});

formula();
repairTypes();

// подключение сервиса данных каталога
document.taskDemo = 0;
document.dataСatalog = new DataJSON({
  url: 'http://localhost:4545/items',
  urlDemo: './dbDemo/items.json',
  errorMessageResponse: 'Сервер базы данных недоступен. Запрос отменен.'
});
catalog();
portfolioSlider();
reviewsSlider();
transparency();
accordeon();

