import {
  IApi,
  IGetResponse,
  IPostRequestData,
  IPostResponse,
} from "../../types";
import { IEvents } from "../base/Events";

export class ApiCommunication {
  private apiInstance: IApi;

  constructor(protected events: IEvents, apiInstance: IApi) {
    this.apiInstance = apiInstance;
  }

  getProducts(): Promise<IGetResponse> {
    return this.apiInstance.get("/product/");
    this.events.emit("api:receivedProducts");
  }

  postOrder(orderData: IPostRequestData): Promise<IPostResponse> {
    return this.apiInstance.post("/order/", orderData);
  }
}
