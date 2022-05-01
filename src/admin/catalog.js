/* Админ-панель. Каталог услуг */
"use strict";

import { delCookie, getCookie } from "./cookie";

// Настройка каталога услуг
const catalogListInit = (catalogList) => {
  catalogList.use({
    data: [],
    headingHeight: 50,
    rowHeight: 50,
    gapCol: 0,
    hrefCSS: './css/catalogHidden.css',
    columns: [
      {
        id: 'id',
        width: 110,
        widthMin: 110,
        widthMax: 110,
        when: x => (true),
        head: () => `<div class="column-head">ID` +
          `<span class="icon-sort">&#129093</span></div>`,
        cell: 'id',
        cellSay: x => `<span class="id">${x.id}</span>`,
      },
      {
        id: 'type',
        width: 200,
        widthMin: 200,
        widthMax: 200,
        when: x => (true),
        head: () => `<div class="column-head">Тип услуги` +
          `<span class="icon-sort">&#129093</span></div>`,
        cell: 'type'
      },
      {
        id: 'name',
        width: 300,
        widthMin: 300,
        widthMax: 300,
        when: x => (true),
        head: () => `<div class="column-head">Виды работ` +
          `<span class="icon-sort">&#129093</span></div>`,
        cell: 'name'
      },
      {
        id: 'units',
        width: 113,
        widthMin: 113,
        widthMax: 113,
        when: x => (true),
        head: () => `<div class="column-head"><div class="min-width">Единицы измерения</div>` +
          `<span class="icon-sort">&#129093</span></div>`,
        cell: 'units'
      },
      {
        id: 'cost',
        width: 110,
        widthMin: 110,
        widthMax: 110,
        when: x => (true),
        head: () => `<div class="column-head"><div class="min-width">Цена за единицу</div>` +
          `<span class="icon-sort">&#129093</span></div>`,
        cell: x => +(x.cost + '').replace(/[^\d]+/g, ''),
        cellSay: x => `<span>${x.cost} руб</span>`,
      },
      {
        width: 138,
        widthMin: 138,
        widthMax: 138,
        when: x => false,
        head: () => `<div class="column-head no-pointer">Действия</div>`,
        cell: 'permissions',
        cellSay: x => `<div class="table__actions">` +
          `<button class="button action-change">` +
          `<span class="action-icon_change">&#128394;` +
          `</span><span>Изменить</span>` +
          `</button>` +
          `<button class="button action-remove">` +
          `<span class="action-icon_remove">&#11198;</span>` +
          `<span>Удалить</span>` +
          `</button>` +
          `</div>`,
      },
    ]
  });
};

// наибольшее допустимое количество символов в строке данных
const maxLen = {
  "type": 30,
  "name": 70,
  "units": 20,
  "cost": 9
};

// условия проверки валидности ввода
const valid = {
  // именные проверки
  "type": /[^а-яёa-z\s\d\.\,\;\:\-\?\!\)\(\"]+/gi,
  "name": /[^а-яёa-z\s\d\.\,\;\:\-\?\!\)\(\"]+/gi,
  "units": /[^а-яёa-z\s\d\.\,\;\:\-\?\!\)\(\"]+/gi,
  "cost": /[^\d]+/gi,

  // пробелы или дефисы в начале и конце
  trimSH: /(^[\s\-]+|^)(.*?)(?:([\s\-]+$)|$)/i,
  // повторяющиеся подряд пробелы|дефисы
  multySH: /(\s{2,})|(\-{2,})/g,
};

export const catalog = () => {
  // каталог и сервис работы с каталогом
  const catalog = document.querySelector('.main');
  // поле для ввода значения для фильтрации вида работ
  const filterName = catalog.querySelector('.input_filter_name');
  // текущий отбор типа услуги
  const typeItem = catalog.querySelector('#typeItem');
  // табличный слайдер
  const catalogList = catalog.querySelector('#catalog');

  // кнопка добавить услугу
  const btnAddItem = catalog.querySelector('.btn-addItem');
  // карточка услуги: новая, редактирование (модальное окно)
  const card = document.getElementById('modal');
  // заголовок формы ввода карточки
  const headerForm = card.querySelector('.modal__header');
  // форма ввода карточки
  const form = card.querySelector('form');
  // node list элементов input формы
  const inputs = form.querySelectorAll('input');
  // поле ввода типа услуги
  const fieldType = form.querySelector('#type');

  // очистка шапки таблицы от ярлычков сортировки
  const cleaningHeader = () => {
    catalogList.shadowRoot.querySelectorAll('.icon-sort').forEach(icon => {
      icon.classList.remove('asc', 'desc');
    });
  };

  // создание списка услуг в соответсвии с выборанным типом
  const setCurrentData = () => {
    const nameType = typeItem.selectedIndex ?
      typeItem.options[typeItem.selectedIndex].textContent :
      '';

    catalogList.data = nameType ?
      catalog.data.filter(record => record.type === nameType) :
      catalog.data.slice();

    if (catalogList.records.filterApply.length) catalogList.records.filterRefrech();
    cleaningHeader();
  };

  // перечень видов работ
  const orderCatalog = () => {
    const orderCatalog = new Set();
    let htmlTypeItem = `<option value="Все типы услуг">Все типы услуг</option>`;

    catalog.data.forEach(record => orderCatalog.add(record.type));
    [...orderCatalog].sort().forEach((name) => {
      htmlTypeItem += `<option value="${name}">${name}</option>`;
    });

    typeItem.innerHTML = htmlTypeItem;
    typeItem.selectedIndex = 0;
  };

  // очистка данных карточки услуги
  const clearCard = () => {
    inputs.forEach(input => {
      if (!input.readOnly) input.value = '';
      input.classList.remove('error');
    });
  };

  // открытие карточки услуги
  const openCard = (edit = true) => {
    const choiceType = typeItem.options[typeItem.selectedIndex].textContent;
    const allChoice = typeItem.selectedIndex === 0;

    fieldType.readOnly = !allChoice;
    clearCard();

    if (edit) {
      const record = catalogList.records.current().data;
      headerForm.textContent = 'Изменение услуги';
      headerForm.idItem = record.id;
      inputs.forEach(input => {
        input.value = record[input.id];
      });

    } else {
      headerForm.textContent = 'Добавление новой услуги';
      headerForm.idItem = 0;
      fieldType.value = allChoice ? '' : choiceType;
    }

    card.style.display = 'block';
  };

  // обработка запроса на изиенение базы данных
  const submitDatabase = () => {

    // валидация данных до отправки формы
    const validate = () => {
      let success = true;

      inputs.forEach(input => {
        let inputSuccess = true;

        if (!/.+/.test(input.value)) inputSuccess = false;
        if (inputSuccess) input.classList.remove('error');
        else input.classList.add('error');

        if (!inputSuccess) { success = false; }
      });

      return success;
    };

    // изменение текущей записи
    const editRecord = (record) => {
      // изменим в образе данных
      catalog.data[catalog.data.findIndex(elem => elem.id === headerForm.idItem)] = Object.assign({}, record);
      // освежим список типов услуг
      if (!typeItem.selectedIndex) orderCatalog();
      // перезапишем запись в слайдере данных
      catalogList.records.change(record);
      // закроем окошко
      card.style.display = 'none';
    };

    // добавление новой записи
    const addRecord = (record) => {
      // добавим в образ данных
      catalog.data.push(Object.assign({}, record));
      // освежим список типов услуг
      if (!typeItem.selectedIndex) orderCatalog();
      // добавим запись в слайдер данных
      catalogList.records.append(record);
      // очистим карточку
      clearCard();
    };

    if (validate()) {
      const item = {};
      inputs.forEach(input => {
        item[input.id] = input.value;
      });
      item.cost = +item.cost;

      // изменение текущей записи
      if (headerForm.idItem) {
        if (document.taskDemo) {
          item.id = headerForm.idItem;
          editRecord(item);
        } else document.dataСatalogdataСatalog.edit(headerForm.idItem, item).then(record => {
          editRecord(record);
        });
      }
      // добавление новой записи
      else {
        if (document.taskDemo) {
          item.id = 'demo' + document.taskDemo;
          addRecord(item);
          document.taskDemo++;
        } else document.dataСatalog.add(item).then(record => {
          addRecord(record);
        });
      }
    }
  };

  // запрос на удаление записи
  const deleteCard = () => {
    const record = catalogList.records.current();
    const deleteCard = () => {
      const recordType = record.data.type;

      // удалим в образе данных
      catalog.data.splice(catalog.data.findIndex(elem => elem.id === record.data.id), 1);

      // удалим одну запись из группы данных
      if (catalog.data.find(elem => elem.type === recordType)) {
        catalogList.records.delete();
      }

      // удалили последнюю в группе
      else {
        // освежим список типов услуг
        orderCatalog();
        // обновим полный список
        setCurrentData();
      }
    };

    if (document.taskDemo) deleteCard();
    else document.dataСatalog.delete(record.data.id).then(rec => {
      deleteCard();
    });
  };

  // сортировка стобца
  const sortCard = (columnHead, mode) => {
    const icon = columnHead.querySelector('.icon-sort');
    if (!mode) mode = icon.classList.contains('asc') ? 'desc' :
      icon.classList.contains('desc') ? 'none' : 'asc';

    // очистка шапки таблицы от ярлычков сортировки
    cleaningHeader();

    // сортировка и установка ярлычков на шапку сорируемого столбца
    if (mode === 'none') {
      // отменить сортировку
      catalogList.records.sortOff();
    } else if (mode === 'asc') {
      // - по возрастанию
      icon.classList.add('asc');
      catalogList.records.sort('', 1);
    } else {
      // по убыванию
      icon.classList.add('desc');
      catalogList.records.sort('', -1);
    }
  };

  // изменение текущего типа услуги в списке
  typeItem.addEventListener('change', (e) => {
    // создание списка услуг в соответсвии с выборанным типом
    setCurrentData();
  });

  // открытие карточки товара (модальное окно)
  btnAddItem.addEventListener('click', (event) => {
    openCard(false);
  });

  // контроль ввода только допустимых символов
  form.addEventListener('input', (e) => {
    const id = e.target.id;


    if (e.target.matches('input') && id in valid) {
      e.target.value = e.target.value.replace(valid[id], "").slice(0, maxLen[id]);
      e.target.classList.remove('error');
    }
  });

  // дополнительные действия при потере фокуса
  form.addEventListener('focusout', (e) => {
    if (e.target.matches('input')) {
      let value = e.target.value;

      // для всех полей формы:
      // - удаление ведущих и завершающих пробелов и дефисов
      value = value.replace(valid.trimSH, (str, begin, sense) => `${sense}`);
      // - замена нескольких идущих подряд пробелов|дефисов на один пробел|дефис
      value = value.replace(valid.multySH, (str, spaces, hyphens) =>
        (spaces ? ' ' : '') + (hyphens ? '-' : ''));
      e.target.value = value;
    }
  });


  // закрытие карточки товара при нажатии мимо окошка или крестик
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.modal') ||
      e.target.closest('.button__close') ||
      e.target.closest('.cancel-button')) {

      card.style.display = 'none';

      // обработка запроса на изменение базы данных
    } else if (e.target.closest('.button-ui_firm')) submitDatabase();
  });

  // запрос на редактирование / удаление записи / сортировка
  catalogList.shadowRoot.addEventListener('click', (e) => {
    const columnHead = e.target.closest('.column-head');

    if (e.target.closest('.action-change')) {
      openCard();
    } else if (e.target.closest('.action-remove')) {
      deleteCard();
    } else if (columnHead) {
      sortCard(columnHead);
    }
  });

  // поиск (фильтрация) по виду работ
  document.querySelector('.filter_on').addEventListener('click', (e) => {
    if (filterName.value.trim()) {
      filterName.classList.add('filter_run');
      filterName.readOnly = true;
      catalogList.records.filter('tds0', { colId: "name", compare: filterName.value, loose: true });
    }
  });
  // отмена поиска (фильтрация) по виду работ
  document.querySelector('.filter_off').addEventListener('click', (e) => {
    filterName.classList.remove('filter_run');
    filterName.readOnly = false;
    catalogList.records.filterOff();
  });

  // забанили
  form.addEventListener('submit', (e) => { e.preventDefault(); });

  // выход для смены логина
  document.querySelector('.admin-exit button').addEventListener('click', () => {
    const site = window.location;
    delCookie();
    site.replace(site.toString().replace('/table.html', ''));
  });


  // логин админа
  const admin = document.querySelector('.admin-exit');
  admin.prepend(getCookie());

  // первоначальная настройка
  catalogListInit(catalogList);
  document.dataСatalog.use().then(data => {
    // запоминаем данные каталога
    catalog.data = data;
    // создать первоначальный список типов услуг
    orderCatalog();
    // создание списка услуг в соответсвии с выборанным типом
    setCurrentData();

    // признак демо-режима
    if (document.taskDemo) admin.classList.add('demo');
  });

}; // END catalog



