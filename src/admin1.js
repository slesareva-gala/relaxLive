/* Админ-панель. Точка входа по defer после HTML */

"use strict";

import { authorization } from "./modules/aAuthorization";
import { addPreloader } from "./modules/preloader";
import { DataJSON } from "./modules/dataJSON";
import { table } from "./modules/aTable";
import { tableInit } from "./modules/aTableInit";
import { listType } from "./modules/aListType";
import { itemCard } from "./modules/aItemCard";


const site = window.location;

// добавляем прелодер на document
addPreloader();

if (site.pathname.includes('table.html')) {
  // подключение сервиса данных
  document.dataItems = new DataJSON({
    url: 'http://localhost:4545/items',
    errorMessageResponse: 'Сервер базы данных недоступен. Действие отменено.'
  });
  tableInit();
  // список услуг
  listType();
  // таблица
  table();
  // карточка товара
  itemCard();

} else {
  // подключение сервиса данных
  document.dataAdmin = new DataJSON({
    url: 'http://localhost:4545/users',
    errorMessageResponse: 'Сервер регистрации недоступен. Аутентификация невозможна.'
  });
  // авторизация, параметры: количествоДнейХраненияКуки
  authorization(30);
}

