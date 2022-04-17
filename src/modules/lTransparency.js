/* Лейдинг. Блок с документами  */
"use strict";

import { animate, smoothScroll } from './helpers';

// модальный cлайдер документов
const transparencyPopup = (callingBlock, calbackHarmonization) => {
  const transparency = document.querySelector(".popup-transparency");
  const slider = transparency.querySelector(".popup-transparency-slider");
  const slides = slider.querySelectorAll(".popup-transparency-slider__slide");
  const qtySlides = slides.length;

  const leftButton = transparency.querySelector('.nav-arrow_left');
  const rightButton = transparency.querySelector('.nav-arrow_right');

  const sliderCounter = transparency.querySelector('#transparency-popup-counter');
  const counterCurrent = sliderCounter.querySelector('.slider-counter-content__current');
  const counterTotal = sliderCounter.querySelector('.slider-counter-content__total');


  // отображение кнопок навигации слайдов
  const showButton = () => {
    leftButton.classList.remove('hide');
    rightButton.classList.remove('hide');
    if (document.transparencyCurrentSlide === 0) leftButton.classList.add('hide');
    if (document.transparencyCurrentSlide === qtySlides - 1) rightButton.classList.add('hide');
  };

  // активизация текущего слайда
  const setCurrentBlock = () => {
    slider.style.left = -document.transparencyCurrentSlide * 100 + '%';
    counterCurrent.textContent = document.transparencyCurrentSlide + 1;
    showButton();
  };

  // навигация блоков в слайдере
  const navBlock = (direction) => {
    const numBlock = document.transparencyCurrentSlide;
    const preBlock = -100 * numBlock, step = -100 * direction;

    document.transparencyCurrentSlide = direction > 0 ?
      Math.min(qtySlides - 1, document.transparencyCurrentSlide + 1) :
      Math.max(0, document.transparencyCurrentSlide - 1);

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

  const transparencySlider = (e) => {
    let elem;

    // навигация слайдов в слайдере
    if ((elem = e.target.closest('.nav-arrow'))) {
      navBlock(elem.classList.contains('nav-arrow_right') ? 1 : -1);

    } else if (e.target.closest('.close') ||
      e.target.closest('.popup') && e.target.classList.contains('active-popup')) {
      transparency.removeEventListener('click', transparencySlider);
      callingBlock.classList.remove('hide');
      calbackHarmonization();
      smoothScroll(".transparency-title");
    }
  };
  transparency.addEventListener('click', transparencySlider);

  counterTotal.textContent = qtySlides;
  // при вызове, отобразить текущий блок
  setCurrentBlock();
  // закрыть вызвавший карточку блок
  callingBlock.classList.add('hide');
}; // END


// мобильный слайдер документов
export const transparency = () => {
  const transparency = document.querySelector(".transparency-slider");
  const wrap = transparency.querySelector('.transparency-slider-wrap');
  const slider = wrap.querySelector(".row");
  const slides = slider.querySelectorAll(".transparency-item");
  const qtySlides = slides.length;

  const leftButton = transparency.querySelector('#transparency-arrow_left');
  const rightButton = transparency.querySelector('#transparency-arrow_right');

  // отображение кнопок навигации слайдов
  const showButton = () => {
    leftButton.classList.remove('hide');
    rightButton.classList.remove('hide');
    if (document.transparencyCurrentSlide === 0) leftButton.classList.add('hide');
    if (document.transparencyCurrentSlide === qtySlides - 1) rightButton.classList.add('hide');
  };

  // активизация текущего слайда
  const setCurrent = () => {
    slider.style.left = -document.transparencyCurrentSlide * 100 + '%';
    showButton();
  };

  // навигация блоков в слайдере
  const navSlider = (direction) => {
    const numBlock = document.transparencyCurrentSlide;
    const preBlock = -100 * numBlock, step = -100 * direction;

    document.transparencyCurrentSlide = direction > 0 ?
      Math.min(qtySlides - 1, document.transparencyCurrentSlide + 1) :
      Math.max(0, document.transparencyCurrentSlide - 1);

    animate({
      duration: 400,
      timingplane: 'easeInOutCubic',
      draw(progress) {
        slider.style.left = preBlock + step * progress + '%';
        if (progress === 1) setCurrent();
      }
    });
  };

  const transparencySlider = (e) => {
    let elem;

    // навигация слайдов в слайдере
    if ((elem = e.target.closest('.slider-arrow'))) {
      navSlider(elem.classList.contains('slider-arrow_right') ? 1 : -1);

      // просмотр одного документа из слайдера
    } else if ((elem = e.target.closest('.transparency-item'))) {
      document.transparencyCurrentSlide = elem.number;
      transparencyPopup(transparency, setCurrent);
      document.modalList.open('popup-transparency');
    }
  };
  transparency.addEventListener('click', transparencySlider);

  // первоначальная инициалиазия
  // текущий слайд
  document.transparencyCurrentSlide = 0;
  // нумерация слайдов
  slides.forEach((slide, index) => slide.number = index);
};
