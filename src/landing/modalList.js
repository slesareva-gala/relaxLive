/* Лендинг.  Открытие/закрытие модальных блоков */
"use strict";

// модальные блоки лейдинга
export class ModalList {
  constructor(classLinks, classOpen) {
    this._listLinks = [];
    this._body = document.querySelector('body');
    this._countOpen = 0;
    this._classOpen = classOpen;

    document.querySelectorAll('.' + classLinks).forEach(block => this._listLinks.push(block));
  }

  // открытие модального блока: ниже стоящие при открытии накладываются сверху
  open(classRun) {
    const found = this._listLinks.find(block => block.classList.contains(classRun));
    if (found) {
      if (!this._countOpen) this._body.style.overflow = 'hidden';
      found.classList.add(this._classOpen);
      this._countOpen++;
    }
  }

  // закрытие модального окна
  close(links) {
    const found = this._listLinks.find(block => block === links);

    if (found) {
      found.classList.remove(this._classOpen);
      this._countOpen--;
      if (!this._countOpen) this._body.style.overflow = '';
    }
  }
}
