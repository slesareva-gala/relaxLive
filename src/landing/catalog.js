/* Лейдинг. Каталог услуг (Полный список видов ремонтов) */
"use strict";

import { animate } from '../modules/helpers';

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
        id: 'name',
        width: 345,
        widthMin: 343,
        widthMax: 343,
        when: x => (true),
        head: () => `<div class="column-head">Виды работ
          <span class="icon-sort"></span></div>`,
        cell: 'name'
      },
      {
        id: 'units',
        width: 100,
        widthMin: 100,
        widthMax: 100,
        when: x => (true),
        head: () => `<div class="column-head">Еденицы измерения
          <span class="icon-sort"></span></div>`,
        cell: 'units',
        cellSay: x => `<span class="units">${x.units}</span>`,
      },
      {
        id: 'cost',
        width: 100,
        widthMin: 100,
        widthMax: 100,
        when: x => (true),
        head: () => `<div class="column-head">Цена за единицу
          <span class="icon-sort"></span></div>`,
        cell: x => +(x.cost + '').replace(/[^\d]+/g, ''),
        cellSay: x => `<span class="cost">${x.cost} руб</span>`,
      },
      {
        id: 'mini',
        width: 300,
        widthMin: 300,
        widthMax: 300,
        when: x => (true),
        head: ` `,
        cellSay: x => `<div class="mini-cell">
        <div class="mini-title">вид работы:</div>
        <div class="mini-name">${x.name}</div>
        <div  class="mini-block">
          <div class="mini-units">
            <div class="mini-title mini-title-units">единица измерения:</div>
            <div>${x.units}</div>
          </div>
          <div class="mini-cost">
            <div class="mini-title mini-title-cost">цена за единицу:</div>
            <div>${x.cost} руб</div>
          </div>
        </div></div>`,
        hidden: true
      }
    ]
  });
};


// навигация по катологу
export const catalog = () => {
  const catalog = document.querySelector('.popup-repair-types');
  const navCatalog = catalog.querySelector('.nav-list-popup-repair');
  const headTitle = catalog.querySelector('.popup-repair-types-content__head-title');
  const catalogList = catalog.querySelector('#catalog');

  const leftButton = catalog.querySelector('.nav-arrow_left');
  const rightButton = catalog.querySelector('.nav-arrow_right');

  // номер по порядку блока
  const indexBlock = (block) => +block.className.replace(/[^\d]+/g, "") - 1;

  // текущий блок
  let currentBlock = null;

  // изменение ширины окна вывода данных каталога
  const resizeCatalogList = (width) => {
    const bigSize = catalogList.bigSize;

    if (bigSize && width < 500) {
      catalogList.columns.hiddenOff(3);
      catalogList.columns.hidden(0);
      catalogList.columns.hidden(1);
      catalogList.columns.hidden(2);
      catalogList.param.group = {
        headingHeight: 2,
        rowHeight: 60,
      };
      catalogList.bigSize = false;

    } else if (!bigSize && width > 499) {
      catalogList.columns.hiddenOff(0);
      catalogList.columns.hiddenOff(1);
      catalogList.columns.hiddenOff(2);

      catalogList.columns.hidden(3);
      catalogList.param.group = {
        headingHeight: 50,
        rowHeight: 50,
      };
      catalogList.bigSize = true;
    }
  };

  // отображение кнопок навигации блоков в мобильной версии
  const showButton = () => {
    const numBlock = indexBlock(currentBlock);

    leftButton.classList.remove('hide');
    rightButton.classList.remove('hide');
    if (numBlock === 0) leftButton.classList.add('hide');
    if (numBlock === navCatalog.childElementCount - 1) rightButton.classList.add('hide');
  };

  // очистка шапки таблицы от ярлычков сортировки
  const cleaningHeader = () => {
    catalogList.shadowRoot.querySelectorAll('.icon-sort').forEach(icon => {
      icon.classList.remove('asc', 'desc');
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

  // отбор текущих данных
  const setCurrentData = (nameType) => {
    const data = catalog.data.filter(record => record.type === nameType);

    catalogList.data = data;
  };

  // установить текущий блок
  const setCurrentBlock = (block) => {
    if (block === currentBlock) return;

    if (currentBlock) currentBlock.classList.remove('active');

    currentBlock = block;
    currentBlock.classList.add('active');

    headTitle.textContent = currentBlock.textContent.trim();
    // отбор текущих данных
    setCurrentData(currentBlock.textContent.trim());
    // сортировка первого столбца
    sortCard(catalogList.shadowRoot.querySelector('.column-head'), 'asc');
    catalogList.y = 0;

    // дополнительно для мобильной версии
    navCatalog.style.left = -100 * indexBlock(currentBlock) + '%';
    showButton();
  };

  // перечень видов работя
  const orderCatalog = (data) => {
    const orderCatalog = new Set();
    let htmlTypeItem = ``;

    data.forEach(record => orderCatalog.add(record.type));
    [...orderCatalog].sort().forEach((name, index) => {
      htmlTypeItem += `<button class="button_o popup-repair-types-nav__item popup__item_${index + 1} ">${name}
        <svg width="259" height="46" fill="none" viewBox="0 0 259 46" preserveAspectRatio="none">
        <path
        d="M33.5 1h-10c-12.15 0-22 9.85-22 22s9.85 22 22 22h187M48.5 1h187c12.15 0 22 9.85 22 22s-9.85 22-22 22h-17.1"
        stroke="#EEEBE5" stroke-width="2" stroke-linecap="round">
        </path>
        </svg>
      </button>`;
    });
    navCatalog.innerHTML = htmlTypeItem;
    navCatalog.style.width = navCatalog.childElementCount * 100 + '%';
    setCurrentBlock(navCatalog.firstChild);
  };

  // навигация блоков в мобильной версии
  const navBlock = (direction) => {
    const numBlock = indexBlock(currentBlock);
    const preBlock = -100 * numBlock, step = -100 * direction;

    animate({
      duration: 300,
      timingplane: 'easeInOutCubic',
      draw(progress) {
        // скролл блоков
        navCatalog.style.left = preBlock + step * progress + '%';
        if (progress === 1) {
          setCurrentBlock(navCatalog.children[numBlock + direction]);
        }
      }
    });
  };

  // навигация по клику мышки
  catalog.addEventListener('click', (e) => {
    let elem;

    // навигация по блокам
    if ((elem = e.target.closest('.popup-repair-types-nav__item'))) {
      setCurrentBlock(elem);

      // навигация блоков в мобильной версии
    } else if ((elem = e.target.closest('.nav-arrow'))) {
      navBlock(elem.classList.contains('nav-arrow_right') ? 1 : -1);
    }
  });

  // запрос на сортировку
  catalogList.shadowRoot.addEventListener('click', (e) => {
    const columnHead = e.target.closest('.column-head');
    if (columnHead) sortCard(columnHead);
  });

  // первоначальная настройка
  catalogListInit(catalogList);
  catalogList.resize = resizeCatalogList;
  catalogList.lgxy.param.xSide = 'none';
  catalogList.bigSize = true;

  document.dataСatalog.use().then(data => {
    // запоминаем данные каталога
    catalog.data = data;

    // формируем перечень видов работя
    orderCatalog(data);
  });

}; // END catalog()


