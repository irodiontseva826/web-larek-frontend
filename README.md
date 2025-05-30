# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Основные интерфейсы и типы данных

### IProduct
Интерфейс, описывающий характеристики товара.


`id: string` - уникальный идентификатор товара;\
`description: string` - описание товара;\
`image: string` - ссылка на изображение товара;\
`title: string` - название товара;\
`category: string` - категория товара;\
`price: number | null` - цена товара.

### TProductCard
Данные товара для отображения на карточке товара на главной странице.

```
type TProductCard = Omit<IProduct, 'description'>
```

### TProductPreview
Данные товара для отображения в модальном окне.

```
type TProductPreview = IProduct
```

### TProductInBasket
Данные товара для отображения в корзине.

```
type TProductInBasket = Pick<IProduct, 'id' | 'title' | 'price'>
```

### IOrder
Интерфейс, описывающий информацию о заказе.

`payment: PaymentMethod` - способ оплаты (наличными или картой);\
`email: string` - электронная почта покупателя;\
`phone: string` - номер телефона покупателя;\
`address: string` - адрес доставки;\
`total: number` - общая стоимость заказа;\
`items: string[]` - массив идентификаторов выбранных товаров.

### TOrderInfo
Общая информация о заказе.

```
type TOrderInfo = Omit<IOrder, 'total' | 'items'>
```

### TOrderData
Данные покупателя, необходимые для заполения формы заказа.

```
type TOrderData = Pick<IOrder, 'payment' | 'address'>
```

### TOrderContacts
Данные покупателя, необходимые для заполения формы контактов.

```
type TOrderContacts = Pick<IOrder, 'email' | 'phone'>
```

### IOrderResult
Интерфейс, описывающий результат отправки заказа.

`id: string` - уникальный идентификатор заказа;\
`total: number` - общая стоимость заказа.

## Архитектура приложения

Код приложения разделен на 3 слоя согласно парадигме MVP: 
- слой данных (Model), отвечающий за хранение и изменение данных;
- слой представления (View), отвечающий за отображение данных на странице;
- презентер (Presenter), отвечающий за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера (`baseUrl`) и опциональный объект с заголовками запросов (`options`).

Методы: 

- `handleResponse` - обрабатывает ответ от сервера;
- `get` - выполняет GET-запрос на переданный в параметрах URI и возвращает ответ;
- `post` - выполняет `POST`-запрос (по умолчанию) по указанному URI с переданными данными и возвращает ответ. Также может выполнять `PUT` и `DELETE`-запросы, если передать их в качестве третьего параметра при вызове.

#### Класс EventEmitter
Классическая реализация брокера событий, который позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  

Методы:

- `on` - устанавливает обработчик на событие;
- `off` - снимает обработчик с события;
- `emit` - инициирует событие с данными;
- `onAll` - устанавливает обработчик на все события;
- `offAll` - сбрасывает все обработчики;
- `trigger` - делает коллбек-триггер, генерирующий событие при вызове.

#### Абстрактный класс Component

Родительский класс для всех компонентов представления. Содержит основные методы для работы с DOM.\
Конструктор класса принимает на вход `container` типа `HTMLElement`, в который будет помещён компонент.

Методы:

- `toggleClass(element: HTMLElement, className: string, force?: boolean): void` - добавляет или удаляет класс у элемента;
- `setText(element: HTMLElement, value: unknown): void` - устанавливает текстовое содержимое элементу;
- `setDisabled(element: HTMLElement, state: boolean): void` - изменяет статус блокировки у элемента;
- `setHidden(element: HTMLElement): void` - скрывает элемент;
- `setVisible(element: HTMLElement): void` - показывает элемент;
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` - устанавливает изображение с алтернативным текстом;
- `render(data?: Partial<T>): HTMLElement` - отображает переданные данные.

### Слой данных (Model)

#### Класс ProductsData
Класс отвечает за хранение и логику работы с данными товаров.\
Конструктор класса принимает инстанс брокера событий.

Поля:

- `_products: IProduct[]` - массив объектов товаров;
- `_preview: string` - id товара, выбранного для просмотра в модальном окне;
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Методы:

- `getProduct(id: string): IProduct` - возвращает товар по его id из массива;
- сеттеры и геттеры для сохранения и получения данных из полей класса.

#### Класс OrderData
Класс отвечает за хранение и логику работы с данными заказа.\
Конструктор класса принимает инстанс брокера событий.

Поля:

- `_products: IProduct[]` - массив объектов выбранных товаров;
- `_orderInfo: TOrderInfo` - общая информация о заказе;
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных;
- `formErrors: Partial<Record<keyof TOrderInfo, string>>` - объект ошибок валидации.

Методы:

- `isInBasket(id: string): boolean` - проверяет, есть ли товар в корзине, по его id;
- `addProduct(product: IProduct): void` - добавляет товар в корзину и вызывает событие изменения массива;
- `deleteProduct(productId: string): void` - удаляет товар из корзины и вызывает событие изменения массива;
- `clearBasket(): void` - очищает корзину;
- `clearOrder(): void` - очищает данные заказа;
- `getTotal(): number` - возвращает общую сумму заказа;
- `setPayment(method: PaymentMethod): void` - устанавливает переданный способ оплаты;
- `setOrderField(field: keyof TOrderData, value: string): void` - сохраняет данные о заказе пользователя;
- `setContactsField(field: keyof TOrderContacts, value: string): void` - сохраняет данные контактов пользователя;
- `validateOrder(): boolean` - проводит валидацию данных формы заказа;
- `validateContacts(): boolean` - проводит валидацию данных формы контактов;
- а также сеттеры и геттеры для сохранения и получения данных из полей класса.

### Слой представления (View)

#### Класс Page
Класс отвечает за отображение элементов на главной странице: каталог товаров, кнопка корзины и счётчик товаров, добавленных в корзину.\
Конструктор класса принимает на вход элемент контейнера, а также инстанс брокера событий.

Поля:

- `_counter: HTMLElement` - элемент счётчика товаров в корзине;
- `_catalog: HTMLElement` - элемент каталога товаров;
- `pageWrapper: HTMLElement` - элемент обёртки страницы;
- `basketButton: HTMLButtonElement` - элемент кнопки для открытия корзины.

Методы:

- сеттеры для работы с полями `_counter` и `_catalog`;
- сеттер `locked` для блокировки/разблокировки скролла при открытии/закрытии модального окна.

В классе устанавливается слушатель на кнопку корзины, при клике на которую вызывется метод `emit` класса `EventEmitter` для генерации события `basket:open`:
```
this.basketButton.addEventListener('click', () => {
  this.events.emit('basket:open');
});
```

#### Класс Card
Класс отвечает за отображение карточки товара в каталоге на главной странице, при просмотре в модальном окне и в корзине.\
Конструктор класса принимает на вход элемент контейнера, в который будет помещена карточка, инстанс брокера событий, а также коллбэк для кнопки (опционально).

Поля:

- `_id: string` - уникальный идентификатор товара;
- `_description: HTMLElement` - элемент описания товара;
- `_image: HTMLImageElement` - элемент изображения товара;
- `_title: HTMLElement` - элемент названия товара;
- `_category: HTMLElement` - элемент категории товара;
- `_price: HTMLElement` - элемент цены товара;
- `_index: HTMLElement` - элемент номера товара в корзине;
- `button: HTMLButtonElement` - элемент кнопки на карточке товара.

Методы:

- сеттеры и геттеры для работы с полями класса;
- `toggleButton(state: boolean): void` - делает активной/неактивной кнопку на карточке при просмотре в модальном окне.

Если в конструктор класса не был передан коллбэк, то устанавливается слушатель на карточку товара, при клике на которую вызывется метод `emit` класса `EventEmitter` для генерации события `product:select`. В обработчик события `product:select` передаётся объект с id товара, по которому кликнули: 
```
this.container.addEventListener('click', () => {
  this.events.emit('product:select', { id: this._id });
});
```

Если же в конструктор был передан коллбэк, то он передаётся в слушатель, установленный для кнопки на карточке. И уже в файле `index.ts` внутри функции, передаваемой в качестве коллбэка, будет генерироваться событие:

- событие `product:add`, если имеем дело с кнопкой добавления товара в корзину на карточке в модальном окне;
- событие `product:delete`, если имеем дело с кнопкой удаления товара из корзины на карточке в корзине.

#### Класс Modal
Класс отвечает за отображение модального окна, выводит внутри него любой переданный контент.\
Конструктор класса принимает на вход элемент контейнера, а также инстанс брокера событий.

Поля:

- `_content: HTMLElement` - элемент контента модального окна;
- `closeButton: HTMLButtonElement` - элемент кнопки закрытия модального окна.

Методы:

- `open(): void` - открывает модальное окно;
- `close(): void` - закрывает модальное окно;
- `render(data: IModal): HTMLElement` - отображает контент модального окна;
- сеттер для работы с полем `_content`.

При клике на кнопку закрытия модального окна и при клике на оверлей вызывается метод `close()`.

Внутри методов `open()` и `close()` вызывается метод `emit` класса `EventEmitter` для генерации событий `modal:open` и `modal:close` соответственно.

#### Класс Basket
Класс отвечает за отображение корзины.\
Конструктор класса принимает на вход элемент контейнера, а также инстанс брокера событий.

Поля:

- `_items: HTMLElement` - массив DOM-элементов, представляющих товары в корзине;
- `_total: HTMLElement` - элемент общей стоимости заказа;
- `button: HTMLButtonElement` - элемент кнопки оформления заказа.

Методы:

- сеттеры для работы с полями `_items` и `_total`;
- `toggleButton(state: boolean): void` - делает активной/неактивной кнопку оформления заказа.

В классе устанавливается слушатель на кнопку оформления заказа, при клике на которую вызывется метод `emit` класса `EventEmitter` для генерации события `basket:submit`:
```
this.button.addEventListener('click', () => {
  this.events.emit('basket:submit');
});
```

#### Класс Form
Класс отвечает за работу с формой и её валидацию. Является родительским классом для всех форм приложения.\
Конструктор класса принимает на вход элемент контейнера с формой, а также инстанс брокера событий.

Поля:

- `_valid: boolean` - валидность формы;
- `_errors: string` - текст ошибок валидации;
- `errorsContainer: HTMLElement` - элемент для отображения ошибок валидации;
- `submitButton: HTMLButtonElement` - элемент кнопки для отправки формы.

Методы:

- сеттеры и геттеры для работы с полями класса;
- `clearFrom(): void` - приводит форму к начальному виду (очищает текст ошибок валидации и устанавливет валидности значение `false`;
- `render(state: Partial<T> & IForm): HTMLElement` - отображает контент формы;
- `onInputChange(field: keyof T, value: string): void` - обрабатывает изменения в полях формы. Внутри вызывется метод `emit` класса `EventEmitter` для генерации события `${this.container.name}:input`:
```
onInputChange(field: keyof T, value: string) {
  this.events.emit(`${this.container.name}:input`, {field, value});
}
```
В классе устанавливается слушатель на форму (контейнер), при отправке которой вызывется метод `emit` класса `EventEmitter` для генерации события `${this.container.name}:submit`:
```
this.container.addEventListener('submit', (evt: Event) => {
	evt.preventDefault();
	this.events.emit(`${this.container.name}:submit`);
});
```
Также на форму устанавливается слушатель события `input`, в обработчике которого вызывается метод `onInputChange` с переданным полем и его значением.

#### Класс OrderForm
Класс отвечает за отображение формы ввода данных о заказе.\
Конструктор класса принимает на вход элемент контейнера с формой, а также инстанс брокера событий.

Поля:

- `paymentButtons: HTMLButtonElement[]` - массив элементов кнопок выбора способа оплаты;
- `_address: HTMLInputElement` - элемент поля ввода адреса.

Методы:

- сеттер `payment` для выбора способа оплаты;
- сеттер для работы с полем `_address`.

На кнопки выбора способа оплаты устанавливается слушатель события `click`, в обработчике которого вызывается метод `onInputChange` с переданными параметрами `'payment'` и именем кнопки.

#### Класс ContactsForm
Класс отвечает за отображение формы ввода контактов покупателя.\
Конструктор класса принимает на вход элемент контейнера с формой, а также инстанс брокера событий.

Поля:

- `_email: HTMLInputElement` - элемент поля ввода почты;
- `_phone: HTMLInputElement` - элемент поля ввода номера телефона.

Методы:

- сеттеры для работы с полями класса.

#### Класс Success
Класс отвечает за отображение сообщения об успешном офромлении заказа с итоговой суммой.\
Конструктор класса принимает на вход элемент контейнера, а также инстанс брокера событий.

Поля:

- `_total: HTMLElement` - элемент общей суммы заказа;
- `finishButton: HTMLButtonElement` - элемент кнопки завершения заказа.

Методы:

- сеттер для работы с полем `_total`.

В классе устанавливается слушатель на кнопку завершения заказа, при клике на которую вызывется метод `emit` класса `EventEmitter` для генерации события `order:finished`:
```
this.finishButton.addEventListener('click', () => {
  this.events.emit('order:finished');
});
```

### Слой коммуникации

#### Класс WebLarekApi
Предоставляет методы для взаимодействия с бэкендом сервиса. Расширяет базовый класс `Api`.\
Конструктор класса принимает на вход базовый URL для получения изображений, базовый URL для API и опции для запроса.

Поля:

- `cdn: string` - базовый URL для получения изображений.

Методы:

- `getProductList(): Promise<IProduct[]>` - запрашивает список товаров с сервера;
- `getProductItem(id: string): Promise<IProduct>` - запрашивает информацию о конкретном товаре по переданному id;
- `postOrder(order: IOrder): Promise<IOrderResult>` - отправляет данные о заказе на сервер.

## Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`.

### События, генерируемые в системе

#### События изменения данных (генерируются классами из модели данных)

- `catalog:changed` - событие, генерируемое при подгрузке с сервера карточек товаров;
- `products:changed` - изменение массива товаров в корзине;
- `preview:changed` - изменение открываемой в модальном окне карточки товара;
- `orderFormErrors:change` - изменение ошибок валидации данных заказа;
- `contactsFormErrors:change` - изменеие ошибок валидации данных контаков покупателя.

#### События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами из представления)

- `modal:open` - блокировка скролла при открытии модального окна;
- `modal:close` - разблокировка скролла при закрытии модального окна;
- `product:select` - выбор товара для просмотра в модальном окне;
- `product:add` - выбор товара для добавления в корзину;
- `product:delete` - выбор товара для удаления из корзины;
- `basket:open` - открытие корзины;
- `basket:submit` - подтверждение товаров в корзине;
- `order:input` - изменение данных в форме с данными о заказе;
- `contacts:input` - изменение данных в форме с контактами покупателя;
- `order:submit` - сохранение данных о заказе в форме;
- `contacts:submit` - сохранение данных о контактах покупателя в форме;
- `order:finished` - завершение оформления заказа.
