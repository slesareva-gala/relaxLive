/* Админ-панель. Формирование список типов услуг */
"use strict";

// очистка шапки таблицы от ярлычков сортировки
import { cleaningHeader } from "./aItemCard";

// создание списка типов услуг
export const putTogetherListType = () => {
  const typeItem = document.getElementById('typeItem');

  document.dataItems.useSort({
    field: 'type',
    order: 'asc'
  }).then(items => {

    let uniqueType = 'Все типы услуг';
    let htmlTypeItem = `<option value="${uniqueType}">${uniqueType}</option>`;


    items.forEach((item) => {
      if (item.type !== uniqueType) {
        htmlTypeItem += `<option value="${item.type}">${item.type}</option>`;
        uniqueType = item.type;
      }
    });
    typeItem.innerHTML = htmlTypeItem;
    typeItem.selectedIndex = 0;
  });

};

// создание списка услуг в соответсвии с выбором типа
export const putTogetherType = () => {
  const typeItem = document.getElementById('typeItem');
  const valueFilter = typeItem.options[typeItem.selectedIndex].textContent;
  const tds = document.getElementById('tds');

  // отбираем данные
  if (typeItem.selectedIndex) {
    document.dataItems.filter(`type=${valueFilter}`).then(data => {
      tds.data = data;
      if (tds.records.filterApply.length) tds.records.filterRefrech();
      cleaningHeader();
    });
    // все данные
  } else {
    document.dataItems.use().then(data => {
      tds.data = data;
      if (tds.records.filterApply.length) tds.records.filterRefrech();
      cleaningHeader();
    });
  }
};

export const listType = () => {
  const typeItem = document.getElementById('typeItem');

  // создать первоначальный список типов услуг
  putTogetherListType();

  // изменение текущего типа услуги в списке
  typeItem.addEventListener('change', (e) => {
    // создание списка услуг в соответсвии с выбором типа
    putTogetherType();
  });
}; // END listType()
