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
