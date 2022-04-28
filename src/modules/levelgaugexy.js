/* lgxy - Уровнемеры индексов x и y */
"use strict";

import { myF, paramDeclaration } from "./slt";

//export const levelgaugexy = () => {

// КЛАСС атрибута param элемента <lgxy-box></lgxy-box>
class LGXYparamDeclaration extends paramDeclaration {
  constructor(parent) {
    // модифицируем свойства класса paramDeclaration
    super({
      xSide: "s", xDepend: "inverse", xHide: false, xQty: 0, x: 0, xStep: 1,
      ySide: "e", yDepend: "inverse", yHide: false, yQty: 0, y: 0, yStep: 1
    }, parent);
  } // END constructor()
} // END class LGXYparamDeclaration

// КЛАСС элемента <lgxy-box></lgxy-box>
export class LGXY extends HTMLElement {

  // при создание нового, клонировании importNode() и переносе adoptNode():
  // обратный вызов: constructor>connectedCallback
  constructor() {
    // подключаем свойства super-класса (всегда первый в конструкторе)
    super();

    const lgxy = this;
    // теневой корень - ограичение уровнемера:
    const frame = lgxy.attachShadow({ mode: 'open' });

    // клиентский блок:
    const client = document.createElement('div');
    client.setAttribute('id', 'client');
    // свойства для расчетов сителей указателей:
    client.lgxyWidth = client.lgxyHeight = 0;

    frame.append(document.createElement('style'), // стили полос уровнемеров
      document.createElement('style'), // стили указателей уровнемеров
      client);

    // параментры: изменение атрибута html-элемента из JS
    Object.defineProperty(lgxy, `param`,
      { value: Object.create(new LGXYparamDeclaration(lgxy)) });

    // изменение размера клиентского блока:
    lgxy.resizeObserver = new window.ResizeObserver(entries => {
      entries.forEach((entry, index) => {

        let width, height;
        if (entry.borderBoxSize1) {
          width = entry.borderBoxSize[0].inlineSize;
          height = entry.borderBoxSize[0].blockSize;
        } else {
          width = entry.contentRect.width;
          height = entry.contentRect.height;
        }
        // сохраняем текущие размеры (для расчетов сителей указателей)
        client.lgxyWidth = Math.round(width);
        client.lgxyHeight = Math.round(height);

        // обновление стиля указателей уровнемеров
        lgxy.update('level');
      });
    });
    this.resizeObserver.observe(client);

  } // END constructor()

  // при встраивании в DOM нового или клонированного уровнемера
  connectedCallback() {
    const lgxy = this;
    if (!lgxy._isRender) {
      // согласовываем формат записи (для CSS)
      lgxy.param.set();

      // визуализация уровнемеров по начальным значениям атрибутов и стилей
      // - обновление стилей уровнемеров
      lgxy.update('strip');
      // - отображение слота клиентского блока уровнемеров
      //   при отсутствии подключений:
      let client = this.shadowRoot.childNodes[2];
      client.innerHTML = '<slot></slot>';

      // регистрирация обработчиков события на уровнемере
      lgxy.event();

      Object.defineProperty(lgxy, `_isRender`, { value: true });
    }
  } // END connectedCallback()

  // удаление уровнемера из DOM
  disconnectedCallback() {
    // прекратить слежение за client
    this.resizeObserver.disconnect();
    // удаление обработчиков события на уровнемере
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

    let lgxy = this;

    // контроль значений параметров
    // ask - передается в значении, приведеном к типу значения по умолчанию
    //       пользовательские - в символьном виде
    // ask = null;  // аннулировать запрос на изменение значения
    let valid = (key, ask, cur, def) => {
      const typeAsk = typeof (ask);
      if (typeAsk === 'number') ask = Math.max(def, myF.int(ask));
      else if (typeAsk === 'string') {
        let err = (v) => (!v.includes(ask));
        if ((key === 'xSide' && err(['n', 's', 'none', 'none-n', 'none-s'])) ||
          (key === 'ySide' && err(['w', 'e', 'none', 'none-w', 'none-e'])) ||
          (key === 'xDepend' && err(['directly', 'inverse'])) ||
          (key === 'yDepend' && err(['directly', 'inverse'])))
          ask = cur;
      }
      return ask;
    };
    // контроль зависимых значений параметров (null - аннулировать запрос на изменение значения)
    let validAll = (ask, cur) => {
      ['x', 'y'].forEach((xy) => {
        let v = (xy in ask) ? ask[xy] : 0;   // здесь, не исправлять 0 на cur[*]
        let vMax = Math.max(0,
          ((xy + 'Qty' in ask) ? ask[xy + 'Qty'] : 0) - 1);
        if (v > vMax) ask[xy] = vMax;
      });
    };

    // разбор/анализ/применение изменений параметров атрибута
    let attrRenew = this.param.changedCallback(renew, valid, validAll);

    if (!Object.keys(attrRenew).length || !this._isRender) return;

    // обновление стилей уровнемера:
    this.update((('xSide' in attrRenew || 'ySide' in attrRenew ||
      'xHide' in attrRenew || 'yHide' in attrRenew) ?
      'strip ' : '') +
      'level');
    // отправка события уровнемеров 'lgxy'
    this.dispatchEvent(new CustomEvent("lgxy", {
      detail: attrRenew,
      bubbles: false,    // не всплывает
      cancelable: false  // запрещен preventDefault()
    }));

  } // END attributeChangedCallback()

  // регистрирация/удаление обработчиков события на уровнемерах
  event(add = true) {
    if (add && !(this._eventList)) {
      let lgxy = this;
      Object.defineProperty(this, `_eventList`,
        {
          value: Object.create({}, {
            // - навигация по нажатию / касанию
            down: { value: e => down(e, lgxy) },
            // - прокрутка индексов колесиком мыши
            wheel: { value: e => wheel(e, lgxy) },
          })
        });
    }

    let event = this._eventList;
    let act = (add ? 'add' : 'remove') + 'EventListener';
    this[act]((myF.isTouch() ? "touchstart" : 'mousedown'), event.down, false);
    this[act]('wheel', event.wheel, { passive: false });

    // прокрутка индексов колесиком мыши
    function wheel(e, lgxy) {
      if (e.ctrlKey || e.altKey || e.buttons) { return; }

      //e.preventDefault(); // предотвратить запуск перемещения (действие браузера)

      let signOfChange = e.deltaY > 0 ? 1 : -1;
      let param = lgxy.param;

      if (e.shiftKey) {
        param.x += signOfChange * param.xStep;
      } else {
        param.y += signOfChange * param.yStep;
      }
    } // END wheel()

    // навигация по нажатию мышки
    function down(e, lgxy) {

      if (e.target !== lgxy) return;   // кроме элементов светлого DOM
      if (!myF.isTouch() && e.which > 1) return;   // только левая кнопка мыши

      let touch = myF.isTouch() ? e.changedTouches[0] : e;
      let mX = touch.clientX;
      let mY = touch.clientY;

      e.preventDefault();

      let client = lgxy.shadowRoot.childNodes[2].getBoundingClientRect();
      let param = lgxy.param;

      let xSide = ['n', 'none-n', 'none', 'none-s', 's'].indexOf(param.xSide) - 2;
      let ySide = ['w', 'none-w', 'none', 'none-e', 'e'].indexOf(param.ySide) - 2;

      // выбранная полоса:
      let isX = xSide > 0 ? mY > Math.trunc(client.bottom)
        : mY <= Math.trunc(client.top);
      let isY = ySide > 0 ? mX > Math.trunc(client.right)
        : mX <= Math.trunc(client.left);

      // изменение уровней по нажанию на полосе
      levelСhange(mX, mY);

      // события изменения индексов уровномеров
      movingEvent('add');

      // события изменения индексов уровномеров
      function movingEvent(act = 'remove') {
        act += 'EventListener';

        if (myF.isTouch()) {
          lgxy[act]("touchmove", levelMoving, { passive: false });
          lgxy[act]("touchend", stopMoving, false);
          lgxy[act]("touchcancel", stopMoving, false);
        } else {
          lgxy[act]('mousemove', levelMoving);
          lgxy[act]('mouseup', stopMoving);
          lgxy[act]('mouseleave', stopMoving);
        }
        window[act]('resize', stopMoving, false);
      } // END movingEvent

      function stopMoving() { movingEvent(); }

      // изменение уровней перемещением по полосам
      function levelMoving(e) {
        let touch = myF.isTouch() ? e.changedTouches[0] : e;
        // координаты створки в окне в целых px
        let mX = touch.clientX;
        let mY = touch.clientY;

        e.preventDefault();

        levelСhange(mX, mY);
      } // END levelMoving()

      // расчет и отражение изменений уровней
      function levelСhange(mX, mY) {

        // полоса X
        if (!ySide || (isX && !isY)) {
          let x = (mX <= client.left) ? 0 : (mX >= client.right - 1) ? param.xQty :
            Math.ceil((mX - client.left) * param.xQty / client.width);
          param.x = (ySide > -1 ?
            param.xDepend === 'inverse' : param.xDepend === 'directly') ?
            x - 1 : param.xQty - x;
        }

        // полоса Y
        if (!xSide || (isY && !isX)) {
          let y = (mY <= client.top) ? 0 : (mY >= client.bottom - 1) ? param.yQty :
            Math.ceil((mY - client.top) * param.yQty / client.height);
          param.y = (xSide > -1 ?
            param.yDepend === 'inverse' : param.yDepend === 'directly') ?
            y - 1 : param.yQty - y;
        }
      } // END levelСhange()
    } // END down()
  } // END event()

  // обновление стилей уровнемеров:
  update(mode = 'level') {
    const lgxy = this;
    const param = lgxy.param;

    // размещение полос:
    let xSide = (['n', 'none-n'].includes(param.xSide) ? -1 : 1),
      ySide = (['w', 'none-w'].includes(param.ySide) ? -1 : 1);

    const modeStyle = lgxy.shadowRoot.childNodes;

    // обновление стилей полос уровнемеров:
    if (mode.includes('strip')) {
      // текущие параметры уровнемеров:
      let isX = !param.xHide && !param.xSide.includes('none'),
        isY = !param.yHide && !param.ySide.includes('none');

      modeStyle[0].textContent =
        `
:host {
  --color-xy: var( --lgxy-color-xy, transparent ) !important;
  --color-level: var( --lgxy-color-level, rgba(100,100,100,0.3) );
  --color-hover: var( --lgxy-color-hover, rgba(100,100,100,0.7) ) !important;
  --wxy:${isX || isY ? `calc( var( --lgxy-width, 0.8vw ) + 0px)` : `0px`} !important;
  --wx: ${isX ? `var( --wxy )` : `0px`} !important;
  --wy: ${isY ? `var( --wxy )` : `0px`} !important;
  position: ${lgxy.parentElement && lgxy.parentElement.localName === 'body' ? 'fixed' : 'relative'};


  display: flex !important;
  flex-direction: column !important; ${xSide > 0 ? `` : `
  justify-content: flex-end !important;`}
  overflow: hidden !important;
  contain: layout !important;
  box-shadow: var(--color-xy) ${-ySide}px ${-xSide}px 1px ,
              var(--color-xy) calc(${ySide * -0.75} * var(--wy)) calc( ${xSide * -0.75} * var(--wx))
              var(--wxy) inset !important;
  top: 0;
  left: 0;
  width:  100%;
  height: 100%;
}
#client {
  flex-shrink: 0;
  align-self: flex-${ySide > 0 ? `start;` : `end;`}
  position: relative;
  width:  calc( 100% - var(--wy) );
  height: calc( 100% - var(--wx) );
  contain: size layout;
}
:host(:hover) {
  --color-level: var(--color-hover);
}`;

    }

    // обновление стиля указателей уровнемеров:
    if (mode.includes('level')) {

      // текущие значения параметров
      let x = param.x, xQty = param.xQty, xStep = param.xStep,
        y = param.y, yQty = param.yQty, yStep = param.yStep;
      // значения текущих индексов x,у с учетом зависимости от них уровнемеров
      let xL = (param.xDepend === 'inverse') ? x + 1 : xQty - x - 1;
      let yL = (param.yDepend === 'inverse') ? y + 1 : yQty - y - 1;

      // текущие параметры окна
      let client = lgxy.shadowRoot.childNodes[2];
      let wWidth = client.lgxyWidth;
      let wHeight = client.lgxyHeight;

      // расчет значений указателей
      let levelX = ((!xQty) ? 0 : (xL === xQty) ? wWidth : Math.ceil(xL * wWidth / xQty));
      let levelY = ((!yQty) ? 0 : (yL === yQty) ? wHeight : Math.ceil(yL * wHeight / yQty));

      modeStyle[1].textContent =
        `
#client {
  box-shadow:
    var(--color-level) ${ySide * 0.5}px ${xSide * 0.5}px 1px 0px ,
    var(--color-level) ${ySide * wWidth}px ${xSide * wHeight}px 0px 0px ,
    var(--color-level) calc( ${ySide} * ( var(--wxy) + ${levelX}px)) ` +
        `calc(${xSide} * (var(--wxy) + ${levelY}px)) 0px var(--wxy);
}`;
    }
  } // END update()

} // END class LGXY

// инициализация элементов lgxy-box класса LGXY
window.customElements.define('lgxy-box', LGXY);
