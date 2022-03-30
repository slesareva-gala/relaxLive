/* Лендинг. Часто задаваемые вопросы */
"use strict";

import { animate } from './helpers';

export const accordeon = () => {

  // ссылки на клавиши аккордеона
  const accordionKeys = document.querySelectorAll('.accordion li');

  // игра на аккордеоне
  const play = (pressedIndex = -1) => {

    accordionKeys.forEach((key, index) => {
      // клавиша
      const keyLi = key.querySelector('.title_block');
      // содержимое клавиши
      const keyContent = key.querySelector('.msg');

      // закрытие всех раскрытых содержимых или открытое выбранное
      if (index !== pressedIndex || keyLi.classList.contains('msg-active')) {
        keyLi.classList.remove('msg-active');
        keyContent.style.height = '';
        keyContent.classList.remove('open');


      } else { // для выбранного закрытого

        // раскрываем содержимое по нажатию
        // для списка  для срабатывания свойства transition из css
        // нужно точно указать высоту высоту раскрытого блока
        // keyContent.scrollHeight
        // для идентификации "открытого" состояния маркируем классом .open
        keyLi.classList.add('msg-active');
        keyContent.style.height = keyContent.scrollHeight + 'px';
        keyContent.classList.add('open');
      }
    });
  };
  // закрываем все при первом открытии страницы
  play();

  // подключение событий нажатия
  accordionKeys.forEach((key, index) => {
    // кнопка клавиши
    const keyLi = key.querySelector('.title_block');
    // содержимое клавиши
    const keyContent = key.querySelector('.msg');

    // подключаем события по нажатию
    keyLi.addEventListener('click', () => {
      // отработка текущего и закрытие всех прочих открытых
      play(index);
    });
  });

};
