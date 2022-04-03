/* Лейдинг. Полный список видов ремонтов */
"use strict";
import { DataJSON } from "./dataJSON";

export const repairFull = (pathData) => {
  const navListRepair = document.querySelector('.nav-list-popup-repair');
  const switchInner = document.getElementById('switch-inner');
  const tbody = document.querySelector('.popup-repair-types-content-table__list tbody');

  // текущий пункт списка
  navListRepair.selected = null;

  // подключение сервиса данных
  document.dataRepairFull = new DataJSON({
    url: pathData,
    errorMessageResponse: 'Сервер регистрации недоступен. Запрос отменен.'
  });

  // заполнение таблички данными
  const render = (data) => {
    let textHTML = '';
    data.forEach(row => {
      textHTML += `
      <tr class="mobile-row showHide">
        <td class="repair-types-name">${row.name}</td>
        <td class="mobile-col-title tablet-hide desktop-hide">Ед.измерения</td>
        <td class="mobile-col-title tablet-hide desktop-hide">Цена за ед.</td>
        <td class="repair-types-value">${row.units}</td>
        <td class="repair-types-value">${row.cost} руб.</td>
      </tr>
      `;
    });

    // очистим предыдущие данные
    tbody.innerHTML = "";
    // добавим новое
    tbody.insertAdjacentHTML('beforeend', textHTML);
  };


  // установка текущего блока
  const setCurrentBlock = (block) => {
    navListRepair.selected = block;
    block.style.background = "rgba(223,205,168,0.7";
    switchInner.textContent = block.textContent;
    // отбираем данные
    document.dataRepairFull.filter(`type=${block.textContent}`).then(data => {
      render(data.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)));
    });
  };

  // деактивация текущего блока
  const unsetCurrentBlock = () => {
    const block = navListRepair.selected;
    block.style.background = "";
  };


  // формируем перечень видов работя
  document.dataRepairFull.useSort({
    field: 'type',
    order: 'asc'
  }).then(items => {

    let uniqueType = 'Все типы услуг';
    let htmlTypeItem = ``;

    items.forEach((item) => {
      if (item.type !== uniqueType) {
        htmlTypeItem += `<button class="button_o popup-repair-types-nav__item">${item.type}</button>`;
        uniqueType = item.type;
      }
    });
    navListRepair.innerHTML = htmlTypeItem;
    setCurrentBlock(navListRepair.firstChild);
  });

  navListRepair.addEventListener('click', (e) => {
    if (e.target.closest('.nav-list-popup-repair')) {
      unsetCurrentBlock();
      setCurrentBlock(e.target);
    }
  });

};

