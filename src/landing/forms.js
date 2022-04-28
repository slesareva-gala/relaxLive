/* Лейдинг. Заполнение и отправка форм  */
"use strict";

import { DataJSON } from "../modules/dataJSON";
import { Picture } from "../modules/helpers";

export const inputForm = () => {
  const body = document.querySelector('body');
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

  document.querySelectorAll('input[name="phone"]').forEach(input => {
    input.maskPhone = new Picture('+7 (ddd) ddd-dd-dd');
  });

  body.addEventListener('input', (e) => {
    // ввод телефона
    if (e.target.closest('input[name="phone"]')) {
      e.target.maskPhone.edit(e.target, e.inputType);
      e.target.classList.remove('error-input');

      // ввод имени
    } else if (e.target.closest('.feedback-block__form-input_name')) {
      // контроль ввода только допустимых символов
      e.target.value = e.target.value.replace(valid.name, "");
      e.target.classList.remove('error-input');

      // птичка согласия на обработку персональных данных
    } else if (e.target.closest('.checkbox__input')) {
      e.target.parentNode.classList.remove('error-input');
    }

  });

  body.addEventListener('focusout', (e) => {
    if (e.target.closest('.feedback-block__form-input_name')) {
      // дополнительные действия при потере фокуса
      let value = e.target.value;

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

  // закрываем действия вырезания/вставки для телефона - чтобы вводили по одному символу
  body.addEventListener('cut', (e) => {
    if (e.target.closest('input[name="phone"]')) e.preventDefault();
  });
  body.addEventListener('paste', (e) => {
    if (e.target.closest('input[name="phone"]')) e.preventDefault();
  });

}; // END inputForm()

export class SendForm {
  constructor({ url, errorMessageResponse = 'Ошибка сервера.', optionals = {} }) {
    // подключение сервиса данных
    this._dataForm = new DataJSON({
      url: url,
      errorMessageResponse: errorMessageResponse
    });
    this._optionals = optionals;
  }

  // обработка запроса и отправка формы
  send(form) {
    const name = form.querySelector('.feedback-block__form-input_name');
    const check = form.querySelector('.checkbox__input');
    const phone = form.querySelector('input[name="phone"]');
    const modal = form.closest('.popup');

    // валидация данных форм
    const validate = () => {
      return check.checked && (name ? name.value.trim().length > 2 : true) &&
        phone.value.replace(/[^\d]+/g, '').length === 11;
    };

    // все элементы формы, имеющие атрибут name
    const formData = new FormData(form);
    const formBody = {};

    formData.forEach((val, key) => {
      formBody[key] = (key === 'phone') ? val.replace(/[^\d]+/g, '') : val;
    });

    if (validate()) {

      // дополнительные данные к форме отправки
      if (form.id in this._optionals) {
        this._optionals[form.id].forEach(leading => {
          let elem;

          if ('name' in leading && 'assign' in leading) {
            if ('select' in leading) {
              if ((elem = document.querySelector(leading.select))) {
                formBody[leading.name] = leading.assign in elem ? elem[leading.assign] : leading.assign;
              }
            } else {
              formBody[leading.name] = leading.assign;
            }
          }
        });
      }

      // закрываем модальный блок отправки
      if (modal) document.modalList.close(modal);

      // отправка данных на сервер
      this._dataForm.add(formBody).then(data => {
        // очистка данных формы после отправки
        check.checked = false;
        phone.value = '';
        if (name) name.value = '';

        // окошко - спасибки
        document.modalList.open('popup-thank');

      }).catch((error) => {
        document.modalList.open('popup-thank-error');
      });

    } else {
      if (!check.checked) check.parentNode.classList.add('error-input');
      if (name && name.value.trim() < 3) name.classList.add('error-input');
      if (phone.value.replace(/[^\d]+/g, '').length !== 11) phone.classList.add('error-input');
    }
  } // END send()

} // END class SendForm

