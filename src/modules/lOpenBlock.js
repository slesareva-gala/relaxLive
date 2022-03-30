/* Лендинг.  Открытие блоков */
"use strict";

// открытие блоков лейдинга
export class OpenBlock {
  constructor(classLinks, classOpen, classClose) {
    this._listLinks = [];
    this._classOpen = classOpen;
    this._classClose = classClose;

    document.querySelectorAll('.' + classLinks).forEach(block => this._listLinks.push(block));
  }

  // открытие каскадом: ниже стоящие деактивируются
  open(classRun) {
    let isOpen = false;

    this._listLinks.forEach(block => {
      if (!isOpen && block.classList.contains(classRun)) {
        isOpen = true;
        block.classList.remove(this._classClose);
        block.classList.add(this._classOpen);
      } else if (isOpen) block.classList.add(this._classClose);
    });
  }

  // закрытие каскадом: текущий и нижестоящие в первоначальное сосотяние
  close(links) {
    let isClose = false;
    this._listLinks.forEach(block => {
      if (links.closest('.' + block.className.replace(/\s/g, '.'))) isClose = true;
      if (isClose) {
        block.classList.remove(this._classOpen);
        block.classList.remove(this._classClose);
      }
    });
  }
}
