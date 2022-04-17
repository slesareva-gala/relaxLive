/* Лендинг. Точка входа */
"use strict";

import { menu } from "./modules/lMenu";
import { ModalList } from "./modules/lModalList";
import { secondPhoneNumber } from "./modules/lSecondPhoneNumber";
import { addPreloader } from "./modules/preloader";
import { inputForm } from "./modules/lForms";
import { SendForm } from './modules/lForms';
import { formula } from './modules/lFormula';
import { repairTypes } from './modules/lRepairTypes';
import { repairFull } from './modules/lRepairFull';
import { portfolioSlider } from './modules/lPortfolio';
import { reviewsSlider } from './modules/lReviewsSlider';
import { transparency } from './modules/lTransparency';
import { accordeon } from './modules/lAccordeon';

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
repairFull('http://localhost:4545/items');
portfolioSlider();
reviewsSlider();
transparency();
accordeon();
