/* Сервис данных для JSON-Server */
"use strict";

export class DataJSON {
  constructor({ url, urlDemo, errorMessageResponse = 'Ошибка сервера.',
    headers = {
      "Content-Type": "application/json",
    } }) {
    this._url = url;
    this._urlDemo = urlDemo;
    this._errorMessageResponse = errorMessageResponse;
    this._headers = headers;
  }

  // запрос к базе
  async request(method = 'GET', app = '', data = {}) {
    document.preloader.start();

    try {
      const options = {
        method: method,
        headers: this._headers
      };
      if ('POST PATCH PUT'.includes(method))
        options.body = JSON.stringify(data);

      let response;
      try {
        response = await fetch(this._url + app, options);
        if (!response.ok) throw new Error(this._errorMessageResponse);
      } catch (error) {
        response = await fetch(this._urlDemo + app, options);
        if (!response.ok) throw new Error(this._errorMessageResponse);
        console.error('Страница переключена на демонстрационный режим');
        document.taskDemo = 1;
      }

      const result = await response.json();
      document.preloader.stop();
      return result;

    } catch (error) {
      document.preloader.stop();
      throw new Error(this._errorMessageResponse);
    }
  }

  // открытие все [или по id]
  use(id) { return this.request('GET', id ? `/${id}` : ''); }

  // открытие с фильтром
  filter(condition) { return this.request('GET', `?${condition}`); }
  // открытие с сортировкой on = {field: 'имяПоля', order: 'asc'|'desc' }
  useSort(on) { return this.request('GET', `?_sort=${on.field}&_order=${on.order}`); }

  /*
   record - объект в соответствии со структурой базы без id
   fields - выборка из record
  */
  // добавление записи (id в ответе сервера)
  add(record) { return this.request('POST', '', record); }
  // удаление записи по id
  delete(id) { return this.request('DELETE', `/${id}`); }
  // замена всех свойств записи с указанным id на свойства согласно record
  edit(id, record) { return this.request('PUT', `/${id}`, record); }
  // выборочное изменение свойств записи с указанным id согласно fields
  change(id, fields) { return this.request('PATCH', `/${id}`, fields); }

} // END class DataJSON
