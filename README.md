# relaxLive - _Дипломный проект курса "JavaScript"_
## _Glo Academy, поток JS 23.0_

**Уровень дипломного проекта:** сложный (лендинг и админ-панель)

**Основные требования к дипломному проекту**
1. За одну неделю написать интерактив на vanilla JS в соотвтетствии с техническим заданием к исходной верстке:
- лендинг компании Relax Live, предоставляющей услуги ремонта жилых помещений;
- админ-панель проекта с авторизацией, позволяющая вносить изменения в "Список услуг и цен", с использованием JSON-server 
2. Обязательно: модульная структура - Webpack, работоспособность десктопной и мобильной версии в браузерах chrome и firefox.
3. Контроль этапов выполнения дипломного проекта: сервис Trello

|  |  |
| --- | --- |
| **Автор курса:** | Александр Ильясов |
| **Куратор на курсе:** | Михаил Филимон |
| **Куратор дипломной работы:** | Кирилл Сухарев |
| **Студент** | Галина Слесарева |

## Посмотреть на github:

[демо лендинг](https://slesareva-gala.github.io/relaxLive/)

[демо админ-панель](https://slesareva-gala.github.io/relaxLive/admin/)
логин:  **_admin_** 
пароль: **_123_**

**Примечания**
- При отсутствии установленного json-server на localhost 4545 и связанного с файлом db/db.json из проекта (например, 
просмотре на github), лендинг и админ-панель переключаются в демонстрационный режим. 
- В Демо-режиме:
  - данные для "Списка услуг и цен" подгружаются из docs/dbDemo/*.json;
  - доступен весь функционал админ-панели;
  - изменения в админ-панели "Списка услуг и цен" не сохраняются в базу данных и не отображаются в лендинге
