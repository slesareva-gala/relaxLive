/* слайдер отзывов */
"use strict";

import { animate } from './helpers';

export const reviewsSlider = () => {

  const reviews = document.querySelector(".reviews");
  const slider = reviews.querySelector(".reviews-slider");
  const slides = slider.querySelectorAll(".reviews-slider__slide");
  const qtySlides = slides.length;

  const leftButton = reviews.querySelector('.slider-arrow_left');
  const rightButton = reviews.querySelector('.slider-arrow_right');

  let currentSlide = 0;

  // отображение кнопок навигации слайдов
  const showButton = () => {
    leftButton.classList.remove('hide');
    rightButton.classList.remove('hide');
    if (currentSlide === 0) leftButton.classList.add('hide');
    if (currentSlide === qtySlides - 1) rightButton.classList.add('hide');
  };

  // активизация текущего слайда
  const setCurrentBlock = () => {
    slider.style.left = -currentSlide * 100 + '%';
    showButton();
  };

  // навигация блоков в слайдере
  const navBlock = (direction) => {
    const numBlock = currentSlide;
    const preBlock = -100 * numBlock, step = -100 * direction;

    currentSlide = direction > 0 ?
      Math.min(qtySlides - 1, currentSlide + 1) :
      Math.max(0, currentSlide - 1);

    animate({
      duration: 400,
      timingplane: 'easeInOutCubic',
      draw(progress) {
        // скролл блоков
        slider.style.left = preBlock + step * progress + '%';
        if (progress === 1) setCurrentBlock();
      }
    });
  };

  // навигация слайдов в слайдере
  const reviewsSlider = (e) => {
    let elem;

    if ((elem = e.target.closest('.slider-arrow'))) {
      navBlock(elem.classList.contains('slider-arrow_right') ? 1 : -1);
    }
  };
  reviews.addEventListener('click', reviewsSlider);

};
