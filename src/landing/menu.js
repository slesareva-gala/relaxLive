
/* Лендинг.  Меню */
"use strict";

import { smoothScroll } from '../modules/helpers';

export const menu = () => {

  // блок меню
  const menu = document.querySelector('.popup-menu');

  document.querySelector('body').addEventListener('click', (e) => {
    let itemMenu = null, itemPopup, toTop;

    // открытие/закрытие меню
    if (e.target.closest('.menu') && !e.target.closest('.menu-phone-icon') ||         // по кнопке открытия меню
      e.target.closest('.close-menu') ||     // или кнопке закрытия блока меню
      (itemMenu = e.target.closest('.popup-menu-nav__item')) ||    // по нажатию на пункт меню
      (itemPopup = e.target.closest('.link-list-menu')) ||     // или на переход на полный список услуг
      (!e.target.closest('.popup-dialog-menu') &&       // по нажатии мимо окошка и меню активно
        menu.classList.contains('active-popup'))) {

      e.preventDefault();

      menu.classList.toggle('active-popup');

    } else if ((toTop = e.target.closest('.button-footer'))) {

      // переход на следующий блок
      e.preventDefault();
      smoothScroll(toTop.firstChild.getAttribute("href"));

      // политика конфидентцальности
    } else if (e.target.closest('.link-privacy')) {
      document.modalList.open('popup-privacy');

      // проконсультироваться
    } else if (e.target.closest('.button_wide')) {
      document.modalList.open('popup-consultation');

      // на полный список из строителей
    } else if ((itemPopup = e.target.closest('.link-list-repair'))) {

      // close close-consultation

      // закрытие popup-ов
    } else if (e.target.closest('.popup .close') ||
      e.target.closest('.popup') && e.target.classList.contains('active-popup')) {
      document.modalList.close(e.target.closest('.popup'));
    }

    // плавный скролл по нажатию на пункт меню
    if (itemMenu) {
      e.preventDefault();
      smoothScroll(itemMenu.firstChild.getAttribute("href"));
    }
    // открытие списка всех услуг
    if (itemPopup) { document.modalList.open('popup-repair-types'); }
  });

  document.querySelector('body').addEventListener('submit', (e) => {
    e.preventDefault();
    document.sendForm.send(e.target);
  });
}; // END menu()
