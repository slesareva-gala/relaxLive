/* Лейдинг. Слайдер портфолио. Карточки */
"use strict";

export const portfolioPopup = () => {

  if (!('portfolioPopupCurrentSlide' in document)) return;

  const slidesPopup = [...document.querySelectorAll(".popup-portfolio-slider__slide")];
  const sledesText = [...document.querySelectorAll(".popup-portfolio-text")];

  const leftButton = document.getElementById('popup_portfolio_left');
  const rightButton = document.getElementById('popup_portfolio_right');

  const repairCounter = document.getElementById('popup-portfolio-counter');
  const counterCurrent = repairCounter.querySelector('.slider-counter-content__current');
  const counterTotal = repairCounter.querySelector('.slider-counter-content__total');
  repairCounter.style.top = "540px";
  repairCounter.style.zIndex = "10";

  counterTotal.textContent = slidesPopup.length;

  const styleBtnLeft = () => {
    if (document.portfolioPopupCurrentSlide === 0) leftButton.style = "";
    else {
      leftButton.style.fill = "blue";
      leftButton.style.top = "300px";
      leftButton.style.zIndex = "10";
    }
  };

  const styleBtnRight = () => {
    if (document.portfolioPopupCurrentSlide === slidesPopup.length - 1) rightButton.style = "";
    else {
      rightButton.style.fill = "blue";
      rightButton.style.top = "300px";
      rightButton.style.zIndex = "10";
    }
  };

  const setCurrentBlock = () => {
    slidesPopup[document.portfolioPopupCurrentSlide].classList.add('slide-current');
    sledesText[document.portfolioPopupCurrentSlide].style.display = 'block';
    counterCurrent.textContent = document.portfolioPopupCurrentSlide + 1;
    styleBtnLeft();
    styleBtnRight();
  };

  const unsetCurrentBlock = () => {
    slidesPopup[document.portfolioPopupCurrentSlide].classList.remove('slide-current');
    sledesText[document.portfolioPopupCurrentSlide].style.display = '';
  };


  // отобразить первый блок
  setCurrentBlock();

  const event = {
    leftButton: (e) => {
      unsetCurrentBlock();
      document.portfolioPopupCurrentSlide = Math.max(0, document.portfolioPopupCurrentSlide - 1);
      setCurrentBlock();
    },
    rightButton: (e) => {
      unsetCurrentBlock();
      document.portfolioPopupCurrentSlide = Math.min(slidesPopup.length - 1, document.portfolioPopupCurrentSlide + 1);
      setCurrentBlock();
    }
  };

  leftButton.addEventListener('click', event.leftButton);
  rightButton.addEventListener('click', event.rightButton);

  document.querySelector('.popup.popup-portfolio .close.mobile-hide').addEventListener('click', () => {
    leftButton.removeEventListener('click', event.leftButton);
    rightButton.removeEventListener('click', event.rightButton);
    unsetCurrentBlock();
  });

};
