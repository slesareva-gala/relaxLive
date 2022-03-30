
/* Лендинг.  Меню */
"use strict";

import { animate } from './helpers';

export const menu = () => {

  // блок меню
  const menu = document.querySelector('.popup-dialog-menu');

  // плавный скролл по a.href
  const smoothScroll = (e, href) => {
    e.preventDefault();

    // счетчик прокрученных строк и целевое кол-во строк к прокрутке всё за 1 сек
    const scrollY = window.scrollY;
    // необходимо докрутить до начала элемента перехода
    const transitionHeight = document.querySelector(href).getBoundingClientRect().top;

    animate({
      duration: 1000,
      timingplane: 'easeOutCubic',
      draw(progress) {
        // вертикальный скролл документа
        window.scrollTo(0, scrollY + transitionHeight * progress);
      }
    });
  };

  document.querySelector('body').addEventListener('click', (e) => {
    let itemMenu = null, itemPopup, toTop;

    if (e.target.closest('.menu') ||         // по кнопке открытия меню
      e.target.closest('.close-menu') ||     // или кнопке закрытия блока меню
      (itemMenu = e.target.closest('.popup-menu-nav__item')) ||    // по нажатию на пункт меню
      (itemPopup = e.target.closest('.link-list-menu')) ||     // или на переход на полный список услуг
      (!e.target.closest('.popup-dialog-menu') &&       // по нажатии мимо окошка и меню активно
        menu.classList.contains('showHide-menu'))) {
      e.preventDefault();

      // открытие/закрытие меню
      menu.classList.toggle('showHide-menu');

    } else if ((toTop = e.target.closest('.button-footer'))) {

      // переход на следующий блок
      smoothScroll(e, toTop.firstChild.getAttribute("href"));

      // политика конфидентцальности
    } else if (e.target.closest('.checkbox__descr_round-feedback')) {
      document.openPopup.open('popup-privacy');

      // проконсультироваться
    } else if (e.target.closest('.button_wide')) {
      document.openPopup.open('popup-consultation');

      // на полный список из строителей
    } else if ((itemPopup = e.target.closest('.link-list-repair'))) {

      // close close-consultation

      // закрытие popup-ов
    } else if (e.target.closest('.popup .close')) {
      document.openPopup.close(e.target);
    }

    // плавный скролл по нажатию на пункт меню
    if (itemMenu) { smoothScroll(e, itemMenu.firstChild.getAttribute("href")); }
    // открытие списка всех услуг
    if (itemPopup) { document.openPopup.open('popup-repair-types'); }
  });

  document.querySelector('body').addEventListener('submit', (e) => {
    e.preventDefault();
    document.sendForm.send(e.target);
  });
}; // END menu()
