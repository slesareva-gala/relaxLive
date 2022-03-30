/* Лендинг. Формула успшности */
"use strict";

export const formula = () => {
  const formula = document.querySelector('.formula');

  formula.addEventListener('mouseover', (e) => {
    /*
    if (e.target.closest('.formula-item__icon')) {
      const item = e.target.parentElement.parentElement;
      const tool = item.querySelector('.formula-item-popup');
      const svg = tool.querySelector('.before');
      const formulaItem = tool.parentElement.parentElement;

      const orientation = (formulaItem.getBoundingClientRect().top > (tool.offsetHeight + 50)) ? false : true;

      item.classList.add('active-item');
      svg.style.transform = (orientation) ? "rotate(180deg)" : "";
      tool.style.top = (orientation) ? item.offsetWidth + 'px%' : '';
      tool.style.paddingTop = (orientation) ? '40px' : '';

    }
    */
    if (e.target.closest('.formula-item__icon')) {
      const formulaItem = e.target.parentElement.parentElement;
      const popup = formulaItem.querySelector('.formula-item-popup');
      const svg = popup.querySelector('.before');

      const orientation = (formulaItem.getBoundingClientRect().top > svg.offsetHeight) ? false : true;

      formulaItem.classList.add('active-item');
      svg.style.transform = (orientation) ? "rotate(180deg)" : "";
      popup.style.transform = (orientation) ? 'translateY(' +
        (formulaItem.offsetHeight + svg.offsetHeight + 10) + 'px)' : '';
      //popup.style.top = (orientation) ? formulaItem.offsetWidth + 'px' : '';
      popup.style.paddingTop = (orientation) ? '40px' : '';

    }
  });
  formula.addEventListener('mouseout', (e) => {
    if (e.target.closest('.formula-item__icon')) {
      e.target.parentElement.parentElement.classList.remove('active-item');
    }
  });


}; // END formul()
