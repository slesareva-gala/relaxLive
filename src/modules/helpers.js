/* всякие ползности */
"use strict";


// маски числового ввода
export class Picture {
  constructor(mask, placeholder = '_') {
    this._mask = mask.replace(/[d]/g, placeholder);
    this._placeholder = placeholder;
    this._mapBuffer = [];
    mask.split('').forEach((el, i) => el === 'd' ? this._mapBuffer.push(i) : null);
    this._buffer = ''.padEnd(this._mapBuffer.length, placeholder);
    this._value = this._mask.split('');
  }

  get mask() { return this._mask; }

  start(value) {
    this._buffer = value.replace(/[^\d]/g, '')
      .slice(0, this._mapBuffer.length)
      .padEnd(this._mapBuffer.length, this._placeholder);
    this._value = this._mask.split('');
    this._buffer.split('').forEach((v, i) => this._value[this._mapBuffer[i]] = v);
    return this._mask;
  }

  edit(input, type) {
    // позиция курсора после введенного символа
    let caret = input.selectionStart;

    if (!type) input.value = this.start(input.value);

    // обычный посимвольный ввод
    if (type === "insertText") {
      const inputChar = input.value.slice(caret - 1, caret).replace(/[^\d]/, '');
      const bufferPosition = inputChar ? this._mapBuffer.findIndex(pos => pos >= caret - 1) : -1;

      if (~bufferPosition) {
        const buffer = this._buffer;
        // для незаполненного поля просто вставляем
        if (buffer.slice(bufferPosition, bufferPosition + 1) === this._placeholder) {
          const inC = buffer.split('');
          inC[bufferPosition] = inputChar;
          this._buffer = inC.join('');
          // вставляем введенный символ согласно позиции шаблона, последующие символы сдвигаем
        } else this._buffer = (bufferPosition ? buffer.slice(0, bufferPosition) : '') +
          inputChar + buffer.slice(bufferPosition, buffer.length - 1);

        // переформировываем маску
        this._mapBuffer.forEach((pos, index) => this._value.splice(pos, 1, this._buffer.slice(index, index + 1)));

        if (bufferPosition + 1 < this._mapBuffer.length) {
          caret = this._mapBuffer[bufferPosition + 1];
        }
      } else caret--;

      // посимвольное удаление справа от курсора (DEL)
    } else if (type === "deleteContentForward") {

      const bufferPosition = this._mapBuffer.findIndex(pos => pos >= caret);

      if (~bufferPosition) {
        const buffer = this._buffer;

        // удаляем символ справа от курсора, последующие символы сдвигаем влево и дополняем маской
        this._buffer = ((bufferPosition ? buffer.slice(0, bufferPosition) : '') +
          buffer.slice(bufferPosition + 1, buffer.length)).padEnd(this._mapBuffer.length, this._placeholder);

        // переформировываем маску
        this._mapBuffer.forEach((pos, index) => this._value.splice(pos, 1, this._buffer.slice(index, index + 1)));

        if (bufferPosition < this._mapBuffer.length) {
          caret = this._mapBuffer[bufferPosition];
        }
      }

      // посимвольное удаление слева от курсора (BACKSPACE)
    } else if (type === "deleteContentBackward") {

      const bufferPosition = this._mapBuffer.filter(pos => pos <= caret).length - 1;

      if (~bufferPosition) {
        const buffer = this._buffer;

        // удаляем символ слева от курсора, последующие символы сдвигаем влево и дополняем маской
        this._buffer = ((bufferPosition ? buffer.slice(0, bufferPosition) : '') +
          buffer.slice(bufferPosition + 1, buffer.length)).padEnd(this._mapBuffer.length, this._placeholder);

        // переформировываем маску
        this._mapBuffer.forEach((pos, index) => this._value.splice(pos, 1, this._buffer.slice(index, index + 1)));

        if (bufferPosition < this._mapBuffer.length) {
          caret = this._mapBuffer[bufferPosition];
        }
      } else caret++;

    }

    input.value = this._value.join('');
    input.setSelectionRange(caret, caret);
  }

} // END class Picture


// универсальный аниматор
export const animate = ({ draw, duration = 1000, timingplane = 'linear' }) => {

  const timing = {
    linear: (x) => x,

    // Кубические функции Безье (в т.ч. ease, ease-in, ease-out и ease-in-out)
    easeOutCubic: (x) => 1 - Math.pow(1 - x, 3),        // для вертикального скролла
    easeInOutCubic: (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    easeOutQuart: (x) => 1 - Math.pow(1 - x, 5),
    aseOutExpo: (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),  // для выезжающих модальных окон
  };
  if (!(timingplane in timing)) { timingplane = 'linear'; }

  // максимальное количество анимаций
  const maxCountAnimation = Math.max(Math.round(duration / 16.7), 1);
  // счетчик анимаций, максимальное количество анимаций
  let countAnimation = 0;

  requestAnimationFrame(function animation() {
    // вычисление текущего состояния анимации
    // число от 0 до 1 с учетом указанной линейности, заданной в настроку timing
    let progress = countAnimation === 0 ? 0 :
      countAnimation > maxCountAnimation - 1 ? 1 :
        timing[timingplane](countAnimation / maxCountAnimation);
    draw(progress); // отрисовать

    if (countAnimation < maxCountAnimation) {
      countAnimation++;
      requestAnimationFrame(animation);
    }
  });

};

// плавный скролл по a.href
export const smoothScroll = (selectors, duration = 1000) => {

  // счетчик прокрученных строк и целевое кол-во строк к прокрутке всё за 1 сек
  const scrollY = window.scrollY;
  // необходимо докрутить до начала элемента перехода
  const transitionHeight = document.querySelector(selectors).getBoundingClientRect().top;

  animate({
    duration: duration,
    timingplane: 'easeOutCubic',
    draw(progress) {
      // вертикальный скролл документа
      window.scrollTo(0, scrollY + transitionHeight * progress);
    }
  });
};
