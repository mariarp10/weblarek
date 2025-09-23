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
import { OrderForm } from "./components/views/oderForm.ts";
import { ContactsForm } from "./components/views/contactsForm.ts";
import { ConfirmationModal } from "./components/views/confirmationModal.ts";

// инициализация брокера
const events = new EventEmitter();

// инициализация моделей данных
const apiCommunicationLayer = new ApiCommunication(new Api(API_URL));
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
const contactsTemplate = ensureElement<HTMLTemplateElement>('[id="contacts"]');
const orderConfirmationTemplate =
  ensureElement<HTMLTemplateElement>('[id="success"]');

// инициализация моделей представления
const headerView = new Header(events, headerHTML);
const catalogView = new CatalogView(catalogHTML);
const modalWindow = new Modal(modalWindowHTML);
const order = new OrderForm(events, cloneTemplate(orderTemplate));
const contacts = new ContactsForm(events, cloneTemplate(contactsTemplate));
const confirmation = new ConfirmationModal(
  events,
  cloneTemplate(orderConfirmationTemplate)
);
const cartContent = new CartModal(events, cloneTemplate(cartTemplate));

// функция для обновления содержимого корзины. содержимое обновляется, когда добавляются новые товары и когда удаляются
function renderCartContent() {
  const productsInCart = cart.getCartProducts().map((product, index) => {
    const cartItem = new cartCard(events, cloneTemplate(cartCardTemplate), {
      onClick: () => events.emit("cart:deleteProduct", product),
    });
    return cartItem.render({
      ...product,
      index: index + 1,
    });
  });
  return cartContent.render({
    total: cart.getTotalCost(),
    products: productsInCart,
  });
}

// обработка событий
events.on("modal:close", () => {
  modalWindow.close();
});

// изменение количества товаров в корзине
events.on("cart:changeQuantity", () => {
  headerView.render({ counter: cart.getProductsQuantity() });
});

events.on("cart:open", () => {
  modalWindow.open();
  modalWindow.render({ content: renderCartContent() });
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

events.on("card:selected", (product: ICardPreview) => {
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

events.on("cart:changeProducts", (product: IProduct) => {
  if (cart.isInCart(product.id)) {
    cart.deleteProductFromCart(product);
  } else cart.addProductToCart(product);
});

events.on("cart:deleteProduct", (product: IProduct) => {
  cart.deleteProductFromCart(product);
  modalWindow.close();
  modalWindow.render({ content: renderCartContent() });
  modalWindow.open();
});

events.on("cart:checkout", () => {
  modalWindow.close();
  modalWindow.render({ content: order.render() });
  modalWindow.open();
});

events.on("checkout:paymentChanged", (arg: { value: "cash" | "card" }) => {
  const { value } = arg;
  customer.setPayment(value);
  order.markSelectedButton(value);
});

events.on("checkout:continue", () => {
  modalWindow.close();
  modalWindow.render({ content: contacts.render() });
  modalWindow.open();
});

events.on(
  "checkout:setField",
  (arg: { fieldName: TFieldName; value: string }) => {
    const { fieldName, value } = arg;
    switch (fieldName) {
      case "address": {
        customer.setAddress(value);
        break;
      }
      case "email": {
        customer.setEmail(value);
        break;
      }
      case "phone": {
        customer.setPhone(value);
        break;
      }
    }
  }
);

events.on("customer:change", () => {
  const { payment, address, email, phone } = customer.validateData();
  const errorsMap = {
    payment: "Необходимо выбрать способ оплаты",
    address: "Необходимо указать адрес",
    email: "Необходимо указать имейл",
    phone: "Необходимо указать номер телефона",
  };
  if (payment && address) {
    order.isValid = true;
    order.error = "";
  }
  if (!address) {
    order.isValid = false;
    order.error = errorsMap["address"];
  }
  if (!payment) {
    order.isValid = false;
    order.error = errorsMap["payment"];
  }
  if (email && phone) {
    contacts.isValid = true;
    contacts.error = "";
  }
  if (!email) {
    contacts.isValid = false;
    contacts.error = errorsMap["email"];
  }
  if (!phone) {
    contacts.isValid = false;
    contacts.error = errorsMap["phone"];
  }
});

events.on("order:confirmation", async () => {
  try {
    const postRequest = await apiCommunicationLayer.postOrder({
      ...customer.getCustomerData(),
      total: cart.getTotalCost(),
      items: cart.getCartProducts().map((product) => product.id),
    });
    const {id, total} = postRequest;

    modalWindow.close();
    cart.clearCart();
    customer.clearCustomerData();

    const orderTotal = total;
    modalWindow.render({ content: confirmation.render({ orderTotal }) });
    modalWindow.open();
  } catch (e) {
    console.log("Ошибка при отправке данных на сервер")
  }
});

// получение данных с сервера
const getRespone = await apiCommunicationLayer.getProducts();
const products = getRespone.items;
catalogDataModel.setProductsList(products);


