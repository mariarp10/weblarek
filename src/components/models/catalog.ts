import { IProduct } from "../../types";

export class Catalog {
  protected productsList: IProduct[] = [];
  protected selectedProduct: IProduct | null = null;

  setProductsList(apiProducts: IProduct[]): void {
    this.productsList = apiProducts;
  }

  getAllProducts(): IProduct[] {
    return this.productsList;
  }

  getProductById(id: string): IProduct {
    const result = this.productsList.find((product) => product.id === id);
    if (!result) {
      throw new Error("Товар с таким ID не найден");
    }
    return result;
  }

  setSelectedProduct(selected: IProduct): void {
    if (!selected) {
      throw new Error("Ошибка в объекте товара");
    }
    this.selectedProduct = selected;
  }

  getSelectedProduct(): IProduct {
    if (!this.selectedProduct) {
      throw new Error("Товар не выбран");
    }
    return this.selectedProduct;
  }
}
