/* Лейдинг. Отправка форм  */
"use strict";

import { DataJSON } from "./dataJSON";

export class SendForm {
  constructor({ url, errorMessageResponse = 'Ошибка сервера.', optionals = {} }) {
    // подключение сервиса данных
    this._dataForm = new DataJSON({
      url: url,
      errorMessageResponse: errorMessageResponse,
      /*headers: {
        "Content-Type": "multipart/json"
      }*/
    });
    this._optionals = optionals;
  }

  // обработка запроса и отправка формы
  send(form) {

    let name = form.querySelector('.feedback-block__form-input_name');
    const check = form.querySelector('.checkbox__input');


    // валидация данных форм
    const validate = (formBody) => {
      return check.checked && (name ? name.value.trim() > 2 : true) && formBody.phone.length === 11;
    };

    // все элементы формы, имеющие атрибут name
    const formData = new FormData(form);
    const formBody = {};

    formData.forEach((val, key) => {
      formBody[key] = (key === 'phone') ? val.replace(/[^\d]+/g, '') : val;
    });

    if (validate(formBody)) {

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

      // отправка данных на сервер
      this._dataForm.add(formBody).then(data => {
        // очистка данных формы после отправки
        form.querySelectorAll('input').forEach(input => {
          input.value = '';
        });
        form.phone.classList.remove('error');
        form.querySelector('.checkbox__input').checked = false;
        // окошко - спасибки
        document.openPopup.open('popup-thank');
      });

    } else {
      if (!check.checked) check.parentNode.classList.add('error');
      if (name && name.value.trim() < 3) name.classList.add('error');
      form.phone.classList.add('error');
    }
  } // END send()

} // END class SendForm
