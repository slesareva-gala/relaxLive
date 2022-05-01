/* Админ-панель. Точка входа по defer после HTML */
"use strict";

import { addPreloader } from "./modules/preloader";
import { DataJSON } from "./modules/dataJSON";
import { authorization } from "./admin/authorization";
import { catalog } from "./admin/catalog";

const site = window.location;

// добавляем прелодер на document
addPreloader();

if (site.pathname.includes('table.html')) {
  // подключение сервиса данных
  document.taskDemo = 0;
  document.dataСatalog = new DataJSON({
    url: 'http://localhost:4545/items',
    urlDemo: '../dbDemo/items.json',
    errorMessageResponse: 'Сервер базы данных недоступен. Действие отменено.'
  });
  // каталог услуг
  catalog();
} else {
  // подключение сервиса данных
  document.dataAdmin = new DataJSON({
    url: 'http://localhost:4545/users',
    urlDemo: '../dbDemo/users.json',
    errorMessageResponse: 'Сервер регистрации недоступен. Аутентификация невозможна.'
  });
  // авторизация, параметры: количествоДнейХраненияКуки
  authorization(30);
}
