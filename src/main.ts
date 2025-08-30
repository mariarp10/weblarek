import './scss/styles.scss';
import './types/index.ts';
import { Cart } from './components/models/cart.ts';
import { Customer } from './components/models/customer.ts';
import { Catalog } from './components/models/catalog.ts';
import { Api } from './components/base/Api.ts';
import { API_URL } from './utils/constants.ts';
import { ApiCommunication } from './components/layers/communication.ts';

// новый инстанс класса Catalog, пока что каталог пустой
const catalog = new Catalog();

// получение массива доступных товаров с сервера
const apiCommunicationLayer = new ApiCommunication(new Api(API_URL));
const getRespone = await apiCommunicationLayer.getProducts();
const products = getRespone.items;

// передача массив товаров в Catalog
catalog.setProductsList(products);
console.log("Список товаров из каталога:", catalog.getAllProducts());
catalog.setSelectedProduct(catalog.getAllProducts()[0]);
console.log(
  "Пример выбранного товара, который должен отобразиться в модальном окне",
  catalog.getSelectedProduct()
);

const cart = new Cart();
cart
  .addProductToCart(catalog.getAllProducts()[0])
  .addProductToCart(catalog.getAllProducts()[1])
  .addProductToCart(catalog.getAllProducts()[2])
  .addProductToCart(catalog.getAllProducts()[3]);
console.log("Товары, добавленные в корзину:", cart.getCartProducts());
console.log("Количество товаро в корзине:", cart.getProductsQuantity());
console.log("Общая стоимость товаров в корзине:", cart.getTotalCost());
cart.deleteProductFromCart(
  catalog.getProductById(catalog.getAllProducts()[3]["id"])
);
console.log(
  "Товары в корзине после удаления одного из товаров",
  cart.getCartProducts()
);
cart.clearCart();
console.log("Корзина после очищения:", cart.getCartProducts());

const customer = new Customer();
customer
  .setField("address", "Some street 12")
  .setField("email", "email@domain.com")
  .setField("phone", "1234567890")
  .setPaymentMethod("card");
console.log("Данные о покупателе", customer.getCustomerData());
