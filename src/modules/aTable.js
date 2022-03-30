/* Админ-панель. Список услуг */
"use strict";

import { delCookie, getCookie } from "./aCookie";

export const table = () => {


  // логин админа
  document.querySelector('.admin-exit').prepend(getCookie());

  document.querySelector('.admin-exit button').addEventListener('click', () => {
    const site = window.location;
    delCookie();
    site.replace(site.toString().replace('/table.html', ''));
  });


}; // END table()
