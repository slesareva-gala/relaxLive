/* общие файлы для slt (sach + lgxy + tds) - сборок */
"use strict";

// сборник общих функций
export const myF = {

  int: x => +/\-{0,1}\d+/.exec(x),
  // удаление комментариев из строки
  noComments: s => s.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''),
  // первая заглавная
  up0: s => s.replace(/^./, s[0].toUpperCase()),
  // привидение названия стиля CSS в соответствие JS
  toCamel: s => s.replace(/-[a-z]+/g, s => myF.up0(s.slice(1))),
  // привидение названия стиля JS в соответствие CSS
  ofCamel: s => s.replace(/[A-Z]/g, '-' + '$&').toLowerCase(),
  // приведение строки записи формата CSS в объект JS
  styleToJS: s => myF.noComments(s).replace(/\s+/g, '').split(';')
    .reduce((js, c) => {
      if (c) { let st = c.split(':'); js[myF.toCamel(st[0])] = st[1] || ''; }
      return js;
    }, {}),
  // приведение объекта JS в строку записи формата CSS 
  jsToStyle: js => {
    let s = '';
    for (let key in js) {
      s += `${myF.ofCamel(key)}: ${js[key]}; `;
    }
    return s;
  },
  // ввод: касанием (true) или мышкой (false)
  isTouch: () => 'ontouchstart' in window,
};

// КЛАСС атрибута param элементов
export class paramDeclaration {

  constructor(defaultList, parent) {

    Object.defineProperty(this, `parent`, { value: parent });
    Object.defineProperty(parent, `_dataList`, { value: {} });

    // значение параметров атрибута param: 
    for (let para in defaultList) {
      const key = para;
      const defaultValue = defaultList[key];

      Object.defineProperty(this, key, {
        get: function () {
          return (key in this.parent._dataList) ?
            this.parent._dataList[key] : defaultValue;
        },
        set: function (v) { this.group = { [key]: v }; },
        enumerable: true
      });
    }

    Object.defineProperty(this, 'default', {
      get: function () { return defaultList; },
      enumerable: true
    });

  } // END constructor()

  set text(v) { this.parent.attributeChangedCallback('param', this.text, v); }
  get text() {
    let text = ``;
    Object.keys(this).filter(key => !isNaN(+key)).forEach((key) => {
      text += `${myF.ofCamel(this[key])}: ${this.parent._dataList[this[key]]}; `;
    });
    return text.slice(0, -1);
  }
  set group(v) {
    this.parent.attributeChangedCallback('param', this.text,
      myF.jsToStyle(Object.assign({}, this.group, v)));
  }
  get group() {
    let group = {};
    // только числовые ключи считаем параметрами соответствующими атрибутам
    Object.keys(this).filter(key => !isNaN(+key)).forEach((key) => {
      Object.assign(group, { [this[key]]: this.parent._dataList[this[key]] });
    });
    return group;
  }
  // установка текущих значений параметров в атрибут элемента
  set() { this.parent.setAttribute('param', this.text); }

  // разбор/анализ/применение изменений параметров атрибута 
  // возвращает { [name]: {ask: vAsk, old: vOld, new: vNew}, .... }
  changedCallback(renew, valid = null, validAll = null) {

    // реестр изменений атрибута параметров
    let attrRenew = {};
    // значения параметров по умолчанию
    let paramDef = this.default;
    // запрашиваемые изменения атрибута
    let attrAsk = renew ? myF.styleToJS(renew) : {};
    // приведение параметров запроса к типу по умолчанию
    for (let key in attrAsk) {
      if (key in paramDef) {
        let ask = attrAsk[key].replace(/\s+/g, ''),
          cur = this[key],
          def = paramDef[key], typeDef = typeof (def);
        if (typeDef === 'boolean') {
          let i = ['', 'true', 'false'].indexOf(ask);
          attrAsk[key] = i < 0 ? cur : [def, true, false][i];
        } else if (typeDef === 'number') {
          attrAsk[key] = isNaN(+ask) ? cur : +ask;
        } else { attrAsk[key] = ask || def; }
      }
    }

    // реестр принятых изменений, прошедших контроль допустимых значений
    let attrNew = Object.assign({}, attrAsk);
    // текущие значения всех параметров (в т.ч. по умолчанию)
    // кроме пользовательских свойств и свойств-индексов (skipKey)
    let paramCur = {}, skipKey = Object.keys(this);
    for (let key in this) {
      if (!skipKey.includes(key)) { paramCur[key] = this[key]; }
    }

    // контроль допустимых значений атрибутов
    if (valid) {
      for (let key in attrAsk) {
        // пользовательское свойства игнорируем
        attrNew[key] = (key in paramDef) ?
          // контроль значений параметров: key, ask, cur, def
          valid(key, attrNew[key], this[key], paramDef[key])
          : null;
        if (attrNew[key] === null) { delete attrNew[key]; }
      }
    }
    if (validAll) { validAll(attrNew, Object.assign({}, paramCur)); }

    // сброс текущих значений параметров-атрибутов до значений по умолчанию
    let _dataList = this.parent._dataList;
    Object.keys(this).filter(key => !isNaN(+key)).forEach((key) => {
      delete _dataList[this[key]];
      delete this[key];
    });

    // запись изменений 
    let i = 0;
    for (let key in attrNew) {
      if (attrNew[key] !== null) {
        Object.defineProperty(this, `${i}`,
          {
            value: key,
            enumerable: true,
            configurable: true
          }); i++;
        Object.defineProperty(_dataList, `${key}`,
          {
            value: attrNew[key],
            configurable: true
          });
      }
    }

    // регистрация изменений в attrRenew
    for (let key in paramCur) {
      let vNew = this[key];     // новое (для удаленных default-значение)
      let vOld = paramCur[key];  // старое
      let vAsk = (key in attrAsk) ? attrAsk[key] : vOld;   // запрашивали

      if (!(vAsk === vOld && vAsk === vNew)) {
        attrRenew[key] = { ask: vAsk, old: vOld, new: vNew };
      }
    }
    return attrRenew;
  } // END changedCallback()
} // END class paramDeclaration

