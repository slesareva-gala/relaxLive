/* Лейдинг. Болк с документами  */
"use strict";
import { transpPopup } from './lTranspPopup';

export const transparency = () => {


  const transparencySlider = document.querySelector(".transparency-slider.row");
  const slidesTransparency = [...document.querySelectorAll(".transparency-item")];
  const leftButton = document.getElementById('transparency-arrow_left');
  const rightButton = document.getElementById('transparency-arrow_right');

  let currentSlide = 0;

  slidesTransparency.forEach((slide, index) => {
    slide.number = index;
  });


  const styleBtnLeft = () => {
    if (currentSlide === 0) leftButton.style.display = "none";
    else leftButton.style.display = "";
  };

  const styleBtnRight = () => {
    if (currentSlide === slidesTransparency.length - 1) rightButton.style.display = "none";
    else rightButton.style.display = "";
  };


  leftButton.addEventListener('click', (e) => {
    if (currentSlide > 0) {
      slidesTransparency[currentSlide - 1].style.display = "";
      currentSlide--;
    }
    styleBtnLeft();
    styleBtnRight();
  });


  rightButton.addEventListener('click', (e) => {
    if (currentSlide < slidesTransparency.length - 1) {
      slidesTransparency[currentSlide].style.display = "none";
      currentSlide++;
    }
    styleBtnLeft();
    styleBtnRight();
  });

  transparencySlider.addEventListener('click', (e) => {
    const number = slidesTransparency.findIndex(el => el === e.target.parentElement);
    if (~number) {
      document.transpPopupCurrentSlide = number;
      transpPopup();
      document.openPopup.open('popup-transparency');
    }
  });

  window.addEventListener('resize', (e) => {
    slidesTransparency.forEach(slide => {
      slide.style.display = '';
    });
    currentSlide = 0;
    styleBtnLeft();
    styleBtnRight();
  });

};
