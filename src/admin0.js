/* Админ-панель. Точка входа до HTML */

import { tabularDataSlider } from "./modules/tabularDataSlider";
import { getCookie } from "./modules/aCookie";

const site = window.location;
const cookie = getCookie();

if (site.pathname.includes('table.html')) {
  // библиотечка слайдера табличных данных
  if (cookie) tabularDataSlider();
  else site.replace(site.toString().replace('/table.html', ''));

} else if (cookie) {
  site.replace(site.toString().replace(/[^\/]*$/, '') + 'table.html');
}
