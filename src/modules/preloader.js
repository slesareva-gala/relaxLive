/* прелоадер */
"use strict";

export const addPreloader = () => {

  class Preloader {
    constructor() {
      const preloader = document.createElement('div');
      const row = document.createElement('div');
      let item = document.createElement('div');

      preloader.classList.add("preloader");
      row.classList.add("preloader__row");
      item.classList.add('preloader__item');

      row.append(item);
      row.append(item.cloneNode(false));
      preloader.append(row);
      document.querySelector('body').append(preloader);

      this._preloader = preloader;
    }

    start() {
      this._preloader.classList.add('working');
    }

    stop() {
      window.setTimeout(() => {
        this._preloader.classList.remove('working');
      }, 500);
    }
  } // END class Preloader

  document.preloader = new Preloader();
};  // END addPreloader()
