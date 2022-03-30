/* Лендинг. Вводи имени клиента */
"use strict";

export const inputName = () => {
  const inputsName = document.querySelectorAll('.feedback-block__form-input_name');
  const inputCheck = document.querySelectorAll('.checkbox__input');

  const valid = {
    // имя
    name: /[^а-яё\s\-]+/gi,
    // кирилица
    rus: /[а-я]/gi,
    // пробелы или дефисы в начале и конце
    trimSH: /(^[\s\-]+|^)(.*?)(?:([\s\-]+$)|$)/i,
    // повторяющиеся подряд пробелы|дефисы
    multySH: /(\s{2,})|(\-{2,})/g,
    // слово с выделением первой буквы
    wordFirst: /((^|\s\-|\s|\-)[а-я])([а-я]*)/gi,
  };

  inputsName.forEach(input => {
    // контроль ввода только допустимых символов
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(valid.name, "");
      e.target.classList.remove('error');
    });

    // дополнительные действия при потере фокуса
    input.addEventListener('focusout', (e) => {
      if (e.target.matches('input')) {
        let name = e.target.name,
          value = e.target.value;

        // замена первой буквы слова на большую остальные маленькие
        value = value.replace(valid.wordFirst,
          (word, first, f1, other) => first.toUpperCase() + other.toLowerCase());

        // - удаление ведущих и завершающих пробелов и дефисов
        value = value.replace(valid.trimSH, (str, begin, sense) => `${sense}`);
        // - замена нескольких идущих подряд пробелов|дефисов на один пробел|дефис
        value = value.replace(valid.multySH, (str, spaces, hyphens) =>
          (spaces ? ' ' : '') + (hyphens ? '-' : ''));
        e.target.value = value;
      }
    });

  });
  inputCheck.forEach((input) => {
    input.addEventListener('click', (e) => {
      e.target.parentNode.classList.remove('error');
    });

  });

}; // END inputName()

