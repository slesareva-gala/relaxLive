/* Админ-панель. Точка входа до загрузки HTML */

import { tabularDataSlider } from "./modules/tabularDataSlider";
import { getCookie } from "./admin/cookie";

const site = window.location;
const cookie = getCookie();

if (site.pathname.includes('table.html')) {
  // библиотечка слайдера табличных данных
  if (cookie) tabularDataSlider();
  else site.replace(site.toString().replace('/table.html', ''));

} else if (cookie) {
  site.replace(site.toString().replace(/[^\/]*$/, '') + 'table.html');
}
