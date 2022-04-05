(()=>{"use strict";class e{constructor(e,t="_"){this._mask=e.replace(/[d]/g,t),this._placeholder=t,this._mapBuffer=[],e.split("").forEach(((e,t)=>"d"===e?this._mapBuffer.push(t):null)),this._buffer="".padEnd(this._mapBuffer.length,t),this._value=this._mask.split("")}get mask(){return this._mask}clear(){return this._buffer="".padEnd(this._mapBuffer.length,this._placeholder),this._value=this._mask.split(""),this._mask}edit(e,t){let s=e.selectionStart;if(e.value.trim().length<this._mapBuffer.length&&(e.value=this.clear()),"insertText"===t){const t=e.value.slice(s-1,s).replace(/[^\d]/,""),r=t?this._mapBuffer.findIndex((e=>e>=s-1)):-1;if(~r){const e=this._buffer;if(e.slice(r,r+1)===this._placeholder){const s=e.split("");s[r]=t,this._buffer=s.join("")}else this._buffer=(r?e.slice(0,r):"")+t+e.slice(r,e.length-1);this._mapBuffer.forEach(((e,t)=>this._value.splice(e,1,this._buffer.slice(t,t+1)))),r+1<this._mapBuffer.length&&(s=this._mapBuffer[r+1])}else s--}else if("deleteContentForward"===t){const e=this._mapBuffer.findIndex((e=>e>=s));if(~e){const t=this._buffer;this._buffer=((e?t.slice(0,e):"")+t.slice(e+1,t.length)).padEnd(this._mapBuffer.length,this._placeholder),this._mapBuffer.forEach(((e,t)=>this._value.splice(e,1,this._buffer.slice(t,t+1)))),e<this._mapBuffer.length&&(s=this._mapBuffer[e])}}else if("deleteContentBackward"===t){const e=this._mapBuffer.filter((e=>e<=s)).length-1;if(~e){const t=this._buffer;this._buffer=((e?t.slice(0,e):"")+t.slice(e+1,t.length)).padEnd(this._mapBuffer.length,this._placeholder),this._mapBuffer.forEach(((e,t)=>this._value.splice(e,1,this._buffer.slice(t,t+1)))),e<this._mapBuffer.length&&(s=this._mapBuffer[e])}else s++}e.value=this._value.join(""),e.setSelectionRange(s,s)}}const t=({draw:e,duration:t=1e3,timingplane:s="linear"})=>{const r={linear:e=>e,easeOutCubic:e=>1-Math.pow(1-e,3),easeInOutCubic:e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,easeOutQuart:e=>1-Math.pow(1-e,5),aseOutExpo:e=>1===e?1:1-Math.pow(2,-10*e)};s in r||(s="linear");const o=Math.max(Math.round(t/16.7),1);let l=0;requestAnimationFrame((function t(){let n=0===l?0:l>o-1?1:r[s](l/o);e(n),l<o&&(l++,requestAnimationFrame(t))}))};class s{constructor({url:e,errorMessageResponse:t="Ошибка сервера.",headers:s={"Content-Type":"application/json"}}){this._url=e,this._errorMessageResponse=t,this._headers=s}async request(e="GET",t="",s={}){document.preloader.start();try{const r={method:e,headers:this._headers};"POST PATCH PUT".includes(e)&&(r.body=JSON.stringify(s));const o=await fetch(this._url+t,r);if(!o.ok)throw new Error(this._errorMessageResponse);const l=await o.json();return document.preloader.stop(),l}catch(e){return document.preloader.stop(),console.error(e.message),[]}}use(e){return this.request("GET",e?`/${e}`:"")}filter(e){return this.request("GET",`?${e}`)}useSort(e){return this.request("GET",`?_sort=${e.field}&_order=${e.order}`)}add(e){return this.request("POST","",e)}delete(e){return this.request("DELETE",`/${e}`)}edit(e,t){return this.request("PUT",`/${e}`,t)}change(e,t){return this.request("PATCH",`/${e}`,t)}}(()=>{const e=document.querySelector(".popup-dialog-menu"),s=(e,s)=>{e.preventDefault();const r=window.scrollY,o=document.querySelector(s).getBoundingClientRect().top;t({duration:1e3,timingplane:"easeOutCubic",draw(e){window.scrollTo(0,r+o*e)}})};document.querySelector("body").addEventListener("click",(t=>{let r,o,l=null;t.target.closest(".menu")||t.target.closest(".close-menu")||(l=t.target.closest(".popup-menu-nav__item"))||(r=t.target.closest(".link-list-menu"))||!t.target.closest(".popup-dialog-menu")&&e.classList.contains("showHide-menu")?(t.preventDefault(),e.classList.toggle("showHide-menu")):(o=t.target.closest(".button-footer"))?s(t,o.firstChild.getAttribute("href")):t.target.closest(".checkbox__descr_round-feedback")?document.openPopup.open("popup-privacy"):t.target.closest(".button_wide")?document.openPopup.open("popup-consultation"):(r=t.target.closest(".link-list-repair"))||t.target.closest(".popup .close")&&document.openPopup.close(t.target),l&&s(t,l.firstChild.getAttribute("href")),r&&document.openPopup.open("popup-repair-types")})),document.querySelector("body").addEventListener("submit",(e=>{e.preventDefault(),document.sendForm.send(e.target)}))})(),document.openPopup=new class{constructor(e,t,s){this._listLinks=[],this._classOpen=t,this._classClose=s,document.querySelectorAll("."+e).forEach((e=>this._listLinks.push(e)))}open(e){let t=!1;this._listLinks.forEach((s=>{!t&&s.classList.contains(e)?(t=!0,s.classList.remove(this._classClose),s.classList.add(this._classOpen)):t&&s.classList.add(this._classClose)}))}close(e){let t=!1;this._listLinks.forEach((s=>{e.closest("."+s.className.replace(/\s/g,"."))&&(t=!0),t&&(s.classList.remove(this._classOpen),s.classList.remove(this._classClose))}))}}("popup","active","hide"),document.preloader=new class{constructor(){const e=document.createElement("div"),t=document.createElement("div");let s=document.createElement("div");e.classList.add("preloader"),t.classList.add("preloader__row"),s.classList.add("preloader__item"),t.append(s),t.append(s.cloneNode(!1)),e.append(t),document.querySelector("body").append(e),this._preloader=e}start(){this._preloader.classList.add("working")}stop(){window.setTimeout((()=>{this._preloader.classList.remove("working")}),500)}},(()=>{const e=document.querySelector(".header-contacts__arrow"),t=document.querySelector(".header-contacts__phone-number-accord"),s=t.querySelector(".header-contacts__phone-number");e.addEventListener("click",(r=>{e.classList.toggle("open"),t.classList.toggle("open"),s.classList.toggle("open")}))})(),document.querySelectorAll('input[name="phone"]').forEach((t=>{const s=new e("+7 (ddd) ddd-dd-dd");t.addEventListener("input",(e=>{s.edit(e.target,e.inputType),e.target.classList.remove("error")})),t.addEventListener("cut",(e=>e.preventDefault())),t.addEventListener("paste",(e=>e.preventDefault()))})),(()=>{const e=document.querySelectorAll(".feedback-block__form-input_name"),t=document.querySelectorAll(".checkbox__input"),s=/[^а-яё\s\-]+/gi,r=/(^[\s\-]+|^)(.*?)(?:([\s\-]+$)|$)/i,o=/(\s{2,})|(\-{2,})/g,l=/((^|\s\-|\s|\-)[а-я])([а-я]*)/gi;e.forEach((e=>{e.addEventListener("input",(e=>{e.target.value=e.target.value.replace(s,""),e.target.classList.remove("error")})),e.addEventListener("focusout",(e=>{if(e.target.matches("input")){e.target.name;let t=e.target.value;t=t.replace(l,((e,t,s,r)=>t.toUpperCase()+r.toLowerCase())),t=t.replace(r,((e,t,s)=>`${s}`)),t=t.replace(o,((e,t,s)=>(t?" ":"")+(s?"-":""))),e.target.value=t}}))})),t.forEach((e=>{e.addEventListener("click",(e=>{e.target.parentNode.classList.remove("error")}))}))})(),document.sendForm=new class{constructor({url:e,errorMessageResponse:t="Ошибка сервера.",optionals:r={}}){this._dataForm=new s({url:e,errorMessageResponse:t}),this._optionals=r}send(e){let t=e.querySelector(".feedback-block__form-input_name");const s=e.querySelector(".checkbox__input"),r=new FormData(e),o={};r.forEach(((e,t)=>{o[t]="phone"===t?e.replace(/[^\d]+/g,""):e})),(e=>s.checked&&(!t||t.value.trim()>2)&&11===e.phone.length)(o)?(e.id in this._optionals&&this._optionals[e.id].forEach((e=>{let t;"name"in e&&"assign"in e&&("select"in e?(t=document.querySelector(e.select))&&(o[e.name]=e.assign in t?t[e.assign]:e.assign):o[e.name]=e.assign)})),this._dataForm.add(o).then((t=>{e.querySelectorAll("input").forEach((e=>{e.value=""})),e.phone.classList.remove("error"),e.querySelector(".checkbox__input").checked=!1,document.openPopup.open("popup-thank")}))):(s.checked||s.parentNode.classList.add("error"),t&&t.value.trim()<3&&t.classList.add("error"),e.phone.classList.add("error"))}}({url:"https://jsonplaceholder.typicode.com/posts",errorMessageResponse:"Технический сбой. Сообщение не отправлено",optionals:{feedback1:[{name:"form",assign:"feedback1"}],feedback2:[{name:"form",assign:"feedback2"}],feedback3:[{name:"form",assign:"feedback3"}],feedback4:[{name:"form",assign:"feedback4"}],feedback5:[{name:"form",assign:"feedback5"}],feedback6:[{name:"form",assign:"feedback6"}]}}),(()=>{const e=document.querySelector(".formula"),s=e.querySelector(".formula-slider"),r=e.querySelectorAll(".formula-slider__slide"),o=e.querySelector("#formula-arrow_left"),l=e.querySelector("#formula-arrow_right");let n=null,i=1;r[0].classList.add("active-item"),o.classList.add("hide"),e.addEventListener("mouseover",(e=>{if(e.target.closest(".formula-item__icon")){n&&n.classList.remove("active-item","rotate"),n=e.target.classList.contains("formula-item__icon")?e.target.parentElement:e.target.parentElement.parentElement;const t=n.querySelector(".formula-item-popup"),s=n.getBoundingClientRect().top>t.offsetHeight;n.classList.add("active-item"),s&&n.classList.add("rotate")}})),e.addEventListener("mouseout",(e=>{e.target.closest(".formula-item__icon")&&(n&&n.classList.remove("active-item","rotate"),n=null)})),e.addEventListener("click",(e=>{if(e.target.closest(".slider-arrow")){const n=-100*(i-1),a=e.target.closest("#formula-arrow_right")?-100:100;r[i-1].classList.remove("active-item"),a<0?i++:i--,o.classList.remove("hide"),l.classList.remove("hide"),1===i&&o.classList.add("hide"),6===i&&l.classList.add("hide"),t({duration:500,timingplane:"easeInOutCubic",draw(e){s.style.left=n+a*e+"%",1===e&&r[i-1].classList.add("active-item")}})}}))})(),(()=>{const e=document.getElementById("repair-types"),s=e.querySelector(".nav-list-repair"),r=[...e.querySelectorAll(".repair-types-nav__item")],o=e.querySelector(".slider-arrow_left"),l=e.querySelector(".slider-arrow_right"),n=e.querySelector(".nav-arrow_left"),i=e.querySelector(".nav-arrow_right"),a=e.querySelector(".slider-counter-responsive"),c=a.querySelector(".slider-counter-content__current"),d=a.querySelector(".slider-counter-content__total"),u=e=>+e.className.replace(/[^\d]+/g,"")-1;let p=null;const m=()=>{o.classList.remove("hide"),l.classList.remove("hide"),0===p.currentSlide&&o.classList.add("hide"),p.currentSlide+1===p.slides.length&&l.classList.add("hide")},h=e=>{e!==p&&(p&&(p.slides[p.currentSlide].classList.remove("slide-current"),p.classList.remove("active")),p=e,p.classList.add("active"),p.slides[p.currentSlide].classList.add("slide-current"),c.textContent=p.currentSlide+1,d.textContent=p.slides.length,m(),s.style.left=-100*u(p)+"%",(()=>{const e=u(p);n.classList.remove("hide"),i.classList.remove("hide"),0===e&&n.classList.add("hide"),e===r.length-1&&i.classList.add("hide")})())};e.addEventListener("click",(e=>{let o;var l;(o=e.target.closest(".repair-types-nav__item"))?h(o):(o=e.target.closest(".slider-arrow"))?(l=o.classList.contains("slider-arrow_right")?1:-1,p.slides[p.currentSlide].classList.remove("slide-current"),p.currentSlide=l>0?Math.min(p.slides.length-1,p.currentSlide+1):Math.max(0,p.currentSlide-1),p.slides[p.currentSlide].classList.add("slide-current"),c.textContent=p.currentSlide+1,m()):(o=e.target.closest(".nav-arrow"))&&(e=>{const o=u(p),l=-100*o;t({duration:300,timingplane:"easeInOutCubic",draw(t){s.style.left=l-100*e*t+"%",1===t&&h(r[o+e])}})})(o.classList.contains("nav-arrow_right")?1:-1)})),r.forEach(((t,s)=>{t.slides=[],t.sliders=e.querySelector(".types-repair"+(s+1)),t.currentSlide=0,t.sliders.querySelectorAll(".repair-types-slider__slide").forEach((e=>{t.slides.push(e)}))})),h(r[0])})(),(e=>{const t=document.querySelector(".nav-list-popup-repair"),r=document.getElementById("switch-inner"),o=document.querySelector(".popup-repair-types-content-table__list tbody");t.selected=null,document.dataRepairFull=new s({url:"http://localhost:4545/items",errorMessageResponse:"Сервер регистрации недоступен. Запрос отменен."});const l=e=>{t.selected=e,e.style.background="rgba(223,205,168,0.7",r.textContent=e.textContent,document.dataRepairFull.filter(`type=${e.textContent}`).then((e=>{(e=>{let t="";e.forEach((e=>{t+=`\n      <tr class="mobile-row showHide">\n        <td class="repair-types-name">${e.name}</td>\n        <td class="mobile-col-title tablet-hide desktop-hide">Ед.измерения</td>\n        <td class="mobile-col-title tablet-hide desktop-hide">Цена за ед.</td>\n        <td class="repair-types-value">${e.units}</td>\n        <td class="repair-types-value">${e.cost} руб.</td>\n      </tr>\n      `})),o.innerHTML="",o.insertAdjacentHTML("beforeend",t)})(e.sort(((e,t)=>e.name>t.name?1:e.name<t.name?-1:0)))}))};document.dataRepairFull.useSort({field:"type",order:"asc"}).then((e=>{let s="Все типы услуг",r="";e.forEach((e=>{e.type!==s&&(r+=`<button class="button_o popup-repair-types-nav__item">${e.type}</button>`,s=e.type)})),t.innerHTML=r,l(t.firstChild)})),t.addEventListener("click",(e=>{e.target.closest(".nav-list-popup-repair")&&(t.selected.style.background="",l(e.target))}))})(),(()=>{const e=document.querySelector(".portfolio-slider.mobile-hide"),t=e.querySelectorAll(".portfolio-slider__slide-frame"),s=document.getElementById("portfolio-arrow_left"),r=document.getElementById("portfolio-arrow_right"),o=[],l=[];t.forEach(((e,t)=>{e.number=t,o.push(e)}));s.addEventListener("click",(e=>{const t=l.length-1;t>0&&(l[t].classList.remove("portfolio-slide-hidden"),l[t-1].classList.remove("portfolio-slide-hidden"),o.unshift(l[t]),o.unshift(l[t-1]),l.splice(t,1),l.splice(t-1,1),2===t&&(s.style.display=""),r.style.display="")})),r.addEventListener("click",(e=>{o.length>6&&(o[0].classList.add("portfolio-slide-hidden"),o[1].classList.add("portfolio-slide-hidden"),l.push(o[0]),l.push(o[1]),o.splice(0,1),o.splice(0,1),s.style.display="flex",o.length<7&&(r.style.display="none"))})),e.addEventListener("click",(e=>{document.portfolioPopupCurrentSlide=e.target.number,(()=>{if(!("portfolioPopupCurrentSlide"in document))return;const e=[...document.querySelectorAll(".popup-portfolio-slider__slide")],t=[...document.querySelectorAll(".popup-portfolio-text")],s=document.getElementById("popup_portfolio_left"),r=document.getElementById("popup_portfolio_right"),o=document.getElementById("popup-portfolio-counter"),l=o.querySelector(".slider-counter-content__current"),n=o.querySelector(".slider-counter-content__total");o.style.top="540px",o.style.zIndex="10",n.textContent=e.length;const i=()=>{e[document.portfolioPopupCurrentSlide].classList.add("slide-current"),t[document.portfolioPopupCurrentSlide].style.display="block",l.textContent=document.portfolioPopupCurrentSlide+1,0===document.portfolioPopupCurrentSlide?s.style="":(s.style.fill="blue",s.style.top="300px",s.style.zIndex="10"),document.portfolioPopupCurrentSlide===e.length-1?r.style="":(r.style.fill="blue",r.style.top="300px",r.style.zIndex="10")},a=()=>{e[document.portfolioPopupCurrentSlide].classList.remove("slide-current"),t[document.portfolioPopupCurrentSlide].style.display=""};i();const c=e=>{a(),document.portfolioPopupCurrentSlide=Math.max(0,document.portfolioPopupCurrentSlide-1),i()},d=t=>{a(),document.portfolioPopupCurrentSlide=Math.min(e.length-1,document.portfolioPopupCurrentSlide+1),i()};s.addEventListener("click",c),r.addEventListener("click",d),document.querySelector(".popup.popup-portfolio .close.mobile-hide").addEventListener("click",(()=>{s.removeEventListener("click",c),r.removeEventListener("click",d),a()}))})(),document.openPopup.open("popup-portfolio")}))})(),(()=>{const e=[...document.querySelectorAll(".reviews-slider__slide")],t=document.getElementById("reviews-arrow_left"),s=document.getElementById("reviews-arrow_right");let r=0;const o=()=>{t.style.display=0===r?"none":""},l=()=>{r===e.length-1?s.style.display="none":s.style.display=""};t.addEventListener("click",(t=>{r>0&&(e[r-1].style.display="",r--),o(),l()})),s.addEventListener("click",(t=>{r<e.length-1&&(e[r].style.display="none",r++),o(),l()}))})(),(()=>{const e=document.querySelector(".transparency-slider.row"),t=[...document.querySelectorAll(".transparency-item")],s=document.getElementById("transparency-arrow_left"),r=document.getElementById("transparency-arrow_right");let o=0;t.forEach(((e,t)=>{e.number=t}));const l=()=>{s.style.display=0===o?"none":""},n=()=>{o===t.length-1?r.style.display="none":r.style.display=""};s.addEventListener("click",(e=>{o>0&&(t[o-1].style.display="",o--),l(),n()})),r.addEventListener("click",(e=>{o<t.length-1&&(t[o].style.display="none",o++),l(),n()})),e.addEventListener("click",(e=>{const s=t.findIndex((t=>t===e.target.parentElement));~s&&(document.transpPopupCurrentSlide=s,(()=>{if(!("transpPopupCurrentSlide"in document))return;const e=[...document.querySelectorAll(".popup-transparency-slider__slide")],t=document.getElementById("transparency_left"),s=document.getElementById("transparency_right"),r=document.getElementById("transparency-popup-counter"),o=r.querySelector(".slider-counter-content__current"),l=r.querySelector(".slider-counter-content__total");r.style.top="500px",r.style.zIndex="10",l.textContent=e.length;const n=()=>{e[document.transpPopupCurrentSlide].classList.add("slide-current"),o.textContent=document.transpPopupCurrentSlide+1,0===document.transpPopupCurrentSlide?t.style.display="none":t.style.display="",document.transpPopupCurrentSlide===e.length-1?s.style.display="none":s.style.display=""},i=()=>{e[document.transpPopupCurrentSlide].classList.remove("slide-current")};n();const a=e=>{i(),document.transpPopupCurrentSlide=Math.max(0,document.transpPopupCurrentSlide-1),n()},c=t=>{i(),document.transpPopupCurrentSlide=Math.min(e.length-1,document.transpPopupCurrentSlide+1),n()};t.addEventListener("click",a),s.addEventListener("click",c),document.querySelector(".popup.popup-transparency .close.mobile-hide").addEventListener("click",(()=>{t.removeEventListener("click",a),s.removeEventListener("click",c),i()}))})(),document.openPopup.open("popup-transparency"))})),window.addEventListener("resize",(e=>{t.forEach((e=>{e.style.display=""})),o=0,l(),n()}))})(),(()=>{const e=document.querySelectorAll(".accordion li"),t=(t=-1)=>{e.forEach(((e,s)=>{const r=e.querySelector(".title_block"),o=e.querySelector(".msg");s!==t||r.classList.contains("msg-active")?(r.classList.remove("msg-active"),o.style.height="",o.classList.remove("open")):(r.classList.add("msg-active"),o.style.height=o.scrollHeight+"px",o.classList.add("open"))}))};t(),e.forEach(((e,s)=>{const r=e.querySelector(".title_block");e.querySelector(".msg"),r.addEventListener("click",(()=>{t(s)}))}))})()})();