/* слайдер отзывов */
"use strict";

export const reviewsSlider = () => {

  const slidesPopup = [...document.querySelectorAll(".reviews-slider__slide")];
  const leftButton = document.getElementById('reviews-arrow_left');
  const rightButton = document.getElementById('reviews-arrow_right');

  let currentSlide = 0;

  const styleBtnLeft = () => {
    if (currentSlide === 0) leftButton.style.display = "none";
    else leftButton.style.display = "";
  };

  const styleBtnRight = () => {
    if (currentSlide === slidesPopup.length - 1) rightButton.style.display = "none";
    else rightButton.style.display = "";
  };


  leftButton.addEventListener('click', (e) => {
    if (currentSlide > 0) {
      slidesPopup[currentSlide - 1].style.display = "";
      currentSlide--;
    }
    styleBtnLeft();
    styleBtnRight();
  });

  rightButton.addEventListener('click', (e) => {
    if (currentSlide < slidesPopup.length - 1) {
      slidesPopup[currentSlide].style.display = "none";
      currentSlide++;
    }
    styleBtnLeft();
    styleBtnRight();
  });

};
