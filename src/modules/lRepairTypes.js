/* Лейдинг. Слайдер Видов ремонтов */
"use strict";

export const repairTypes = () => {
  const buttonSliders = [...document.querySelectorAll(".repair-types-nav__item")];
  const leftButton = document.querySelector('.repair-types .slider-arrow_left');
  const rightButton = document.querySelector('.repair-types .slider-arrow_right');
  const repairCounter = document.getElementById('repair-counter');
  const counterCurrent = repairCounter.querySelector('.slider-counter-content__current');
  const counterTotal = repairCounter.querySelector('.slider-counter-content__total');
  repairCounter.style.zIndex = '2';

  const leftButtonBase = document.getElementById('nav-arrow-repair-left_base');
  const rightButtonBase = document.getElementById('nav-arrow-repair-right_base');

  const setCurrentBlock = (block) => {
    block.currentSlide = 0;
    block.sliders.classList.add("repair-types-current");
    block.slides[block.currentSlide].classList.add('slide-current');
    block.style.borderWidth = "1px";
    block.style.borderStyle = "solid";
    block.style.borderColor = "#c09133";
    block.style.borderRadius = "25px";
    counterCurrent.textContent = block.currentSlide + 1;
    counterTotal.textContent = block.slides.length;
  };

  const unsetCurrentBlock = (block) => {
    block.style.borderWidth = "";
    block.style.borderStyle = "";
    block.style.borderColor = "";
    block.style.borderRadius = "";
    block.sliders.classList.remove('repair-types-current');
    block.slides[block.currentSlide].classList.remove('slide-current');
  };

  let currentBlock;

  const indexBlock = (block) => +block.className.replace(/[^\d]+/, "") - 1;

  buttonSliders.forEach((button, index) => {
    if (!currentBlock) currentBlock = button;
    button.slides = [];
    // ссылки на хранилище слайдов текущего слайдера
    button.sliders = document.querySelector('.types-repair' + (index + 1));
    if (index === 0) currentBlock = button;
    button.currentSlide = 0;

    button.sliders.querySelectorAll('.repair-types-slider__slide').forEach(sl => {
      button.slides.push(sl);
    });

    button.addEventListener('click', (e) => {
      unsetCurrentBlock(currentBlock);
      currentBlock = e.target;
      setCurrentBlock(currentBlock);
    });

  });
  // установить первый
  if (currentBlock) setCurrentBlock(currentBlock);

  leftButton.addEventListener('click', (e) => {
    currentBlock.slides[currentBlock.currentSlide].classList.remove('slide-current');
    currentBlock.currentSlide = Math.max(0, currentBlock.currentSlide - 1);
    currentBlock.slides[currentBlock.currentSlide].classList.add('slide-current');
    counterCurrent.textContent = currentBlock.currentSlide + 1;
  });
  rightButton.addEventListener('click', (e) => {
    currentBlock.slides[currentBlock.currentSlide].classList.remove('slide-current');
    currentBlock.currentSlide = Math.min(currentBlock.slides.length - 1, currentBlock.currentSlide + 1);
    currentBlock.slides[currentBlock.currentSlide].classList.add('slide-current');
    counterCurrent.textContent = currentBlock.currentSlide + 1;
  });

  leftButtonBase.addEventListener('click', (e) => {
    const countNone = buttonSliders.findIndex((btn) => btn.style.display !== "none");
    if (countNone) buttonSliders[countNone - 1].style.display = '';

    if (indexBlock(currentBlock) > 0) {
      unsetCurrentBlock(currentBlock);
      currentBlock = buttonSliders[indexBlock(currentBlock) - 1];
      setCurrentBlock(currentBlock);
    }
  });

  rightButtonBase.addEventListener('click', (e) => {
    const countNone = buttonSliders.findIndex((btn) => btn.style.display !== "none");
    if (buttonSliders.length - countNone > 2) buttonSliders[countNone].style.display = 'none';

    if (indexBlock(currentBlock) === countNone || indexBlock(currentBlock) < buttonSliders.length - 1) {
      unsetCurrentBlock(currentBlock);
      currentBlock = buttonSliders[indexBlock(currentBlock) + 1];
      setCurrentBlock(currentBlock);
    }
  });

  window.addEventListener('resize', (e) => {
    const countNone = buttonSliders.findIndex((btn) => btn.style.display !== "none");

    if (countNone) {
      for (let i = 0; i < countNone; i++) {
        buttonSliders[i].style.display = '';
      }
    }
    unsetCurrentBlock(currentBlock);
    currentBlock = buttonSliders[0];
    setCurrentBlock(currentBlock);

  });

};
