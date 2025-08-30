import { Cart } from "../components/models/cart";
import { Customer } from "../components/models/customer";
import { Catalog } from "../components/models/catalog";
import { Api } from "../components/base/Api";
import { API_URL } from "../utils/constants";
import { ApiCommunication } from "../components/layers/communication";

export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  description: string;
}

export interface ICustomer {
  payment: "card" | "cash" | null;
  address: string;
  email: string;
  phone: string;
}

export interface IGetResponse {
  total: number;
  items: IProduct[];
}

export interface IPostResponse {
  id: string;
  total: number;
}

export interface IPostRequestData extends ICustomer {
  total: number;
  items: string[];
}

// новый инстанс класса Catalog, пока что каталог пустой
const catalog = new Catalog();

// получение массива доступных товаров с сервера
const apiCommunicationLayer = new ApiCommunication(new Api(API_URL));
const getRespone = await apiCommunicationLayer.getProducts();
const products = getRespone.items;

// передача массив товаров в Catalog
catalog.setProductsList(products);

// вывод в консоль списка товаров
console.log("Список товаров из каталога:", catalog.getAllProducts());
