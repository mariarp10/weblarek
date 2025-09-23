import {
  IApi,
  IGetResponse,
  IPostRequestData,
  IPostResponse,
} from "../../types";

export class ApiCommunication {
  private apiInstance: IApi;

  constructor(apiInstance: IApi) {
    this.apiInstance = apiInstance;
  }

  getProducts(): Promise<IGetResponse> {
    return this.apiInstance.get("/product/");
  }

  postOrder(orderData: IPostRequestData): Promise<IPostResponse> {
    return this.apiInstance.post("/order/", orderData);
  }
}
