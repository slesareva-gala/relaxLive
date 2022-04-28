/* Лендинг. Часто задаваемые вопросы */
"use strict";

import { smoothScroll } from '../modules/helpers';

export const accordeon = () => {
  const accordeon = document.querySelector('.accordion');
  const accordeonList = [...accordeon.children];
  let currentIndex = -1;

  // выбор блока
  const choiceBlock = (block) => {
    const choiceIndex = accordeonList.findIndex(el => el === block);
    const cssOpen = 'accordion-more-active';
    const moreClose = ~currentIndex ? accordeonList[currentIndex].firstElementChild.nextElementSibling : null;
    const moreOpen = (currentIndex === choiceIndex) ? null : block.firstElementChild.nextElementSibling;

    // закрытие открытого блока
    if (~currentIndex) {
      if (currentIndex < choiceIndex) {
        moreClose.style.transition = "max-height 0s ease-out";
        window.scrollTo(0, window.scrollY - parseInt(moreClose.style.maxHeight));
      }
      accordeonList[currentIndex].classList.remove(cssOpen);
      moreClose.style.maxHeight = "";
    }

    if (currentIndex === choiceIndex) {
      currentIndex = -1;

      // открытие блока
    } else {
      block.classList.add(cssOpen);
      moreOpen.style.maxHeight = moreOpen.scrollHeight + 'px';

      window.setTimeout(() => {
        smoothScroll(".accordion-more-active", 500);
        if (~currentIndex) moreClose.style.transition = "";
        currentIndex = choiceIndex;
      }, 0);

    }
  };

  // игра на аккордеоне
  const play = (e) => {
    const head = e.target.closest('h2');
    if (head) choiceBlock(head.parentElement);
  };
  accordeon.addEventListener('click', play);
};
