/* Админ-панель. Карточка товара */
"use strict";

import { putTogetherListType, putTogetherType } from "./listType";

// очистка шапки таблицы от ярлычков сортировки
export const cleaningHeader = () => {
  // табличный слайдер
  const tds = document.getElementById('tds');

  tds.shadowRoot.querySelectorAll('.-tds-heading-row svg').forEach((svg, index) => {
    svg.classList.remove('nosorting');
    svg.classList.remove('sorting');
    svg.classList.add('nosorting');
  });
};

export const itemCard = () => {
  // модальное окно карточки товара экранированием
  const card = document.getElementById('modal');
  // поле для ввода значения для фильтрации вида работ
  const filterName = document.querySelector('.input_filter_name');
  // кнопка добавить услугу
  const btnAddItem = document.querySelector('.btn-addItem');
  // заголовок формы ввода карточки
  const headerForm = card.querySelector('.modal__header');
  // форма ввода карточки
  const form = card.querySelector('form');
  // node list элементов input формы
  const inputs = form.querySelectorAll('input');
  // поле ввода типа услуги
  const fieldType = form.querySelector('#type');
  // текущий отбор типа услуги
  const typeItem = document.getElementById('typeItem');
  // табличный слайдер
  const tds = document.getElementById('tds');

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
  // наибольшее количество символов в строке
  const maxLen = {
    // именные проверки
    "type": 30,
    "name": 70,
    "units": 20,
    "cost": 9
  };

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

  // очистка данных формы
  const clearForm = () => {
    inputs.forEach(input => {
      if (!input.readOnly) input.value = '';
      input.classList.remove('error');
    });
  };

  // открытие карточки товара
  const openCard = (edit = true) => {
    const choiceType = typeItem.options[typeItem.selectedIndex].textContent;
    const allChoice = typeItem.selectedIndex === 0;

    fieldType.readOnly = !allChoice;
    clearForm();

    if (edit) {
      const record = tds.records.current().data;
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

  // обработка запроса на отправку формы
  const submitForm = () => {

    if (validate()) {
      const item = {};
      inputs.forEach(input => {
        item[input.id] = input.value;
      });
      item.cost = +item.cost;

      if (headerForm.idItem) {
        // изменение текущей записи
        document.dataItems.edit(headerForm.idItem, item).then(record => {
          // освежим список типов услуг
          if (!typeItem.selectedIndex) putTogetherListType();
          // перезапишем запись в слайдере данных
          tds.records.change(record);
          // закроем окошко
          card.style.display = 'none';
        });
      } else {
        // добавление новой записи
        document.dataItems.add(item).then(record => {
          // освежим список типов услуг
          if (!typeItem.selectedIndex) putTogetherListType();
          // добавим запись в слайдер данных
          tds.records.append(record);
          // очистим форму
          clearForm();
        });
      }
    }
  };


  // запрос на удаление записи
  const deleteCard = () => {
    const record = tds.records.current();
    document.dataItems.delete(record.data.id).then(rec => {
      // если удалили последнюю в отборе
      if (typeItem.selectedIndex && tds.data.length === 1) {
        typeItem.selectedIndex = 0;
        // освежим список типов услуг
        putTogetherListType();
        // обновим полный список
        putTogetherType();
      } else {
        // удалим  запись в слайдере данных
        tds.records.delete();
      }
    });
  };


  // сортировка стобца
  const sortCard = (svg) => {
    const mode = svg.classList.contains('nosorting') ? 'sorting' :
      svg.classList.contains('sorting') ? 'none' : 'nosorting';

    // очистка шапки таблицы от ярлычков сортировки
    cleaningHeader();

    // сортировка и установка ярлычков на шапку сорируемого столбца
    if (mode === 'nosorting') {
      // отменить сортировку
      tds.records.sortOff();
    } else if (mode === 'sorting') {
      // - по возрастанию
      svg.classList.remove('nosorting');
      svg.classList.add('sorting');
      tds.records.sort('', 1);
    } else {
      // по убыванию
      svg.classList.remove('nosorting');
      tds.records.sort('', -1);
    }
  };



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

      // запрос на отправку формы
    } else if (e.target.closest('.button-ui_firm')) submitForm();
  });

  // запрос на редактирование / удаление записи / сортировка
  tds.shadowRoot.addEventListener('click', (e) => {
    if (e.target.closest('.action-change')) {
      openCard();
    } else if (e.target.closest('.action-remove')) {
      deleteCard();
    } else if (e.target.closest('.table-th')) {
      sortCard(e.target.querySelector('svg'));
    }
  });

  // поиск (фильтрация) по виду работ
  document.querySelector('.filter_on').addEventListener('click', (e) => {
    if (filterName.value.trim()) {
      filterName.classList.add('filter_run');
      filterName.readOnly = true;
      tds.records.filter('tds0', { colId: "name", compare: filterName.value, loose: true });
    }
  });
  // отмена поиска (фильтрация) по виду работ
  document.querySelector('.filter_off').addEventListener('click', (e) => {
    filterName.classList.remove('filter_run');
    filterName.readOnly = false;
    tds.records.filterOff();
  });


  // забанили
  form.addEventListener('submit', (e) => { e.preventDefault(); });

}; // END itemCard



