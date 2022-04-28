/* Админ-панель. Авторизация */
"use strict";

import { setCookie } from "./cookie";

export const authorization = (dayAgeCookie = 30) => {
  const forma = document.querySelector("form");
  const name = forma.querySelector("#name");
  const password = forma.querySelector("#type");
  const btnSubmit = forma.querySelector(".button-ui_firm");
  const remember = forma.querySelector(".remember");

  // устанавка предупреждение об ошибке
  const warning = (succesName, succesPassword) => {
    name.nextElementSibling.style.display = succesName ? '' : 'initial';
    if (!succesName) name.value = '';

    password.nextElementSibling.style.display = succesPassword ? '' : 'initial';
    if (!succesPassword) password.value = '';
  };

  // аутентификация админа
  const authentication = () => {
    document.dataAdmin.use().then(users => {
      const user = users.find(user => user.login === name.value);
      warning(user, !user || user.password === password.value);
      if (user && user.password === password.value) {
        const site = window.location;
        setCookie(name.value, remember.checked ? dayAgeCookie : 0);
        site.replace(site.toString().replace(/[^\/]*$/, '') + 'table.html');
      }
    });
  };

  // контроль ввода только допустимых символов (имя - без пробелов)
  forma.addEventListener('input', (e) => {
    if (e.target.matches('.input')) {
      if (e.target.id === "name") {
        e.target.value = e.target.value.replace(/[\s]+/gi, "");
      }
      e.target.nextElementSibling.style.display = '';
    }
  });

  // вход по клику мышкой на кнопочку входа
  btnSubmit.addEventListener('click', () => {
    if (name.value) authentication();
    else warning(name.value, true);
  });

  // запрет на обычный ввод формы
  forma.addEventListener('submit', (e) => e.preventDefault());

}; // END authorization()
