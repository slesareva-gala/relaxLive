/* Админ-панель. Настройка таблицы */
"use strict";

export const tableInit = () => {
  const tds = document.getElementById('tds');

  tds.use({
    data: [],
    headingHeight: 50,
    rowHeight: 50,
    gapCol: 0,
    hrefCSS: './styles/tableHidden.css',
    columns: [
      {
        id: 'id',
        width: 110,
        widthMin: 110,
        widthMax: 110,
        when: x => (true),
        head: () => `<div class="table-th th-id">ID<span class="svg_ui">
          <svg class="icon-sort nosorting"><use xlink:href="./img/sprite.svg#sorting"></use>
          </svg></span></div>`,
        cell: 'id',
        cellSay: x => `<span class="id">${x.id}</span>`,
      },
      {
        id: 'type',
        width: 200,
        widthMin: 200,
        widthMax: 200,
        when: x => (true),
        head: () => `<div class="table-th th-type">Тип услуги<span class="svg_ui">
            <svg class= "icon-sort nosorting"> <use xlink:href="./img/sprite.svg#sorting"></use>
            </svg></span></div>`,
        cell: 'type'
      },
      {
        id: 'name',
        width: 300,
        widthMin: 300,
        widthMax: 300,
        when: x => (true),
        head: () => `<div class="table-th th-name">Виды работ<span class="svg_ui">
            <svg class="icon-sort nosorting"><use xlink:href="./img/sprite.svg#sorting"></use>
            </svg></span></div>`,
        cell: 'name'
      },
      {
        id: 'units',
        width: 113,
        widthMin: 113,
        widthMax: 113,
        when: x => (true),
        head: () => `<div class="table-th th-units">Еденицы измерения<span class="svg_ui">
            <svg class="icon-sort nosorting"><use xlink:href="./img/sprite.svg#sorting"></use>
            </svg></span></div>`,
        cell: 'units',
        cellSay: x => `<span class="units">${x.units}</span>`,
      },
      {
        id: 'cost',
        width: 110,
        widthMin: 110,
        widthMax: 110,
        when: x => (true),
        head: () => `<div class="table-th th-cost">Цена за единицу<span class="svg_ui">
            <svg class="icon-sort nosorting"><use xlink:href="./img/sprite.svg#sorting"></use>
            </svg></span></div>`,
        cell: x => +(x.cost + '').replace(/[^\d]+/g, ''),
        cellSay: x => `<span class="cost">${x.cost} руб</span>`,
      },
      {
        width: 138,
        widthMin: 138,
        widthMax: 138,
        when: x => false,
        head: 'Действия',
        cell: 'permissions',
        cellSay: x => `
          <div class="table__actions">
            <button class="button action-change"><span class="svg_ui"><svg class="action-icon_change">
              <use xlink:href="./img/sprite.svg#change"></use>
              </svg></span><span>Изменить</span>
            </button>
            <button class="button action-remove"><span class="svg_ui"><svg class="action-icon_remove">
              <use xlink:href="./img/sprite.svg#remove"></use>
              </svg></span><span>Удалить</span>
            </button>
          </div>`,
      },
    ]
  });
  // добавляем данные
  document.dataItems.use().then(data => {
    tds.data = data;
  });
};
