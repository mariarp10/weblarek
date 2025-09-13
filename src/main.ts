import './scss/styles.scss';
import './types/index.ts';
import { Cart } from './components/models/cart.ts';
import { Customer } from './components/models/customer.ts';
import { Catalog } from './components/models/catalog.ts';
import { Api } from './components/base/Api.ts';
import { API_URL } from './utils/constants.ts';
import { ApiCommunication } from './components/layers/communication.ts';
import { Header } from './components/views/header.ts';
import { EventEmitter } from './components/base/Events.ts';
import { ensureElement } from './utils/utils.ts';

// @TODO: в моделях данных в конструктор добавить поле protected events: IEvenets, методы, которые изменяют данные также должны эммитить новое событие через this.events.emit('someEventName')
const events = new EventEmitter();
events.onAll(({ eventName, data }) => {
  console.log(eventName, data)
})

// новый инстанс класса Catalog, пока что каталог пустой
const catalog = new Catalog();

// получение массива доступных товаров с сервера
const apiCommunicationLayer = new ApiCommunication(new Api(API_URL));
const getRespone = await apiCommunicationLayer.getProducts();
const products = getRespone.items;

// передача массив товаров в Catalog
catalog.setProductsList(products);
catalog.setSelectedProduct(catalog.getAllProducts()[0]);

const cart = new Cart(events);
cart
  .addProductToCart(catalog.getAllProducts()[0])
  .addProductToCart(catalog.getAllProducts()[1])
  .addProductToCart(catalog.getAllProducts()[2])
  .addProductToCart(catalog.getAllProducts()[3]);

const headerHTML = ensureElement<HTMLElement>('.header__container');
const header = new Header(events, headerHTML);

events.on('cart:productAdded', () => {
  header.counter = cart.getProductsQuantity();
  console.log(cart.getProductsQuantity());
  header.render()
})

