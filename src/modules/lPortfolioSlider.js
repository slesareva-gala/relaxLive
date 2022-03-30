/* Лейдинг. Слайдер портфолио */
"use strict";

import { portfolioPopup } from './lPortfolioPopup';

export const portfolioSlider = () => {

  const portfolioSlider = document.querySelector(".portfolio-slider.mobile-hide");
  const slides = portfolioSlider.querySelectorAll('.portfolio-slider__slide-frame');

  const leftButton = document.getElementById('portfolio-arrow_left');
  const rightButton = document.getElementById('portfolio-arrow_right');


  const listSlides = [];
  const listHidden = [];

  slides.forEach((slide, index) => {
    slide.number = index;
    listSlides.push(slide);
  });

  const event = {
    leftButton: (e) => {
      const last = listHidden.length - 1;

      if (last > 0) {
        listHidden[last].classList.remove('portfolio-slide-hidden');
        listHidden[last - 1].classList.remove('portfolio-slide-hidden');
        listSlides.unshift(listHidden[last]);
        listSlides.unshift(listHidden[last - 1]);
        listHidden.splice(last, 1);
        listHidden.splice(last - 1, 1);
        if (last === 2) leftButton.style.display = '';
        rightButton.style.display = '';
      }
    },
    rightButton: (e) => {
      if (listSlides.length > 6) {
        listSlides[0].classList.add('portfolio-slide-hidden');
        listSlides[1].classList.add('portfolio-slide-hidden');
        listHidden.push(listSlides[0]);
        listHidden.push(listSlides[1]);
        listSlides.splice(0, 1);
        listSlides.splice(0, 1);

        leftButton.style.display = 'flex';
        if (listSlides.length < 7) rightButton.style.display = 'none';
      }
    },
    portfolioSlider: (e) => {
      document.portfolioPopupCurrentSlide = e.target.number;
      portfolioPopup();
      document.openPopup.open('popup-portfolio');
    }
  };

  leftButton.addEventListener('click', event.leftButton);
  rightButton.addEventListener('click', event.rightButton);
  portfolioSlider.addEventListener('click', event.portfolioSlider);


};
