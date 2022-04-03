/* Лендинг. Формула успшности */
"use strict";

import { animate } from './helpers';

export const formula = () => {
  const formula = document.querySelector('.formula');
  const formulaSlider = formula.querySelector('.formula-slider');
  const slides = formula.querySelectorAll('.formula-slider__slide');
  const btnLeft = formula.querySelector('#formula-arrow_left');
  const btnRight = formula.querySelector('#formula-arrow_right');
  // выбранный в tablet
  let formulaItem = null;
  // номер текущего слайда
  let numSlide = 1;
  slides[0].classList.add('active-item');
  btnLeft.classList.add('hide');

  formula.addEventListener('mouseover', (e) => {
    if (e.target.closest('.formula-item__icon')) {
      // если перескочили между формулами
      if (formulaItem) formulaItem.classList.remove('active-item', 'rotate');

      formulaItem = e.target.classList.contains('formula-item__icon') ?
        e.target.parentElement : e.target.parentElement.parentElement;

      const popup = formulaItem.querySelector('.formula-item-popup');
      const rotate = (formulaItem.getBoundingClientRect().top > popup.offsetHeight) ? true : false;

      formulaItem.classList.add('active-item');
      if (rotate) formulaItem.classList.add('rotate');
    }
  });
  formula.addEventListener('mouseout', (e) => {
    if (e.target.closest('.formula-item__icon')) {
      if (formulaItem) formulaItem.classList.remove('active-item', 'rotate');
      formulaItem = null;
    }
  });

  formula.addEventListener('click', (e) => {
    if (e.target.closest('.slider-arrow')) {
      const preSlide = -100 * (numSlide - 1),
        step = e.target.closest('#formula-arrow_right') ? -100 : 100;
      slides[numSlide - 1].classList.remove('active-item');

      if (step < 0) numSlide++;
      else numSlide--;

      btnLeft.classList.remove('hide');
      btnRight.classList.remove('hide');
      if (numSlide === 1) btnLeft.classList.add('hide');
      if (numSlide === 6) btnRight.classList.add('hide');

      animate({
        duration: 400,
        timingplane: 'easeOutCubic',
        draw(progress) {
          // скролл слайдов
          formulaSlider.style.left = preSlide + step * progress + '%';
          if (progress === 1) slides[numSlide - 1].classList.add('active-item');
        }
      });

    }
  });

}; // END formul()
