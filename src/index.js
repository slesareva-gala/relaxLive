/* Лендинг. Точка входа */
"use strict";

import { menu } from "./modules/lMenu";
import { OpenBlock } from "./modules/lOpenBlock";
import { secondPhoneNumber } from "./modules/lSecondPhoneNumber";
import { maskPhoneNumber } from "./modules/lMaskPhoneNumber";
import { inputName } from "./modules/lInputName";
import { addPreloader } from "./modules/preloader";
import { SendForm } from './modules/lSendForm';
import { formula } from './modules/lFormula';
import { repairTypes } from './modules/lRepairTypes';
import { repairFull } from './modules/lRepairFull';
import { portfolioSlider } from './modules/lPortfolioSlider';
import { reviewsSlider } from './modules/lReviewsSlider';
import { transparency } from './modules/lTransparency';
import { accordeon } from './modules/lAccordeon';

menu();
// подключение сервиса открытия блоков popup show  active
document.openPopup = new OpenBlock('popup', 'active', 'hide');
// добавляем прелодер на document
addPreloader();

secondPhoneNumber();
maskPhoneNumber();
inputName();

// подключение сервиса отправки форм
// параметры: сервер отправки, дополнительные данные к отправке
document.sendForm = new SendForm({
  url: 'https://jsonplaceholder.typicode.com/posts',
  errorMessageResponse: 'Технический сбой. Сообщение не отправлено',
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
