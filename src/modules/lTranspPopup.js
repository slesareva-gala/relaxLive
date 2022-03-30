/* Лейдинг. Блок с документами. Карточки */
"use strict";

export const transpPopup = () => {

  if (!('transpPopupCurrentSlide' in document)) return;


  const slidesPopupTransp = [...document.querySelectorAll(".popup-transparency-slider__slide")];

  const leftButton = document.getElementById('transparency_left');
  const rightButton = document.getElementById('transparency_right');

  const repairCounter = document.getElementById('transparency-popup-counter');
  const counterCurrent = repairCounter.querySelector('.slider-counter-content__current');
  const counterTotal = repairCounter.querySelector('.slider-counter-content__total');
  repairCounter.style.top = "500px";
  repairCounter.style.zIndex = "10";

  counterTotal.textContent = slidesPopupTransp.length;

  const styleBtnLeft = () => {
    if (document.transpPopupCurrentSlide === 0) leftButton.style.display = "none";
    else leftButton.style.display = "";
  };

  const styleBtnRight = () => {
    if (document.transpPopupCurrentSlide === slidesPopupTransp.length - 1)
      rightButton.style.display = "none";
    else rightButton.style.display = "";
  };

  const setCurrentBlock = () => {
    slidesPopupTransp[document.transpPopupCurrentSlide].classList.add('slide-current');

    counterCurrent.textContent = document.transpPopupCurrentSlide + 1;
    styleBtnLeft();
    styleBtnRight();
  };

  const unsetCurrentBlock = () => {
    slidesPopupTransp[document.transpPopupCurrentSlide].classList.remove('slide-current');
  };


  // отобразить первый блок
  setCurrentBlock();

  const event = {
    leftButton: (e) => {
      unsetCurrentBlock();
      document.transpPopupCurrentSlide = Math.max(0, document.transpPopupCurrentSlide - 1);
      setCurrentBlock();
    },
    rightButton: (e) => {
      unsetCurrentBlock();
      document.transpPopupCurrentSlide = Math.min(slidesPopupTransp.length - 1,
        document.transpPopupCurrentSlide + 1);
      setCurrentBlock();
    }
  };

  leftButton.addEventListener('click', event.leftButton);
  rightButton.addEventListener('click', event.rightButton);


  document.querySelector('.popup.popup-transparency .close.mobile-hide').addEventListener('click', () => {
    leftButton.removeEventListener('click', event.leftButton);
    rightButton.removeEventListener('click', event.rightButton);
    unsetCurrentBlock();
  });

};
