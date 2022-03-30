/* tds - Cлайдер табличных данных  */
"use strict";

import { myF, paramDeclaration } from "./slt";
import { LGXY } from "./levelgaugexy";

export const tabularDataSlider = () => {

  // КЛАСС атрибута param элемента <tds-box></tds-box>
  class TDSparamDeclaration extends paramDeclaration {
    constructor(tds) {
      // модифицируем свойства класса paramDeclaration
      super({
        lgxy: 'auto', // видимость уровнемеров индексов x и y: lgxy
        gapCol: 2, // отступ между столбцами в px таблицы: 0 - нет, >0 - сетка
        gapRow: 2, // отступ между строками  в px таблицы: 0 - нет, >0 - сетка
        rowHeight: 22, // высота строки:    0-нет строк
        headingHeight: 24, // высота заголовка: 0-нет заголовка
        footingHeight: 0,// высота подвала:   0-нет подвала
        divisionLine: 2, // высота разделительной линии ( заголовка || подвала ) от данных: 0-нет
        go: 's' // направление движения по Enter: 's'-стоп(нет), 'r'-вправо, 'd'-вниз, 'l'-влево,'u'-вверх
      }, tds);
    } // END constructor()

  } // END class TDSparamDeclaration


  // КЛАСС столбцов TDS-элемента
  class TDScolumns {
    constructor(tds) {
      // ccылка на объект класса TDS
      Object.defineProperty(this, `tds`, { value: tds });
      // список столбцов
      Object.defineProperty(this, `list`, { value: [] });
    } // END constructor()

    // добавить (зарегистрировать) столбец
    // param - устанавлемые параметры, по-умл. - параметры по умолчанию
    // set_colNum >=-1 - контроль соответствия table (DOM) и порядка вывода колонок таблицы
    //            null - не проводить контроль
    //            > -1 - установить после добавления текущим столбец по указанному номеру,
    //                   по-умл. - по номеру добавлемого столбца
    //            ==-1 - оставить прежним текущий стоблец
    // ignoreFixedRight - игнорировать при добавлении значение фиксации справа
    //     при наличии фиксации справа:
    //            false (по-умл.) - столбец добавляется до фиксированных справа
    //            true - столбец добавляется в конец, выталкивая первый фиксированный
    //     при отсутствии фиксации справа - столбец добавляется в конец
    add(param = {}, set_colNum = this.list.length, ignoreFixedRight = false) {
      const tds = this.tds;
      const colNum = this.list.length;
      const descript = description(colNum, param);

      // корректировать DOM
      correctDOM(tds, colNum, descript);
      // добавляем описание столбца в список столбцов
      this.list.push(descript);

      // добавляем видимый столбец в список colNum по оси X
      if (!descript.hidden)
        tds.listX.splice(tds.listX.length -
          (ignoreFixedRight ? 0 : tds.fixedRight), 0, colNum);

      // обновление содержимого слайдера
      if (tds.xMax > -1) tds.updateData(undefined, undefined, colNum);

      // контроль соответствия table (DOM) и порядка вывода колонок таблицы
      if (set_colNum !== null) {
        tds.controlCol(true, set_colNum);
        tds.render = 1;  // встроено с add
      }

      // формирование описания столбца
      // пример say*: (dl)=>{return `<span class="type-string">${dl["имяПоля"]}</span>`}
      // пример cell типа 'date': (dl)=>{return new Date( dl["имяПоля"])}
      function description(colNum, param) {
        const descript = {
          id: 'col' + colNum,   // id столбца:'ключ JSON' или строка
          width: 100,         // ширина (количество px)
          widthMin: 20,       // минимальная  ширина (количество px)
          widthMax: null,     // максимальная ширина (количество px)
          head: undefined,    // 'текст' или ()=>{} - данные заголовка столбца или id
          headSay: undefined, // 'текст' или ()=>{} - контекст заголовка столбца или head
          when: (x) => { return false; }, // ()=>{} - предусловие редактирования ячейки данных
          cell: undefined,    // 'ключ JSON' или ()=>{} - данные ячейки или undefined
          cellSay: undefined, // 'ключ JSON' или ()=>{} - контекст вывода ячейки данных или cell
          cellGet: undefined, // 'ключ JSON' или ()=>{} - редактирование ячейки данных или cell
          sortKey: undefined, // 'ключ JSON' или ()=>{} - данные ячейки для сортироваки или cell
          foot: '',           // 'текст' или ()=>{} - данные подвала столбца
          footSay: undefined, // 'текст' или ()=>{} - контекст вывода подвала столбца или foot
          renew: [(x) => (x), 0],  // [ (x)=>(x[id]), 2] - режим обновления после редактирования ячейки данных
          shadow: false,      // false | true столбец в тень
          hidden: false      // false | true скрыть столбец с экрана
        };
        // изменение значений по умолчанию
        Object.assign(descript, param);
        if (!descript.head) descript.head = descript.id;
        if (!descript.headSay) descript.headSay = descript.head;
        if (!descript.cellSay) descript.cellSay = descript.cell;
        if (!descript.cellGet) descript.cellGet = descript.cell;
        if (!descript.sortKey) descript.sortKey = descript.cell;
        if (!descript.footSay) descript.footSay = descript.foot;

        // перемещаем sortKey в список инициализаций индексов
        tds.records.sortSet[descript.id] = descript.sortKey;
        delete descript.sortKey;

        // контроль корректности описания
        if (descript.widthMin < 6) descript.widthMin = 6;
        if (descript.widthMax !== null && descript.widthMax < descript.widthMin)
          descript.widthMax = descript.widthMin;
        if (descript.width < descript.widthMin) descript.width = descript.widthMin;
        if (descript.widthMax !== null && descript.width > descript.widthMax)
          descript.width = descript.widthMax;

        return descript;
      } // END description()

      // корректировать DOM
      function correctDOM(tds, colNum, descript) {

        const col = tds.links.templateCol.cloneNode();
        col.setAttribute('data-col', colNum); // для css и идентификации колонки
        col.id = descript.id;
        col.hidden = true;   // без отображения при добавлении в DOM

        const colH = col.cloneNode();
        colH.innerHTML = typeof (descript.headSay) === 'string' ? descript.headSay : descript.headSay();
        colH.classList.add("-tds-heading-col");

        const colF = col.cloneNode();
        colF.innerHTML = descript.footSay;
        colF.classList.add("-tds-footing-col");

        // рулоны заголовка и подвала Slide
        tds.links.headingSlide.append(colH);
        tds.links.footingSlide.append(colF);
        // уточняем образец строки данных для размножения
        tds.links.templateRow.Slide.append(col.cloneNode());
        // рулон данных Slide
        for (let row = 0; row < tds.rowMax + 1; row++) {
          tds.links.dataSlide.children[row].append(col.cloneNode());
        }
      }
    } // END add()


    // переместить текущий столбец влево
    moveLeft() {
      const tds = this.tds, listX = tds.listX, x = tds.x;

      if (x > (x < tds.xLeft ? 0 : x < tds.xRight ? tds.xLeft : tds.xRight)) {
        [listX[x - 1], listX[x]] = [listX[x], listX[x - 1]];
        tds.controlCol(false);
      }
    } // END moveLeft()


    // переместить текущий столбец вправо
    moveRight() {
      const tds = this.tds, listX = tds.listX, x = tds.x;

      if (x < (x < tds.xLeft ? tds.xLeft - 1 : x < tds.xRight ? tds.xRight - 1 : listX.length - 1)) {
        [listX[x], listX[x + 1]] = [listX[x + 1], listX[x]];
        tds.controlCol(false);
      }
    } // END moveRight()

    // отменить перемещения столбцов
    moveOff() {
      const tds = this.tds, listX = tds.listX;
      let colsLeft = listX.slice(0, tds.xLeft).sort((a, b) => a - b);
      let colsRight = listX.slice(tds.xRight).sort((a, b) => a - b);
      let colsSlide = listX.slice(tds.xLeft, tds.xRight).sort((a, b) => a - b);

      colsLeft.concat(colsSlide, colsRight).forEach((x, i) => listX[i] = x);
      tds.controlCol(false);
    } // END moveOff()

    // зафиксировать текущий столбец слева (снять фиксацию)
    pinnedLeft() {
      const tds = this.tds, listX = tds.listX, x = tds.x, colNum = listX[x];
      let renew;

      // снять фиксацию
      if ((renew = x < tds.xLeft)) {
        let colsSlide = listX.slice(tds.xLeft, tds.xRight); colsSlide.push(colNum);
        colsSlide.sort((a, b) => a - b);
        listX.splice(tds.xLeft - 1 + colsSlide.indexOf(listX[x]), 0, listX.splice(x, 1)[0]);
        tds.fixedLeft--;
        // изменить на фиксацию слева
      } else if ((renew = x >= tds.xRight)) {
        listX.splice(tds.xLeft, 0, listX.splice(x, 1)[0]);
        tds.fixedLeft++; tds.fixedRight--;
        // зафиксировать слева
      } else if ((renew = tds.xRight - tds.xLeft > 1)) {
        listX.splice(tds.xLeft, 0, listX.splice(x, 1)[0]);
        tds.fixedLeft++;
      }
      if (renew) tds.controlCol();
    } // END pinnedLeft()

    // зафиксировать текущий столбец справа (снять фиксацию)
    pinnedRight() {
      const tds = this.tds, listX = tds.listX, x = tds.x, colNum = listX[x];
      let renew;

      // снять фиксацию
      if ((renew = x >= tds.xRight)) {
        let colsSlide = listX.slice(tds.xLeft, tds.xRight); colsSlide.push(colNum);
        colsSlide.sort((a, b) => a - b);
        listX.splice(tds.xLeft + colsSlide.indexOf(listX[x]), 0, listX.splice(x, 1)[0]);
        tds.fixedRight--;
        // изменить на фиксацию справа
      } else if ((renew = x < tds.xLeft)) {
        listX.splice(tds.xRight - 1, 0, listX.splice(x, 1)[0]);
        tds.fixedLeft--; tds.fixedRight++;
        // зафиксировать справа
      } else if ((renew = tds.xRight - tds.xLeft > 1)) {
        listX.splice(tds.xRight - 1, 0, listX.splice(x, 1)[0]);
        tds.fixedRight++;
      }
      if (renew) tds.controlCol();
    } // END pinnedRight()

    // фиксировать столбцы слева от текущего || снять фиксацию столбцов слева при x = 0
    fixedLeft() {
      const tds = this.tds, x = tds.x, listX = tds.listX;

      // снятие фиксации для ячеек от новой позиции до текущей
      if (x < tds.xLeft) {
        let colsSlide = listX.slice(x, tds.xRight).sort((a, b) => a - b);
        listX.splice(x, tds.xLeft - x).sort((a, b) => a - b).forEach(colNum => {
          listX.splice(x + colsSlide.indexOf(colNum), 0, colNum);
        });
      } else if (x >= tds.xRight) tds.fixedRight -= x - tds.xRight;
      // установить новую фиксацию слева
      if (tds.fixedLeft !== x) {
        tds.fixedLeft = x;
        tds.controlCol();
      }
    } // END fixedLeft()


    // фиксировать столбцы справа от текущего || снять фиксацию столбцов справа при x = 0
    fixedRight() {
      const tds = this.tds, listX = tds.listX, fixedRight = tds.xMax - tds.x,
        x = fixedRight ? tds.x : listX.length - 1;

      // снятие фиксации для ячеек от текущей до новой позиции
      if (x >= tds.xRight) {
        let colsSlide = listX.slice(tds.xLeft, x + 1).sort((a, b) => a - b);
        listX.splice(tds.xRight, x - tds.xRight + 1).sort((a, b) => a - b).forEach(colNum => {
          listX.splice(tds.xLeft + colsSlide.indexOf(colNum), 0, colNum);
        });
      } else if (x < tds.xLeft) tds.fixedLeft = x;
      if (tds.fixedRight !== fixedRight) {
        tds.fixedRight = fixedRight;
        tds.controlCol();
      }
    } // END fixedRight()

    // столбец в тень (из тени)
    shadow() {
      const columns = this.list, tds = this.tds, colNum = tds.listX[tds.x];

      // переключение признака тени
      columns[colNum].shadow = !columns[colNum].shadow;
      tds.controlCol();
    } // END shadow()

    // скрыть столбец
    hidden() {
      const tds = this.tds, listX = tds.listX, x = tds.x, colNum = listX[x],
        xRight = tds.xRight, xLeft = tds.xLeft;

      if (x >= xRight || x < xLeft || xRight - xLeft > 1) {
        listX.splice(x, 1);
        let renew;
        if ((renew = x >= xRight)) tds.fixedRight--;
        else if ((renew = x < xLeft)) tds.fixedLeft--;
        else if ((renew = xRight - xLeft > 1));
        if (renew) tds.controlCol();
      }
    } // END hidden()

    // восстановление скрытого столбца
    hiddenOff(colNum) {
      const columns = this.list, tds = this.tds, listX = tds.listX, x = listX.indexOf(colNum);

      if (colNum > -1 && colNum < columns.length && !~x) {
        let colsSlide = listX.slice(tds.xLeft, tds.xRight); colsSlide.push(colNum);
        colsSlide.sort((a, b) => a - b);
        listX.splice(tds.xLeft + colsSlide.indexOf(colNum), 0, colNum);
        tds.controlCol(true, colNum);
      }
    } // END hiddenOff()

  } // END class TDScolumns

  // КЛАСС записей TDS-элемента
  class TDSrecords {
    constructor(tds) {
      // ccылка на объект класса TDS
      Object.defineProperty(this, `tds`, { value: tds });
      // список зарегистрированных инициализаций индексов sortSet['имяТега'] = key
      Object.defineProperty(this, `sortSet`, { value: {} });
      // список установленных индексов [ { id, mode }...]
      Object.defineProperty(this, `sortApply`, { value: [] });

      // содержимое ячейки для фильтрации
      const valueCell = (cell, recData) => {
        switch (typeof (cell)) {
          case 'string':
            return recData[cell] + '';
          case 'function':
            return cell(recData) + '';
          default:
            return '';
        }
      };
      // список зарегистрированных методов фильтрации
      Object.defineProperty(this, `filterSet`, {
        value: {
          tds0: (p, rD) => {  // - вхождение
            let v = valueCell(p.cell, rD), pc = p.compare;
            if (p.loose) {
              v = v.trim().toLowerCase();
              pc = pc.trim().toLowerCase();
            }
            return v.includes(pc);
          },
          tds1: (p, rD) => {  // - равенство
            let v = valueCell(p.cell, rD), pc = p.compare;
            if (p.loose) {
              v = v.trim().toLowerCase();
              pc = pc.trim().toLowerCase();
            }
            return v === pc;
          },
          tds2: (p, rD) => {  // - больше
            let v = valueCell(p.cell, rD), pc = p.compare;
            if (p.loose) {
              v = v.trim().toLowerCase();
              pc = pc.trim().toLowerCase();
            }
            return (!isNaN(+v) && !isNaN(+pc) ? +v > +pc : v > pc);
          },
          tds3: (p, rD) => {  // - меньше
            let v = valueCell(p.cell, rD), pc = p.compare;
            if (p.loose) {
              v = v.trim().toLowerCase();
              pc = pc.trim().toLowerCase();
            }
            return (!isNaN(+v) && !isNaN(+pc) ? +v < +pc : v < pc);
          },
          tds4: (p, rD) => {  // - больше или равно
            let v = valueCell(p.cell, rD), pc = p.compare;
            if (p.loose) {
              v = v.trim().toLowerCase();
              pc = pc.trim().toLowerCase();
            }
            return ((!isNaN(+v) && !isNaN(+pc) ? +v > +pc : v > pc) || (v === pc));
          },
          tds5: (p, rD) => {  // меньше или равно
            let v = valueCell(p.cell, rD), pc = p.compare;
            if (p.loose) {
              v = v.trim().toLowerCase();
              pc = pc.trim().toLowerCase();
            }
            return ((!isNaN(+v) && !isNaN(+pc) ? +v < +pc : v < pc) || (v === pc));
          },
          tds6: (p, rD) => {  // не равно
            let v = valueCell(p.cell, rD), pc = p.compare;
            if (p.loose) {
              v = v.trim().toLowerCase();
              pc = pc.trim().toLowerCase();
            }
            return v !== pc;
          },
          tds7: (p, rD) => {  // начинается с образца
            let v = valueCell(p.cell, rD), pc = p.compare;
            if (p.loose) {
              v = v.trim().toLowerCase();
              pc = pc.trim().toLowerCase();
            }
            v = v.slice(0, pc.length);
            return v === pc;
          },
          tds8: (p, rD) => {  // не содержит
            let v = valueCell(p.cell, rD), pc = p.compare;
            if (p.loose) {
              v = v.trim().toLowerCase();
              pc = pc.trim().toLowerCase();
            }
            return !v.includes(pc);
          },
        }
      });   // END filterSet

      // список установленных методов фильтрации
      Object.defineProperty(this, `filterApply`, { value: [] });

    } // END constructor()

    // сортировка
    /* добавить тег сортировки:
       records.sortSet['имяТега']= key, где key = 'ключJSONdata' || (recData)=>{}
       сортировка возможно только по строковому или числовому значению
    */
    /*
      [ tag: "тегСортировки", ]  // по умолчанию, id текущего столбца
      [ mode: режим сортировки]  // -1-по убыванию, 0-естественный порядок, 1-по возрастанию (по умолчанию)
      [ add:]  - true  -  добавить к sortApply,
                 false -  образ для формирования sortApply
    */
    sort(tag, mode = 1, add = false) {
      const tds = this.tds;

      // параметры и порядок сортировки:
      if (!tag) tag = tds.columns.list[tds.listX[tds.x]].id;

      // добавляем сортировку новому ключу
      this.sortMulty([{ tag, mode }], add);
    } // END sort()

    // сортировака по нескольким зарегистрированным ключам одновременно
    /*
      list: [{ tag: "имяТега"[, mode] } }, mode = 1, по умолчанию
      [ add:]  - true  -  list добавить к sortApply,
                 false -  list образ для формирования sortApply
    */
    sortMulty(list = [], add = false) {
      const sortSet = this.sortSet, sortApply = this.sortApply,
        isApply = sortApply.length;

      // формирование списка сортировок
      if (!add) sortApply.length = 0;
      list.forEach(x => {
        if (x.tag in sortSet) {
          let mode = ('mode' in x) ? x.mode : 1;
          let find = sortApply.findIndex(f => f.tag === x.tag);
          if (find > -1) {
            if (mode) sortApply[find].mode = mode;  // изменяем режим сортировки
            else sortApply.splice(find, 1);  // убираем из списка сортировок
          } else if (mode) sortApply.push({ tag: x.tag, mode });
        } else console.error(`TDS.records: sortMulty() tag "${x.tag}" не зарегестрирован в sortSet`);
      });

      // освежить сортрировку
      if (sortApply.length) this.sortRefrech();
      // отменить сортировку
      else if (isApply) this.sortOff();

    } // END sortMulty()

    // освежить сортировку
    sortRefrech() {
      const tds = this.tds, listY = tds.listY,
        sortApply = this.sortApply, sortSet = this.sortSet;

      // при отсутствии подключенных сортировок и данных не сортируем
      if (!sortApply.length || !listY.length) return;

      // номер текущей записи в data
      let recCur = listY[tds.y];

      // значение ключа для сортировки
      let valueKey = (key, recData) => {
        switch (typeof (key)) {
          case 'string':
            return recData[key] + '';
          case 'function':
            return key(recData) + '';
          default:
            return '';
        }
      };

      const data = tds.data;
      // заголовок таблицы ключей сортировки
      let keyData = sortApply.map((x) => {
        let key = sortSet[x.tag];
        let v = valueKey(key, data[recCur]);
        return {
          values: [],
          mode: x.mode,
          key,
          type: isNaN(+v) ? 'string' : 'number',
        };
      });
      // дополнительно, результаты сортировки:
      let keyInfo = keyData.length; // индекс результатов в таблице ключей
      keyData.push([]);   // для пар: индекс сортировки и индекс в data

      // формирование таблицы ключей сортировки согласно текущему спискy listY
      listY.forEach((recno, i) => {
        keyData[keyInfo].push([i, recno]);
        // для каждой записи формируем значения ключей для всех списков ключей,
        // не включая таблицу результатов
        let recData = data[recno];
        keyData.forEach((init, k) => {
          if (k < keyInfo) {
            let v = valueKey(init.key, recData);
            keyData[k].values.push(
              (init.type === 'string') ? v.toUpperCase() : +v);
          }
        });
      });

      // сортировка ключей
      let compare = (i, j) => {
        let run = (a, b, mode) => (a < b ? -mode : a > b ? mode : 0);

        let comp;
        for (let k = 0; k < keyInfo; k++) {
          comp = run(keyData[k].values[i[0]], keyData[k].values[j[0]], keyData[k].mode);
          if (comp) break;
        }
        return comp;
      };
      keyData[keyInfo].sort(compare);

      // приведение порядка записей в соответствие результату сортировки ключей
      listY.length = 0;
      keyData[keyInfo].forEach(x => listY.push(x[1]));

      tds.updateData();
      tds.y = listY.indexOf(recCur);

    } // END sortRefrech()

    // отменить сортировку
    sortOff() {
      const tds = this.tds, listY = tds.listY, sortApply = this.sortApply;
      // номер текущей записи в data
      let recCur = listY[tds.y];

      listY.sort((a, b) => a - b);
      sortApply.length = 0;

      tds.updateData();
      tds.y = listY.indexOf(recCur);

    } // END sortOff()


    // фильтрация
    /* добавить тег фильтрации:
       records.filterSet['имяТега']= ( param, recData )=>{..return .. }, где
         param - параметры, используемы в блоке проверки
         recData - текущая строка данных
         блок проверки должен возвращать логическое значение:
           true - запись отобрана или false - запись пропустить
    */
    /* tag: 'имяТега'
       теги предустановленные с tag == 'tds*',
         где *:
           0-вхождение, 1=,2>,3<,4>=, 5<=,6!=,7-начинается с образца, 8-не содержит
         param: { colId:   "идСтолбца", по умолчанию - id текущего столбца
                  compare: "образецДляФильтрации", по умолчанию ""
                  loose: true(не строгое) || false(строго) , по умолчанию true
                  cell: переностися из настроек столбцов для colId
                }
       add - true  -  list добавить к filterApply,
             false - list образ для формирования filterApply
       возвращает: количество оторбранных записей или -1 - отбор не производился
    */
    filter(tag = "tds0", param = {}, add = false) {

      // добавляем фильтрация по новому ключу
      return this.filterMulty([{ tag, param }], add);
    } // END filter()

    // фильтрация по нескольким зарегистрированным ключам одновременно
    /*
       list: [{ tag: "имяТега", param } }
       add - true  -  list добавить к filterApply,
             false - list образ для формирования filterApply
       возвращает: количество оторбранных записей
    */
    filterMulty(list = [], add = false) {
      const tds = this.tds, columns = tds.columns.list,
        filterSet = this.filterSet, filterApply = this.filterApply;

      // формирование списка фильтров
      let countApp = 0;  // количество добавленных правил отбора
      if (!add) filterApply.length = 0;
      list.forEach(x => {
        if (x.tag in filterSet) {
          // контроль обязательных параметров для предустановленных методов отбора
          if (x.tag.slice(0, 3) === "tds") {
            let colNum = tds.listX[tds.x];
            if ('colId' in x.param) colNum = columns.findIndex(col => col.id === x.param.colId);
            else x.param.colId = columns[colNum].id;
            if (colNum < 0) console.error(`TDS.records: filterMulty() столбец с colId "${x.param.colId}"` +
              ` не зарегестрирован в TDS.columns`);
            else {
              x.param.cell = columns[colNum].cell;
              if (!('loose' in x.param)) x.param.loose = true;
              if (!('compare' in x.param)) x.param.compare = '';
              x.param.compare += '';
              filterApply.push(x); countApp++;
            }
          } else { filterApply.push(x); countApp++; }
        } else console.error(`TDS.records: filterMulty() tag "${x.tag}" не зарегестрирован в filterSet`);
      });

      if (!(add ? tds.listY.length : tds.data.length)) return -1;

      // применить фильтрацию
      if (add) { return countApp ? this.filterRefrech(countApp) : -1; }
      else { return countApp ? this.filterRefrech() : (this.filterOff() || -1); }

    } // END filterMulty()

    // освежить / установить фильтрацию
    /*
       параметр onlyLast: только количество последних в filterApply[], 0 - все
       возвращает: количество оторбранных записей
    */
    filterRefrech(onlyLast = 0) {
      const tds = this.tds, data = tds.data, listY = tds.listY,
        filterSet = this.filterSet, filterApply = this.filterApply;

      // номер текущей записи в data
      let recCur = listY[tds.y];

      // формирование списка отфильтрованных строк
      const fltrData = [];

      // дополнительная фильтрация по последним onlyLast правилам в filterApply
      if (onlyLast) {
        let onlyApply = filterApply.slice(-onlyLast);
        listY.forEach((rec) => {
          if (!onlyApply.find((init) => {
            let selection = filterSet[init.tag], param = init.param;
            return !selection(param, data[rec]);
          })) fltrData.push(rec);
        });

        // полная переустановка фильтров
      } else {
        data.forEach((recData, rec) => {
          if (!filterApply.find((init) => {
            let selection = filterSet[init.tag], param = init.param;
            return !selection(param, recData);
          })) fltrData.push(rec);
        });
      }

      // применить правила фильтрации
      // сохраняем номера отфильтрованных строк в список записей слайдера
      listY.length = 0;
      fltrData.forEach(rec => listY.push(rec));

      // уточняем уровнемеры слайдера
      tds.lgxy.param.group = {
        yQty: listY.length,
        y: Math.max(listY.indexOf(recCur), 0)
      };
      tds.updateData();
      return listY.length;

    } // END filterRefrech()


    // отменить фильтрацию
    filterOff() {
      const tds = this.tds, data = tds.data, listY = tds.listY,
        recCur = listY[tds.y], filterApply = this.filterApply;

      listY.length = 0;
      data.forEach((s, i) => listY.push(i));
      filterApply.length = 0;

      tds.lgxy.param.group = {
        yQty: listY.length,
        y: Math.max(listY.indexOf(recCur), 0)
      };
      // oсвежить сортировку
      this.sortRefrech();
    }

    // - методы работы с записями

    // информация о текущей записи
    current() {
      const recno = this.tds.listY[this.tds.y];
      return {
        recno: recno,
        data: this.tds.data[recno]
      };
    }

    // добавить новую запись
    append(record) {
      const tds = this.tds, data = tds.data, listY = tds.listY;

      data.push(record);
      listY.push(data.length - 1);

      // уточняем уровнемеры слайдера
      tds.lgxy.param.group = {
        yQty: listY.length,
        y: Math.max(listY.length - 1, 0)
      };
      // oсвежить сортировку
      this.sortRefrech();
    }

    // заменить данные текущей строки
    change(rerecord) {
      const recno = this.tds.listY[this.tds.y], record = this.tds.data[recno];
      for (let key in record) {
        if (key in rerecord) {
          this.tds.data[recno][key] = rerecord[key];
        }
      }
      // обновить строку
      this.tds.updateData(this.tds.row, this.tds.row);
      // oсвежить сортировку
      this.sortRefrech();
    }
    // удаление текущей записи
    delete() {
      const tds = this.tds, data = tds.data, listY = tds.listY;
      const recno = listY[tds.y];

      data.splice(recno, 1);  // удаляем запись
      listY.splice(tds.y, 1);  // убираем recno из реестра записей
      listY.forEach((rec, index) => {
        if (rec > recno) listY[index] = rec - 1;
      });

      // уточняем уровнемеры слайдера
      tds.lgxy.param.group = {
        yQty: listY.length,
        y: tds.y
      };

    } // END record()

  } // END class records


  // КЛАСС элемента <tds-box></tds-box>
  class TDS extends HTMLElement {

    // при создание нового, клонировании importNode() и переносе adoptNode():
    // обратный вызов: constructor>connectedCallback
    constructor() {
      // подключаем свойства super-класса (всегда первый в конструкторе)
      super();

      const tds = this;

      // этап встраивания:
      // -1 - не встроено; 0 - встроено без use||add; 1 - подключено use || add
      Object.defineProperty(tds, `render`, { writable: true, value: -1 });

      // уровнемеры индексов x (колонок) и y (записей)
      const lgxy = new LGXY();

      // ТАБЛИЦА ( контейнер для заголовка, слайдера строк и подвала)
      const table = document.createElement('div');
      table.setAttribute('class', '-tds-table');

      // формируем элементы слайдера табличных данных
      let dStyle = document.createElement('style');
      let tdsList = [dStyle, // основной стиль
        dStyle.cloneNode(), // стили колонок
        dStyle.cloneNode(), // стиль вертикального скроллинга
        dStyle.cloneNode(), // стиль горизонатльного скроллинга
        dStyle.cloneNode(), // пользовательские стили
        lgxy];
      // ссылка на объект управления
      Object.defineProperty(tds, `lgxy`, { value: lgxy });

      // ссылки на основные части таблицы
      // table, client,
      // headingLeft, headingSlide, headingRight,
      // dataLeft,    dataSlide,    dataRight,
      // footingLeft, footingSlide, footingRight,
      // templateCol, templateRow,  currentCell, currentLine
      Object.defineProperty(tds, `links`, { value: { table: table } });

      ['heading', 'data', 'footing'].forEach(elName => {
        let el = document.createElement('div');
        el.setAttribute('class', '-tds-' + elName);

        // блоки элемента: левый зафиксированный, слайдовый, правый зафиксированный
        let bl = new Array(3);
        ['left', 'slide', 'right'].forEach((blName, i) => {
          let rl;  // ссылка на рулон
          bl[i] = document.createElement('div');
          bl[i].setAttribute('class', '-tds-' + blName);
          if (elName === 'data') {
            rl = document.createElement('div');
            rl.classList.add("-tds-roll");
            bl[i].append(rl);
          } else if (elName === 'heading') {
            rl = document.createElement('div');
            rl.classList.add("-tds-roll", "-tds-heading-row");
            bl[i].append(rl);
          } else if (elName === 'footing') {
            rl = document.createElement('div');
            rl.classList.add("-tds-roll", "-tds-footing-row");
            bl[i].append(rl);
          } else rl = bl[i];

          tds.links[elName + myF.up0(blName)] = rl;
        });
        el.append(...bl);
        table.append(el);
      });
      lgxy.append(table);

      tds.attachShadow({ mode: 'open' }).append(...tdsList);

      // клиентский блок (окно скроллинга данных)
      const client = tds.links.dataSlide.parentElement;
      client.tdsWidth = 0;
      client.tdsHeight = 0;
      tds.links.client = client;

      // изменение размера клиентского блока:
      tds.resizeObserver = new window.ResizeObserver(entries => {
        let dWidth = 0, dHeight = 0;
        entries.forEach((entry, index) => {
          let width, height;
          if (entry.borderBoxSize1) {
            width = Math.round(entry.borderBoxSize[0].inlineSize);
            height = Math.round(entry.borderBoxSize[0].blockSize);
          } else {
            width = Math.round(entry.contentRect.width);
            height = Math.round(entry.contentRect.height);
          }
          // сохраняем текущие размеры объектов для расчетов
          dWidth = width - (client.tdsWidth || 0);
          dHeight = height - (client.tdsHeight || 0);
          client.tdsWidth = width;
          client.tdsHeight = height;

          // контроль содержимого слайдера
          if (tds.render > 0) {  // встроено с use || add
            if (dWidth) tds.controlCol(false, -1, dWidth);
            if (dHeight) tds.controlRow(true, dHeight);
          }
        });
      });
      tds.resizeObserver.observe(client);

      // параментры: изменение атрибута html-элемента из JS
      Object.defineProperty(tds, `param`,
        { value: Object.create(new TDSparamDeclaration(tds)) });

      // шаблоны основых блоков
      // - образец строки данных для размножения
      let tmplRow = document.createElement('div');
      tmplRow.classList.add("-tds-row");
      tds.links.templateRow = {
        Slide: tmplRow,
        Left: tmplRow.cloneNode(false),
        Right: tmplRow.cloneNode(false)
      };
      // - образец колонки таблицы
      let tpmlCol = document.createElement('div');
      tpmlCol.classList.add("-tds-cell");
      tds.links.templateCol = tpmlCol;

    } // END constructor()

    // при встраивании в DOM новой или клонированной таблицы
    connectedCallback() {
      const tds = this;

      if (tds.render < 0) {  // не встрено
        // для перехода на слайдер по tab (получение фокуса)
        tds.tabIndex = "0";

        // согласовываем формат записи атрибутов (для CSS)
        tds.param.set();
        if (['hidden', 'auto'].includes(tds.param.lgxy))
          tds.lgxy.param.group = { xHide: true, yHide: true };

        // данные для инициализации колонок таблицы (0-length)
        Object.defineProperty(tds, `columns`, { value: new TDScolumns(tds) });
        // данные для инициализации записей таблицы (0-length)
        Object.defineProperty(tds, `records`, { value: new TDSrecords(tds) });
        // список colNum по оси X, организующий порядок вывода колонок таблицы
        Object.defineProperty(tds, `listX`, { value: [] });
        // список recNum по оси Y, организующий порядок вывода записей таблицы
        Object.defineProperty(tds, `listY`, { value: [] });
        // количество зафиксированных столбцов
        Object.defineProperty(tds, `fixedLeft`, { // - слева:  0 - нет
          writable: true, value: 0
        });
        Object.defineProperty(tds, `fixedRight`, { // - справа: 0 - нет
          writable: true, value: 0
        });

        // параметры рулонов данных таблицы ( для dataLeft,dataSlide,dataRight)
        const gCS = getComputedStyle(tds), re = /"+/g;
        const gCSv = (mask) => { return gCS.getPropertyValue(mask).replace(re, ''); };
        Object.defineProperty(tds, `paramRoll`, {
          value: {
            rows: 0, hideRow: 0, row: 0, left: 0, top: 0,
            cssCursor: gCSv('--tds-cursor-focusout'),
            cssActive: gCSv('--tds-cursor-focusin'),
            cssLine: gCSv('--tds-cursor-line'),
            cssShadow: gCSv('--tds-col-shadow'),
            cssHeading: gCSv('--tds-cell-heading'),
            cssData: gCSv('--tds-cell-data'),
            cssFooting: gCSv('--tds-cell-footing')
          }
        });

        // установка основных стилей
        tds.updateStyle('init');

        // регистрирация обработчиков события на створке
        tds.event();

        tds.render = 0;  // встрено без use || add
      }
    } // END connectedCallback()

    // удаление таблицы из DOM
    disconnectedCallback() {
      // прекратить слежение за client
      this.resizeObserver.disconnect();
      // удаление обработчиков событий
      this.event(false);
    }

    // при перемещении межуду <iframe>-элементами страницы adoptNode():
    // обратный вызов:
    // disconnectedCallback(с ownerDocument-набором из исходного документа)
    // > adoptedCallback(с ownerDocument-набором из нового документа)
    // > connectedCallback.
    adoptedCallback() { }

    // наблюдаемые атрибуты для  attributeChangedCallback()
    static get observedAttributes() {
      return ['param'];
    }

    // при изменении значений атрибутов из observedAttributes()
    attributeChangedCallback(name, old, renew) {

      const tds = this;

      // контроль значений параметров
      // - ask - передается в символьном виде - должно быть приведено к нужному типу
      // - ask = null;  // аннулировать запрос на изменение значения
      let valid = (key, ask, cur, def) => {
        if (typeof (ask) === 'number') {
          ask = Math.max(myF.int(ask),
            ((key.includes('gap') || key.includes('Height')) ? 0 : def));
        } else {
          if ((key === 'lgxy' && !['auto', 'visible', 'hidden'].includes(ask)) ||
            (key === 'go' && !['s', 'r', 'd', 'l', 'u'].includes(ask))) {
            ask = cur;
          }
        }
        return ask;
      };

      // контроль зависимых значений параметров (null - аннулировать запрос на изменение значения)
      let validAll = (ask, cur) => { };

      // разбор/анализ/применение изменений параметров атрибута
      let attrRenew = tds.param.changedCallback(renew, valid, validAll);
      let qtyRenew = Object.keys(attrRenew).length;

      if (!qtyRenew || tds.render < 1 || !tds.columns.list.length) return;

      // тип обновления tds
      let stInit, stCol, stRow, reRow;
      // установка видимости полос навигации
      if ('lgxy' in attrRenew) {
        if (attrRenew.lgxy.new === 'auto') stCol = stRow = true;
        else {
          let is = attrRenew.lgxy.new === 'hidden';
          tds.lgxy.param.group = { xHide: is, yHide: is };
        }
      }
      if ('gapCol' in attrRenew) stInit = stCol = true;
      if ('gapRow' in attrRenew || 'rowHeight' in attrRenew) stInit = reRow = true;
      if ('headingHeight' in attrRenew || 'footingHeight' in attrRenew ||
        'divisionLine' in attrRenew) stInit = true;

      // обновления:
      if (stInit) tds.updateStyle('init');
      if (stCol) tds.controlCol(false);
      if (reRow) tds.controlRow(true);
      else if (stRow) tds.controlRow(false);

      // отправка события таблицы 'tds'
      tds.dispatchEvent(new CustomEvent("tds", {
        detail: attrRenew,
        bubbles: false,    // не всплывает
        cancelable: false  // запрещен preventDefault()
      }));

    } // END attributeChangedCallback()

    // установка по номеру текущей строки слайдера (нумерация с 0),
    // для отображения this.cursor()
    set row(value) {
      this.paramRoll.row = (value < 0 || this.rowMax < 0) ? 0 :
        (value > this.rowMax) ? this.rowMax : value;
    }
    get row() { return this.paramRoll.row; }
    // наимбольший номер строки слайдера
    // зависит от высоты окна client и высот элементов таблицы
    // авторасчет this.control() при изменении размеров client,
    // высота строки this.param.rowHeight, межстрочного отступа this.param.gapRow,
    // и количества записей данных this.data.length
    get rowMax() { return this.paramRoll.rows - 1; }

    // управление перемещением курсора установкой номеров текущей колонки и записи
    // - номер текущей и максимальной колонки (нумерация с 0)
    // - номер первой и последней+1 незафиксированных колонок
    set x(value) { this.lgxy.param.x = value; }
    get x() { return this.lgxy.param.x; }
    set xMax(value) { this.lgxy.param.xQty = value + 1; }
    get xMax() { return this.lgxy.param.xQty - 1; }
    get xLeft() { return this.fixedLeft; }
    get xRight() { return this.listX.length - this.fixedRight; }

    // - номер текущей и максимальной записи (нумерация с 0)
    set y(value) { this.lgxy.param.y = value; }
    get y() { return this.lgxy.param.y; }
    set yMax(value) { this.lgxy.param.yQty = value + 1; }
    get yMax() { return this.lgxy.param.yQty - 1; }
    // - первая и последняя запись в слайде
    get yBeginSlide() { return this.y - this.row; }
    get yEndSlide() { return this.yBeginSlide + this.rowMax; }

    // подключение данных
    set data(value) {
      const tds = this;
      tds._data = value;

      const listY = tds.listY;
      listY.length = 0;  // очищаем список вывода записей
      // формируем новый список вывода записей
      value.forEach((x, i) => { listY.push(i); });

      // изменение источниа данных без перестройки структуры
      if (tds.render > 0) {
        // устанавливаем количество записей и указатель на первую запись
        tds.lgxy.param.group = { yQty: value.length, y: 0 };
      }
    }
    get data() { return this._data; }

    // подключение инструкций по инициализации содержимого tds
    // визуализация таблицы по начальным значениям атрибутов и стилей
    use(initData) {

      // инициализация по свойствам объекта-настройки
      if (typeof (initData) !== 'object') return;
      const tds = this;

      //  if ( tds.render > 0) {  // встроено с use - СМЕНА use
      tds.render = 0;  // встроено без use || add

      // ссылка на данные
      tds.data = initData.data;

      // пользовательские стили
      if ('hrefCSS' in initData) {
        fetch(initData.hrefCSS).then(rec => rec.text())
          .then(txt => tds.shadowRoot.childNodes[4].textContent = txt);
      }

      // начальная фиксация колонок из настроек
      tds.fixedLeft = ('fixedLeft' in initData) ? initData.fixedLeft : 0;
      tds.fixedRight = ('fixedRight' in initData) ? initData.fixedRight : 0;

      // общие настройки
      for (let key in tds.param.default) {
        if (key in initData) {
          tds.param[key] = initData[key];
        }
      }

      // формирование настроек колонок:
      // - согласно описаний в объекте инициализации .colunms:
      if ('columns' in initData && initData.columns.length > 0) {
        if (!('data' in initData)) initData.data = [];
        // формирование настроек колонок
        for (let i = 0; i < initData.columns.length; i++) {
          tds.columns.add(initData.columns[i], null, true);
        }

        // - согласно структуры первой строки json-данных описаний
        // в объекте инициализации .data:
      } else if ('data' in initData && Array.isArray(initData.data) && initData.data.length) {
        const firstLineData = initData.data[0];
        let i = 0;

        for (let elem in firstLineData) {
          const field = elem, value = firstLineData[field];
          tds.columns.add(
            {
              id: field, head: field, cell: field,
              cellSay: dl => `<span class="-tds-type-${typeof value}">${dl[field]}</span>`,
              width: 100
            }, null, true);
          i++;
        }

      } else return;

      // установка основных стилей
      tds.updateStyle('init');
      // контроль соответствия table (DOM) и порядка вывода колонок таблицы
      tds.controlCol(true, 0);

      // устанавливаем количество записей и указатель на первую запись
      tds.lgxy.param.group = { yQty: initData.data.length, y: 0 };

      tds.render = 1;  // встроено с use

    } // END use()


    // обновление содержимого слайдера
    updateData(startRow = 0, stopRow = this.rowMax, only_colNum = -1) {
      if (stopRow < startRow) return;
      const tds = this;

      // содержимое ячейки слайдера
      let dataCell = (rec, cellSay) => {
        let recData = tds.data[tds.listY[rec]];
        switch (typeof (cellSay)) {
          case 'string':
            return recData[cellSay];
          case 'function':
            return cellSay(recData);
          default:
            return '';
        }
      };

      // содержимое ячеек строки слайдера
      let updateRow = (row, only_colNum) => {
        let rec = tds.yBeginSlide + row;
        // ссылки на ячейки (столбцы):
        let cells = [].concat(
          Array.from(tds.links.dataLeft.children[row].children),
          Array.from(tds.links.dataSlide.children[row].children),
          Array.from(tds.links.dataRight.children[row].children)
        );
        // массив значений
        let values = [];
        for (let i = 0; i < cells.length; i++) {
          let cell = cells[i];
          let colNum = +cell.dataset.col;
          if (only_colNum < 0 || only_colNum === colNum) {
            let cellSay = tds.columns.list[colNum].cellSay;
            values.push({ cell, content: dataCell(rec, cellSay) });
          }
          if (only_colNum === colNum) break;
        }
        return values;
      };

      // массив новых значений ячеек строк слайдера
      let values = [];
      for (let row = startRow; row < stopRow + 1; row++) {
        values.push(updateRow(row, only_colNum));
      }

      // запись новых значений в ячейки строк
      values.forEach(row => row.forEach(col => col.cell.innerHTML = col.content));

    } // END updateData()


    // контроль соответствия table.data* (DOM) и количества строк слайдера
    controlRow(cohere = true, dHeight = 0) {
      const tds = this;

      if (!tds.columns.list.length) return;

      // текущее количество строк в рулонах data
      let curQtyRows = tds.paramRoll.rows;

      // согласоваться с DOM
      if (cohere) cohereWithDom();

      // курсор отображать при появлении первой сторки
      if (cohere && (dHeight > 0 && !curQtyRows || !dHeight)) tds.cursor();
      else tds.updateStyle('scroll-row'); // установка стилей скроллинга

      // согласоваться с DOM
      function cohereWithDom() {
        const rowHeight = tds.param.rowHeight;
        const gapRow = tds.param.gapRow;
        const paramRoll = tds.paramRoll;

        // текущие значения:
        // - вертикальное смещение рулонов в слайдере
        if (!dHeight) paramRoll.top = 0;  // при изменении настроек высоты рада и (или) зазора
        let top = paramRoll.top;
        // - номер строки, соответствующией текущей записи ( для учета изменений )
        let row = tds.row;

        // предварительные расчеты:
        // - новая высота client
        let tdsHeight = tds.links.client.tdsHeight;
        // - высота строки c зазором
        let lineHeight = rowHeight + gapRow;
        // - количество строк в рулонах data
        let preQtyRows = rowHeight > 0 ?
          Math.min(tds.listY.length, Math.ceil(tdsHeight / lineHeight))
          : 0;
        paramRoll.rows = preQtyRows;

        // - высота невидимой части непоместившейся строки
        let preHideRow = (preQtyRows ? preQtyRows * lineHeight - gapRow : 0) - tdsHeight;
        paramRoll.hideRow = preHideRow;
        // - количество строк слайдера после текущей строки, -1 - нет строк в слайдере
        let dbottomRow = curQtyRows - row - 1;
        // возможное количество записей к добавлению
        let dlastRec = tds.yMax - tds.y - dbottomRow;

        // ссылки на рулоны данных
        let rows = {
          slide: tds.links.dataSlide,
          left: tds.links.dataLeft,
          right: tds.links.dataRight
        };
        // счетчики изменений количества строк до текущей строки:
        // ins - вставленные, del - удаленных
        let before = { ins: 0, del: 0 };

        // изменение количества строк
        let dRows = preQtyRows - curQtyRows;

        // при уменьшении количества строк слайдера
        if (dRows < 0) {
          // удаляем строки
          for (let i = 0; i < -dRows; i++) {
            let child = (!i && top > 0 || i >= dbottomRow) ? 'firstChild' : 'lastChild';
            rows.left[child].remove();
            rows.slide[child].remove();
            rows.right[child].remove();
            if (child === 'firstChild') { before.del++; row--; }
          }
          tds.row = row;

          // при увеличении количества строк слайдера
        } else if (dRows > 0) {

          // образецы строки для размножения
          let templateRow = tds.links.templateRow;

          let list = {
            pre: { slide: [], left: [], right: [] },   // список строк к вставке
            add: { slide: [], left: [], right: [] }
          }; // список строк к добавлению
          for (let i = 0; i < dRows; i++) {
            let insert = i < dlastRec ? 'add' : 'pre';
            list[insert].left.push(templateRow.Left.cloneNode(true));
            list[insert].slide.push(templateRow.Slide.cloneNode(true));
            list[insert].right.push(templateRow.Right.cloneNode(true));
          }

          // добаляем в начало (для удержания последней строки у подвала)
          before.ins = list.pre.slide.length;  // количество добавленных сверху
          if (before.ins) {
            rows.left.prepend(...list.pre.left);
            rows.slide.prepend(...list.pre.slide);
            rows.right.prepend(...list.pre.right);

            row += before.ins;
            tds.row = row;
            // обновляем содержимое ячеек вставленных строк
            tds.updateData(0, before.ins - 1);
          }
          // добавляем в конец
          if (list.add.slide.length) {
            rows.left.append(...list.add.left);
            rows.slide.append(...list.add.slide);
            rows.right.append(...list.add.right);

            // обновляем содержимое ячеек вставленных строк при расширении окна
            if (dHeight) tds.updateData(preQtyRows - list.add.slide.length, preQtyRows - 1);
          }
        }

        // сглаживание смещения roll: плавные переходы между слайдами,
        // отстутствие разрывов между строк, текущая строка всегда на экране

        // - при росте:
        if (dRows > 0 || dHeight > 0) {
          // высота документа
          let heightDoc = tds.listY.length * lineHeight - gapRow;

          // добавлено сверху (для первой строки без отступа)
          if (before.ins) {
            top = tds.yBeginSlide ? preHideRow : preHideRow < 0 ? 0 : preHideRow;

            // раскрывается первая строка слайда
          } else if (top > 0) {
            // максимальная скрытая часть строки
            let hidingMax = rowHeight - 1;
            top = hidingMax - (hidingMax - top + Math.min(dHeight, top)) % lineHeight;
          }

          // отступ верхней линии слайда от начала документа
          // topSlideInDoc == 0 - при раскрытии слайдера с начала документа
          // topSlideInDoc < 0  - при раскрытии первой записи документа
          let topSlideInDoc = tds.yBeginSlide * lineHeight + top;

          // раскрытие слайдера без полного включения первой строки
          if (topSlideInDoc > 0) {
            // перемещаем просвет сверху вниз
            if (!before.ins && top < 0)
              top = (gapRow + top + Math.min(dHeight, -top)) % lineHeight - gapRow;

            // отступ нижней линии слайда от конца документа
            let bottomSlideInDoc = heightDoc - (tds.yBeginSlide * lineHeight + top) - tdsHeight;
            if (bottomSlideInDoc <= 0) top = preHideRow;
          }

          // - при сжатии:
        } else if (dRows < 0 || dHeight < 0) {

          // удалено сверху (для первой строки без отступа)
          if (before.del) {
            top = ~tds.rowMax ? preHideRow : 0;

            // плавно закрываем частично открытую первую строку, готовим её к удалению
          } else if (top > 0) {
            top = (gapRow + top + Math.min(-dHeight, top)) % lineHeight - gapRow;
          }
          // расстояние нижней линии текущей строки от начала слайда
          let curLineBottomEdge = (tds.row + 1) * lineHeight - gapRow + (top < 0 ? -top : top);
          if (curLineBottomEdge >= tdsHeight) top = preHideRow;
        }
        paramRoll.top = top;
      }  // END cohereWithDom()
    } // END controlRow()

    // контроль соответствия table (DOM) и порядка вывода колонок таблицы
    controlCol(cohere = true, set_colNum = -1, dWidth = 0) {
      const tds = this;
      const listX = tds.listX;
      const columns = tds.columns.list;

      // контроль инициализации порядка вывода колонок таблицы
      cohere = initСontrol(cohere);

      // согласоваться с DOM
      if (cohere) cohereWithDom();

      // обновление стилей
      tds.updateStyle('cols' + (dWidth ? '+scroll-col' : ''));

      // устанавливаем курсор на текущую ячейку
      const currentCell = tds.links.currentCell;
      const fixedLeft = tds.fixedLeft;
      setTimeout(() => {      // для первоочередного срабатывания ResizeObserver()
        let reCol = ~set_colNum ? listX.indexOf(set_colNum) :
          currentCell ? listX.indexOf(+currentCell.dataset.col) :
            fixedLeft;   // позиция по умолчанию
        // при скрытии текущего - снимаем курсор,
        // а для новых в текущей позиции - устанавливаем курсор
        if (reCol < 0 || (~set_colNum && tds.x === reCol)) tds.cursor();
        else tds.x = reCol;
      }, 0);

      // контроль инициализации порядка вывода колонок таблицы
      function initСontrol(cohere) {

        // контроль listX:
        // - для проверки корректрости устанавливаем признак скрытия колонки
        columns.forEach((column) => (column.hidden = true));
        // - согласование columns и listX:
        let uniqList = [], maxColNum = columns.length - 1;
        for (let x = listX.length - 1; x > -1; x--) {
          let colNum = listX[x];
          // убираем недопустимый номер
          if (colNum > maxColNum || colNum < 0) {
            listX.splice(x, 1); cohere = true;
          } else {   // убираем повторение
            if (uniqList.includes(colNum)) {
              listX.splice(x, 1); cohere = true;
            } else {
              uniqList.push(colNum);
              columns[colNum].hidden = false;  // снимаем признак скрытия
            }
          }
        }


        // контроль количества фиксированных столбцов
        // один столбец должен оставаться нефиксированным
        const fixedMax = Math.max(listX.length - 1, 0);
        if (tds.fixedLeft > fixedMax) {
          cohere = true;
          tds.fixedLeft = fixedMax;
        }
        if (tds.fixedRight > fixedMax - tds.fixedLeft) {
          cohere = true;
          tds.fixedRight = fixedMax - tds.fixedLeft;
        }

        return cohere;
      }

      // согласоваться с DOM
      function cohereWithDom() {
        const fixedLeft = tds.fixedLeft;
        const fixedRight = tds.fixedRight;
        let oldFixedLeft = tds.links.headingLeft.childElementCount;
        let oldFixedRight = tds.links.headingRight.childElementCount;

        // шаблон строки для размножения в разрезе областей
        let templateRow = tds.links.templateRow;

        // образ текущего расположения всех колонок
        let dom = {
          Left: Array.from(templateRow.Left.children, el => +el.dataset.col),
          Slide: Array.from(templateRow.Slide.children, el => +el.dataset.col),
          Right: Array.from(templateRow.Right.children, el => +el.dataset.col)
        };

        // целевой логический образ расположения колонок согласно порядка listX
        let imageСreation = (cols, qtyL, qtyR) => {
          let img = { Left: [], Slide: [], Right: [] };
          let qty = cols.length;
          let qtyFull = tds.columns.list.length;

          for (let i = 0; i < qtyL; i++) { img.Left[i] = cols[i]; }
          img.Left.sort((a, b) => a - b);
          for (let i = qty - qtyR; i < qty; i++) { img.Right.push(cols[i]); }
          img.Right.sort((a, b) => a - b);
          for (let i = 0; i < qtyFull; i++) {   // в том числе скрытые
            if (!img.Left.includes(i) && !img.Right.includes(i)) img.Slide.push(i);
          }
          return img;
        };
        let target = imageСreation(listX, fixedLeft, fixedRight);

        // подключение / снятие стиля тени и (или) скрытие / восстановление столбцов
        let cellsCol = (sele, pos) => {  // массив ссылок на ячейки столбца слайдера и templateRow
          let cells = [];

          cells.push(templateRow[sele].children[pos]);
          cells.push(tds.links['heading' + sele].children[pos]);
          let rowsData = tds.links['data' + sele].children;
          for (let row = 0; row < tds.rowMax + 1; row++) {
            cells.push(rowsData[row].children[pos]);
          }
          cells.push(tds.links['footing' + sele].children[pos]);
          return cells;
        };

        const stS = '-tds-col-shadow';
        ['Left', 'Right', 'Slide'].forEach((sele) => {
          for (let pos = 0; pos < dom[sele].length; pos++) {
            const colNum = dom[sele][pos],
              cell = templateRow[sele].children[pos],
              shadow = columns[colNum].shadow,
              setShadow = cell.classList.contains(stS),
              hidden = columns[colNum].hidden,
              setHidden = cell.hidden;
            if (shadow !== setShadow || hidden !== setHidden)
              cellsCol(sele, pos).forEach(col => {
                if (shadow && !setShadow) col.classList.add(stS);
                else if (!shadow && setShadow) col.classList.remove(stS);
                if (hidden && !setHidden) col.hidden = true;
                else if (!hidden && setHidden) col.hidden = false;
              });
          }
        });

        // список действий по перемещению
        let listMove = [];
        let addListMove = (mode, fS, fP, tS, tP) => {
          listMove.push(
            { mode: mode, fromSele: fS, fromPos: fP, toSele: tS, toPos: tP });
        }
        ['Left', 'Right', 'Slide'].forEach((fromSele, step) => {
          let seekSele = ['Left', 'Right', 'Slide'];
          seekSele.splice(step, 1);
          for (let fromPos = 0; fromPos < dom[fromSele].length; fromPos++) {
            const colNum = dom[fromSele][fromPos];
            if (!target[fromSele].includes(colNum)) {
              // столбец к перемещению
              dom[fromSele].splice(fromPos, 1);
              let toSele = target[seekSele[0]].includes(colNum) ?
                seekSele[0] : target[seekSele[1]].includes(colNum) ?
                  seekSele[1] : '';
              if (toSele) {  // не скрытые в Slide
                let toPos = dom[toSele].findIndex(id => id > colNum);
                let mode = ~toPos ? 'before' : 'append';
                if (~toPos) dom[toSele].splice(toPos, 0, colNum);
                else dom[toSele].push(colNum);
                addListMove(mode, fromSele, fromPos, toSele, toPos);
                fromPos--;
              }
            }
          }
        });

        // приведение к цели расположения стролбцов в DOM и в шаблоне строки для размножения
        let rows = tds.paramRoll.rows;
        listMove.forEach(move => {
          let [mode, fromSele, fromPos, toSele, toPos] =
            [move.mode, move.fromSele, move.fromPos, move.toSele, move.toPos];
          let [toHeading, fromHeading] = [tds.links['heading' + toSele], tds.links['heading' + fromSele]];
          let [toFooting, fromFooting] = [tds.links['footing' + toSele], tds.links['footing' + fromSele]];
          let [toData, fromData] = [tds.links['data' + toSele], tds.links['data' + fromSele]];
          if (mode === 'append') {
            toHeading.append(fromHeading.children[fromPos]);
            toFooting.append(fromFooting.children[fromPos]);
            for (let row = 0; row < rows; row++) {
              toData.children[row].append(fromData.children[row].children[fromPos]);
            }
            templateRow[toSele].append(templateRow[fromSele].children[fromPos]);
          } else {
            toHeading.children[toPos].before(fromHeading.children[fromPos]);
            toFooting.children[toPos].before(fromFooting.children[fromPos]);
            for (let row = 0; row < rows; row++) {
              toData.children[row].children[toPos].before(fromData.children[row].children[fromPos]);
            }
            templateRow[toSele].children[toPos].before(templateRow[fromSele].children[fromPos]);
          }
        });

        // контроль соответствия количества колонок
        if (tds.xMax - listX.length + 1) tds.xMax = listX.length - 1;
      } // END cohereWithDom()
    } // END controlCol()


    // отображение курсора: links.currentCell и ряда: links.currentLine
    cursor() {
      const tds = this;
      let currentCell = tds.links.currentCell;
      let currentLine = tds.links.currentLine;

      // снимаем подсветку с предыдущей ячейки
      if (currentCell) {
        currentCell.classList.remove('-tds-cursor', '-tds-active');
        currentCell = undefined;
        currentLine.left.classList.remove('-tds-line');
        currentLine.slide.classList.remove('-tds-line');
        currentLine.right.classList.remove('-tds-line');
        currentLine = undefined;
      }
      // нет строк в слайдере
      if (!~tds.rowMax) return;

      let listX = tds.listX;
      let x = tds.x;
      let row = tds.row, rowMax = tds.rowMax;

      // область расположения текущей ячейки
      let sele = x < tds.xLeft ? 'dataLeft'
        : x < tds.xRight ? 'dataSlide'
          : 'dataRight';

      // определение ссылки на текущую ячейку:
      let colNum = listX[x];

      let cells = tds.links[sele].children[row].children;
      let cell;
      for (let i = 0; i < cells.length; i++) {
        if (+cells[i].dataset.col === colNum) {
          cell = cells[i];
          break;
        }
      }
      tds.links.currentCell = cell;
      if (!cell) return;  // не найдена текущая ячейка

      // устанавливаем подсветку текущую строку
      currentLine = {
        left: tds.links.dataLeft.children[row],
        slide: tds.links.dataSlide.children[row],
        right: tds.links.dataRight.children[row]
      };
      currentLine.left.classList.add('-tds-line');
      currentLine.slide.classList.add('-tds-line');
      currentLine.right.classList.add('-tds-line');
      tds.links.currentLine = currentLine;

      // устанавливаем подсветку текущей ячейки
      cell.classList.add('-tds-cursor');
      if (document.activeElement === tds) cell.classList.add('-tds-active');

      // установка смещения roll:
      if (tds.row === 0 && tds.rowMax > 0) tds.paramRoll.top = 0;
      else if (tds.row === tds.rowMax) tds.paramRoll.top = Math.max(tds.paramRoll.hideRow, 0);

      // установка стилей скроллинга
      this.updateStyle('scroll-col+scroll-row ');
    } // END cursor()


    // регистрирация/удаление обработчиков событий таблицы
    event(add = true) {

      if (add && !(this._eventList)) {
        let tds = this;
        Object.defineProperty(this, `_eventList`,
          {
            value: Object.create({}, {
              // - уровнемеры x и y
              lgxy: { value: e => eventLGXY(e, tds) },
              // навигация по нажатию клавиатуры
              keydown: { value: e => keyTable(e, tds) },
              // - активация элементов слайдера нажатием мыши / касанием
              down: { value: e => down(e, tds, (myF.isTouch() ? 'touchstart' : 'mousedown')) },
              dbldown: { value: e => down(e, tds, 'dblclick') },
              // - фокус слайдера
              focus: {
                value: e => {
                  let cell = tds.links.currentCell;
                  if (cell && !cell.classList.contains('-tds-active'))
                    cell.classList.add('-tds-active');
                  // фокус приобрел
                }
              },
              blur: {
                value: e => {
                  let cell = tds.links.currentCell;
                  if (cell && cell.classList.contains('-tds-active'))
                    cell.classList.remove('-tds-active');
                  // фокус потерял
                }
              },

            })
          });
      }

      let event = this._eventList;
      let act = (add ? 'add' : 'remove') + 'EventListener';

      this.lgxy[act]('lgxy', event.lgxy, false);
      this[act]('keydown', event.keydown, false);
      this[act]('focus', event.focus, true);
      this[act]('blur', event.blur, true);
      this[act]((myF.isTouch() ? "touchstart" : 'mousedown'), event.down, false);
      this[act]('dblclick', event.dbldown, false);

      // отобразить страницу согласно levelgaugexy
      function eventLGXY(e, tds) {

        if (document.activeElement !== tds && ('x' in e.detail || 'y' in e.detail)) {
          tds.focus();   // уставливаем фокус
        }

        let reCursor = false, refrech = false;

        // изменилось количество записей данных
        if ((refrech = 'yQty' in e.detail)) {
          // контроль количества строк в слайдере
          tds.controlRow(true);
          // определение ряда отображения текущей записи
          let y = ('y' in e.detail) ? e.detail.y.new : tds.y;
          if (y > tds.rowMax) {
            // удержание последнего ряда у подвала
            if (tds.yEndSlide > tds.yMax) tds.row += tds.yEndSlide - tds.yMax;
          } else tds.row = y;
          reCursor = true;

          // вертикальное перемещение (при постоянном количестве)
        } else if ('y' in e.detail) {
          let bof = e.detail.y.ask < 0;
          let top = !e.detail.y.new;
          let bottom = e.detail.y.new === tds.yMax;
          let eof = e.detail.y.ask > e.detail.y.new;
          let skip = e.detail.y.new - e.detail.y.old;
          let update = (bof && !top) || (eof && !bottom) ||
            tds.row + skip < 0 || tds.row + skip > tds.rowMax;

          if (skip) {
            if (bof || top) {
              tds.row = 0;
            } else if (eof || bottom) {
              tds.row = tds.rowMax;
            } else if (!update) {
              // перемещение в текущей странице
              tds.row += skip;
            } else if (tds.yBeginSlide < 0) {
              // удержание первого ряда у шапки
              tds.row += tds.yBeginSlide;
            } else if (tds.yEndSlide > tds.yMax) {
              // удержание последнего ряда у подвала
              tds.row += tds.yEndSlide - tds.yMax;
            }
            if (update) refrech = true;
            reCursor = true;
          }
        }

        // горизонтальное перемещение
        if ('x' in e.detail && e.detail.x.new === e.detail.x.ask) {
          reCursor = true;
        }

        if (refrech) tds.updateData();
        if (reCursor) tds.cursor();

      } // END eventLGXY()

      // навигация по нажатию клавиатуры
      function keyTable(e, tds) {

        let isProcessed = true;
        let key = e.key;

        if (!e.ctrlKey && !e.altKey &&
          (e.code.includes('Key') || e.code.includes('Digit') || e.code.includes('Numpad') ||
            ['Backquote', 'Minus', 'Equal', 'IntlYen', 'BracketLeft', 'BracketRight',
              'Backslash', 'Semicolon', 'Quote', 'IntlBackslash', 'Comma', 'Period',
              'Slash', 'IntlRo'].includes(e.code))) {
          key = 'Enter';
        }

        switch (key) {
          case 'ArrowRight': // вправо на столбец
            tds.x++;
            break;

          case 'ArrowLeft':   // влево на столбец
            tds.x--;
            break;

          case 'ArrowDown':
            if (e.ctrlKey) { // на последнюю строку текущего столбца
              tds.y = tds.yMax;
            } else {         // вниз на строку
              tds.y++;
            }
            break;

          case 'ArrowUp':
            if (e.ctrlKey) { // на первую строку текущего столбца
              tds.y = 0;
            } else {   // вверх на строку
              tds.y--;
            }
            break;

          case 'Home':
            if (e.ctrlKey) {      // на первый столбец первой строки
              tds.lgxy.param.group = { x: 0, y: 0 };
            } else tds.x = 0;   // на первый столбец текущей строки
            break;

          case 'End':
            if (e.ctrlKey) {       // на последний столбец последней строки
              tds.lgxy.param.group = { x: tds.xMax, y: tds.yMax };
            } else tds.x = tds.xMax;  // на последний столбец текущей строки
            break;

          case 'PageDown':         // вниз на видимую страницу
            tds.y += tds.paramRoll.rows - (tds.paramRoll.hideRow > 0 ? 1 : 0);
            break;

          case 'PageUp':           // вверх на видимую страницу
            tds.y -= tds.paramRoll.rows - (tds.paramRoll.hideRow > 0 ? 1 : 0);
            break;

          case 'Enter':           // редактирование

            let columns = tds.columns.list;
            let listX = tds.listX;

            let go = tds.param.go;  // направление движения по Enter
            let jumpGo = (go === 'r') || (go === 'l'); // движение с учетом тени

            // количество шагов по перемещению на нетеневой
            let stepGo = (x) => {
              let step = 0;
              if (go === 'r') { // вправо
                let xQty = listX.length;
                for (let i = x; i < xQty; i++) {
                  if (!columns[listX[i]].shadow) break;
                  step++;
                }
                if (step === xQty - x) step = null;

              } else if (go === 'l') { // влево
                for (let i = x; i > -1; i--) {
                  if (!columns[listX[i]].shadow) break;
                  step--;
                }
                if (x + 1 + step !== 0) step = null;
              }
              return step;
            };

            // ячейка для редактирования в тени - переходим на открытую
            let beforeGo = false;
            if (jumpGo) {
              let step = stepGo(tds.x);
              if (step) { tds.x += step; beforeGo = true; }
            }

            // вход в редактирование по Enter и отображаемого символа
            let init = columns[listX[tds.x]];
            let dataLine = tds.data[tds.listY[tds.y]];
            let when = !init.shadow && init.when(dataLine);

            if (when) {
              //if ( !e.defaultPrevented ) tds.edit( (e.key == key) ? '' : e.key );
              //edited = true;
            }

            // движение после редактирования по Enter :
            if (go === 's'); // стоп (нет)
            else if (go === 'd') tds.y++; // вниз
            else if (go === 'u') tds.y--; // вверх
            else if (when || !beforeGo) {
              let sign = (go === 'r') ? 1 : -1;
              let step = stepGo(tds.x + sign);
              if (step === null); // останов движения
              else tds.x += sign + step;
            }
            break;

          default:
            isProcessed = false;
        }

        if (isProcessed) e.preventDefault();   // отмена для браузера

      } // END keyTable(e)

      // активация элементов створки нажатием мыши / касанием
      function down(e, tds, type) {
        if (e.target !== tds) return;   // кроме элементов светлого DOM ???
        if (!myF.isTouch() && e.which > 1) return;   // только левая кнопка мыши

        // предотвратить запуск выделения (действие браузера)
        e.preventDefault();
        if (document.activeElement !== tds) tds.focus();   // уставливаем фокус sgv

        let touch = myF.isTouch() ? e.changedTouches[0] : e;
        let tdsElement = (el) => { // идентификация элемента створки
          while (el && (el.classList.value.includes('-tds-type') || !el.classList.value.includes('-tds-'))) {
            el = el.parentElement;
          }
          return el;
        };

        let el = tdsElement(e.composedPath()[0]);
        let cl = el ? el.classList.value : '';

        // полоса изменения ширины столбца
        if (cl.includes('-tds-heading-col')) {
          let mPos = e.clientX;

          tds.x = tds.listX.indexOf(+el.dataset.col);
          let init = tds.columns.list[+el.dataset.col];

          if (type === 'mousedown' && init.widthMin !== init.widthMax) {
            // устаналвиваем resize-курсор мыши
            el.style.cursor = 'col-resize';

            tds.event(false);
            el.addEventListener('mousemove', resizeCol);
            el.addEventListener('mouseup', resizeColStop);
            el.addEventListener('mouseleave', resizeColStop);
          }

          function resizeCol(e) {
            e.preventDefault(); // предотвратить запуск выделения (действие браузера)

            let dMove = e.clientX - mPos;
            mPos = e.clientX;

            let stop = false;

            let colWidth = init.width;

            if (colWidth + dMove < init.widthMin) {
              dMove = init.widthMin - colWidth;
              stop = true;
            }
            if (init.widthMax !== null && (colWidth + dMove > init.widthMax)) {
              dMove = init.widthMax - colWidth;
              stop = true;
            }

            if (dMove) {
              init.width = colWidth + dMove;
              tds.controlCol(false);
            }
            if (stop) resizeColStop();
          }

          function resizeColStop() {
            el.removeEventListener('mouseleave', resizeColStop);
            el.removeEventListener('mouseup', resizeColStop);
            el.removeEventListener('mousemove', resizeCol);

            tds.event();

            // восстанавливаем курсор мыши
            el.style.cursor = '';
          }

          // ячейка подвала
        } else if (cl.includes('-tds-footing-col')) {
          tds.x = tds.listX.indexOf(+el.dataset.col);

          // ячейка таблицы
        } else if (cl.includes('-tds-cell')) {
          let elP = el.parentElement;  // ряд
          let x = tds.listX.indexOf(+el.dataset.col);

          let row = [].slice.apply(elP.parentElement.children).indexOf(elP);
          let skip = row - tds.row;

          if (x !== tds.x && skip) tds.lgxy.param.group = { x: x, y: tds.y + skip };
          else if (x !== tds.x) tds.x = x;
          else if (skip) tds.y += skip;

          if (e.type === 'dblclick') {
            //tds.edit();
          }
        }
      } // END down()
    } // END event()


    // обновление стилей таблицы:
    updateStyle(mode = 'init+cols+scroll-col+scroll-row') {
      const tds = this;
      const param = tds.param;
      const paramRoll = tds.paramRoll;
      const gapCol = param.gapCol;
      const gapRow = param.gapRow;
      const columns = tds.columns.list;
      const listX = tds.listX;
      const links = tds.links;

      const modeStyle = tds.shadowRoot.childNodes;

      // 0. Основные стили ***********************
      if (mode.includes('init')) {
        const divisionLine = param.divisionLine;
        const rowHeight = param.rowHeight;

        const cssCursor = paramRoll.cssCursor || `outline: 1px solid rgb(80,135,215);
  outline-offset: -1px;`;
        const cssActive = paramRoll.cssActive || `filter: brightness( 80%);`;
        const cssLine = paramRoll.cssLine || `filter: brightness( 90%);`;
        const cssShadow = paramRoll.cssShadow || `filter: brightness( 75%);`;
        const cssData = paramRoll.cssData || `background-color: rgb(255,255,255);`;
        const cssHeading = paramRoll.cssHeading || `text-align: center; ` + cssData;
        const cssFooting = paramRoll.cssFooting || cssData;

        // Область слайдера табличных данных
        let style =
          `
:host {
  --gap-color:   var( --tds-gap-color, rgb(218,218,218) ) !important;
  --fixed-color: var( --tds-fixed-color, rgb(80,135,215) ) !important;
  cursor:default !important;
  contain: layout !important;
  outline: none !important;
  position: ${tds.parentElement && tds.parentElement.localName === 'body' ? 'fixed' : 'relative'};
  width:100%; height:100%;
  top:  0;
  left: 0;
}
` +  // таблица
          `
.-tds-table {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  background: var( --gap-color );
  width: 100%;
  height: 100%;
}
`  +     // - шапка, рабочее пространство и подвал таблицы
          `
.-tds-heading, .-tds-data, .-tds-footing {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.-tds-data { flex: 1;  height: 100%; }
.-tds-heading, .-tds-footing { flex-shrink: 0; }
.-tds-heading { height: ${param.headingHeight}px;}
.-tds-footing { height: ${param.footingHeight}px; }
` +     // - стили левого, слайдового и правого подблоков:
          // flex-shrink=0 - не сжимаемый
          `
.-tds-left, .-tds-slide, .-tds-right {
  position: relative;
  overflow: hidden;
  height: 100%;
}
.-tds-left, .-tds-right { flex-shrink: 0; }
.-tds-slide { flex:1; }

` +     // стили рулонов:
          `
.-tds-roll { position: absolute; }
.-tds-data .-tds-roll {
  display: grid;
  grid-auto-rows: ${rowHeight}px;
  row-gap: ${gapRow}px;
}
.-tds-heading .-tds-roll, .-tds-footing .-tds-roll {
  height: 100%;
}
` +     // стили рядов:
          `
.-tds-row, .-tds-heading-row, .-tds-footing-row {
  display: grid;
  column-gap: ${gapCol}px;
}
.-tds-heading-row {
  box-sizing: border-box ;
  overflow: hidden;
  border-bottom: ${divisionLine}px solid var( --gap-color );
}

.-tds-footing-row {
  box-sizing: border-box ;
  overflow: hidden;
  border-top: ${divisionLine}px solid var( --gap-color );
}
` +     // стили ячеек:
          `
.-tds-cell {
  overflow: hidden;
  padding: 2px;
  user-select: none;
 }
.-tds-data .-tds-cell {
  contain: layout;
  ${cssData}
}
.-tds-heading-col { ${cssHeading} }
.-tds-footing-col { ${cssFooting} }

.-tds-data .-tds-line .-tds-cell { ${cssLine} }
.-tds-data .-tds-line .-tds-col-shadow, .-tds-col-shadow {
  ${cssShadow}
}

.-tds-data .-tds-line .-tds-cursor {
  ${cssCursor}
}
.-tds-data .-tds-line .-tds-active {
  ${cssActive}
}
` +     // стили ячейки по типу значения по умолчанию:
          `
.-tds-type-string  {}
.-tds-type-number  { text-align: right;  }
.-tds-type-boolean { text-align: center; }
.-tds-type-object  {}
}`;
        modeStyle[0].textContent = style;
      } // END mode: init

      // 1. Стили колонок ************************
      if (mode.includes('cols')) {

        let areas = { dataLeft: '', dataSlide: '', dataRight: '' };
        let widths = { dataLeft: '', dataSlide: '', dataRight: '' };
        let totalWidth = { dataLeft: -gapCol, dataSlide: -gapCol, dataRight: -gapCol };

        let style = '';
        for (let x = 0; x < listX.length; x++) {
          let colNum = listX[x];
          let widthCol = columns[colNum].width;

          // область расположения ячейки
          let sele = x < tds.xLeft ? 'dataLeft'
            : x < tds.xRight ? 'dataSlide'
              : 'dataRight';

          areas[sele] += 'col' + colNum + ' ';
          widths[sele] += widthCol + 'px ';
          totalWidth[sele] += widthCol + gapCol;

          style +=
            `
.-tds-cell[data-col="${colNum}"] {
  grid-area: col${colNum};
}`;
        }

        let widthLine = 0;
        ['dataLeft', 'dataSlide', 'dataRight'].forEach(sele => {
          if (totalWidth[sele] > 0) {
            widthLine += totalWidth[sele] + (sele === 'dataSlide' ? 0 : gapCol);
          } else totalWidth[sele] = 0;
        });

        // проверка на наличие полосы колонок
        if (tds.param.lgxy === 'auto' && !tds.lgxy.param.xSide.includes('none')) {
          let xHide = (widthLine < tds.links.client.tdsWidth);
          if (xHide !== tds.lgxy.param.xHide) tds.lgxy.param.xHide = xHide;
        }

        if (totalWidth.dataLeft) style +=
          `
.-tds-left {
  width: ${totalWidth.dataLeft}px;
  min-width: ${Math.min(20, totalWidth.dataLeft)}px;
  max-width: calc(100% - ${Math.min(20, totalWidth.dataSlide) + Math.min(20, totalWidth.dataRight)}px);
  border-right: ${gapCol}px solid var(--fixed-color);
}
.-tds-left .-tds-roll {right: 0;}

.-tds-heading .-tds-left .-tds-heading-row,
.-tds-footing .-tds-left .-tds-footing-row,
.-tds-data .-tds-left .-tds-row {
  grid-template-areas: "${areas.dataLeft}";
  grid-template-columns: ${widths.dataLeft};
}`;

        if (totalWidth.dataSlide) style +=
          `
.-tds-slide { min-width: ${Math.min(20, totalWidth.dataSlide)}px; }
.-tds-heading .-tds-slide .-tds-heading-row,
.-tds-footing .-tds-slide .-tds-footing-row,
.-tds-data    .-tds-slide .-tds-row {
  grid-template-areas: "${areas.dataSlide}";
  grid-template-columns: ${widths.dataSlide};
}`;

        if (totalWidth.dataRight) style +=
          `
.-tds-right {
  width: ${totalWidth.dataRight}px;
  min-width: ${Math.min(20, totalWidth.dataRight)}px;
  max-width: calc(100% - ${Math.min(20, totalWidth.dataSlide)}px);
  border-left: ${gapCol}px solid var(--fixed-color) ;
}
.-tds-heading .-tds-right .-tds-heading-row,
.-tds-footing .-tds-right .-tds-footing-row,
.-tds-data .-tds-right .-tds-row {

  grid-template-areas: "${areas.dataRight}";
  grid-template-columns: ${widths.dataRight};
}`;
        modeStyle[1].textContent = style;

      } // END mode: cols


      // 2. Стили скроллинга *********************
      if (mode.includes('scroll') && tds.render > 0) {

        // вертикальный скроллинг слайда:
        if (mode.includes('scroll-row')) {


          // проверка на наличие полосы записей
          if (tds.param.lgxy === 'auto' && !tds.lgxy.param.ySide.includes('none')) {
            let yHide = (tds.paramRoll.rows === tds.listY.length && tds.paramRoll.hideRow <= 0);
            if (yHide !== tds.lgxy.param.yHide) tds.lgxy.param.yHide = yHide;
          }

          modeStyle[2].textContent =
            `
.-tds-data .-tds-roll {
  top: ${-paramRoll.top}px;
}`;
        } // END mode: scroll-row

        // горизонтальный скроллинг слайда:
        if (mode.includes('scroll-col') && links.currentCell) {
          // (фиксированные части не скроллятся)
          let colNum = +links.currentCell.dataset.col;
          let x = listX.indexOf(colNum);
          let widthSlide = links.client.tdsWidth;

          let leftMax = 0, widthRoll = -gapCol;
          for (let i = tds.xLeft; i < tds.xRight; i++) {
            let wC = columns[listX[i]].width + gapCol;
            if (i < x) leftMax += wC;
            widthRoll += wC;
          }
          let left = paramRoll.left;

          // для x < xLeft обнуляет left (для установки slide c первой позиции)
          // для x >= xRight left избыточный (для установки slide в последнюю позицию)
          // иначе расчет
          let leftMin = Math.max(0, leftMax + columns[colNum].width - widthSlide);
          if (leftMin > leftMax) leftMin = leftMax;  // преимущество левого края для широких полей
          if (left < leftMin || left > leftMax) left = leftMin;
          // удержание последнего столбца на экране (для x>=xRight убирает лишнее)
          left = Math.max(0, left - Math.max(0, widthSlide - (widthRoll - left)));

          paramRoll.left = left;

          modeStyle[3].textContent =
            `
.-tds-slide .-tds-roll {
  left: ${-left}px;
}`;
        } // END mode: scroll-col
      } // END mode: scroll-col + scroll-row
    } // END updateStyle()

  } // END class TDS

  // инициализация элементов tds-box класса TDS
  window.customElements.define('tds-box', TDS);

}; // END tabularDataSlider()


