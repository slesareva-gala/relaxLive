/* Лендинг. Форматированный ввод номера телефона */
"use strict";

import { Picture } from "./helpers";

export const maskPhoneNumber = () => {
  const inputPhones = document.querySelectorAll('input[name="phone"]');

  inputPhones.forEach(input => {
    const maskPhone = new Picture('+7 (ddd) ddd-dd-dd');

    input.addEventListener('input', (e) => {
      maskPhone.edit(e.target, e.inputType);
      e.target.classList.remove('error');
    });
    // закрываем действия вырезания/вставки - чтобы вводили по одному символу
    input.addEventListener('cut', (event) => event.preventDefault());
    input.addEventListener('paste', (event) => event.preventDefault());

  });

}; // END maskPhoneNumber()

