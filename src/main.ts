import "./scss/styles.scss";
import "./types/index.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";
import { ApiCommunication } from "./components/layers/communication.ts";
import { cloneTemplate, ensureElement } from "./utils/utils.ts";
import { EventEmitter } from "./components/base/Events.ts";

// модели данных
import { Cart } from "./components/models/cart.ts";
import { Customer } from "./components/models/customer.ts";
import { Catalog } from "./components/models/catalog.ts";

// классы представления
import { Header } from "./components/views/header.ts";
import { CatalogCard } from "./components/views/catalogCard.ts";
import { CatalogView } from "./components/views/catalogView.ts";
import { Modal } from "./components/views/modal.ts";
import { CardPreview, ICardPreview } from "./components/views/cardPreview.ts";
import { CartModal } from "./components/views/cartModal.ts";
import { cartCard } from "./components/views/cartCard.ts";
import { IProduct, TFieldName } from "./types/index.ts";
import { OrderModal } from "./components/views/oderModal.ts";

// инициализация брокера
const events = new EventEmitter();
// @TODO: в моделях данных в конструктор добавить поле protected events: IEvenets, методы, которые изменяют данные также должны эммитить новое событие через this.events.emit('someEventName')

// инициализация моделей данных
const apiCommunicationLayer = new ApiCommunication(events, new Api(API_URL));
const cart = new Cart(events);
const catalogDataModel = new Catalog(events);
const customer = new Customer(events);

// разметка для моделей представления
const headerHTML = ensureElement<HTMLElement>(".header__container");
const catalogHTML = ensureElement<HTMLElement>(".gallery");
const modalWindowHTML = ensureElement<HTMLElement>(".modal");

// темплейты
const catalogCardTemplate = ensureElement<HTMLTemplateElement>(
  "[id='card-catalog']"
);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(
  "[id='card-preview']"
);
const cartCardTemplate =
  ensureElement<HTMLTemplateElement>('[id="card-basket"]');
const cartTemplate = ensureElement<HTMLTemplateElement>('[id="basket"]');
const orderTemplate = ensureElement<HTMLTemplateElement>('[id="order"]');

// инициализация моделей представления
const headerView = new Header(events, headerHTML);
const catalogView = new CatalogView(catalogHTML);
const modalWindow = new Modal(events, modalWindowHTML);
const order = new OrderModal(events, cloneTemplate(orderTemplate));

// обработка событий
// изменение количества товаров в корзине
events.on("cart:changeQuantity", () => {
  headerView.render({ counter: cart.getProductsQuantity() });
});

events.on("cart:open", () => {
  modalWindow.open();
  const cartContent = new CartModal(events, cloneTemplate(cartTemplate));
  const productsInCart = cart.getCartProducts().map((product, index) => {
    const cartItem = new cartCard(events, cloneTemplate(cartCardTemplate), {
      onClick: () => events.emit("cart:deleteProduct", product),
    });
    return cartItem.render({
      ...product,
      index: index + 1,
    });
  });
  const cartWithProducts = cartContent.render({
    total: cart.getTotalCost(),
    products: productsInCart,
  });
  modalWindow.render({ content: cartWithProducts });
});

// отображение карточек на UI после того, как с сервера пришли объекты с карточками
events.on("catalog:setProducts", () => {
  const cardsArray = catalogDataModel.getAllProducts().map((product) => {
    const templateCopy = cloneTemplate(catalogCardTemplate);
    const cardCatalog = new CatalogCard(templateCopy, {
      onClick: () => events.emit("card:selected", product),
    });
    return cardCatalog.render(product);
  });
  catalogView.render({ productsArray: cardsArray });
});

events.on<ICardPreview>("card:selected", (product) => {
  modalWindow.open();
  const cardPreview = new CardPreview(
    events,
    cloneTemplate(cardPreviewTemplate),
    {
      onClick: () => events.emit("cart:changeProducts", product),
    }
  );
  modalWindow.content = cardPreview.render(product);
  if (!product.price) {
    cardPreview.changeButton("Unavailable");
  }
  if (cart.isInCart(product.id)) {
    cardPreview.changeButton("InCart");
  }
});

events.on<IProduct>("cart:changeProducts", (product) => {
  if (cart.isInCart(product.id)) {
    cart.deleteProductFromCart(product);
  } else cart.addProductToCart(product);
});

events.on<IProduct>("cart:deleteProduct", (product) => {
  cart.deleteProductFromCart(product);
  modalWindow.close();
  events.emit("cart:open");
});

events.on("modal:close", () => {
  modalWindow.close();
});

events.on("cart:checkout", () => {
  modalWindow.close();
  modalWindow.render({ content: order.render() });
  modalWindow.open();
});

events.on("checkout:paymentOnline", () => {
  customer.setPaymentMethod("card");
  order.activeButton = "Online";
});

events.on("checkout:paymentCash", () => {
  customer.setPaymentMethod("cash");
  order.activeButton = "Cash";
});

events.on("checkout:address", (args: { fieldName: TFieldName; value: string }) => {
  const { fieldName, value } = args;
  customer.setField(fieldName, value);
  if (!customer.getCustomerData().payment) {
    events.emit("customer:validationError", ({fieldName: "payment"}));
  }
});

events.on("customer:validationError", (arg: { fieldName: TFieldName | "payment"}) => {
  const { fieldName } = arg
  const messages = {
    payment: "Необходимо выбрать способ оплаты",
    address: "Необходимо указать адрес",
    email: "Необходимо указать имейл",
    phone: "Необходимо указать номер телефона",
  };
  order.render({error: messages[fieldName]});
});

events.on("customer:validationSuccesses", () => {
  order.render({error: ''})
})

events.on('customer:changedField', () => {
  if (customer.checkOrder()) {
    order.enableSubmit();
  } else if (!customer.checkOrder) {
    order.disableSubmit();
  }
})

// получение данных с сервера
const getRespone = await apiCommunicationLayer.getProducts();
const products = getRespone.items;
catalogDataModel.setProductsList(products);