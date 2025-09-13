import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  protected checkedOutProducts: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getCartProducts(): IProduct[] {
    return this.checkedOutProducts;
  }

  addProductToCart(toAdd: IProduct): this {
    this.checkedOutProducts.push(toAdd);
    this.events.emit('cart:productAdded', {counter: this.getProductsQuantity()});
    return this
  }

  deleteProductFromCart(toDelete: IProduct): void {
    if (this.isInCart(toDelete.id)) {
      const index = this.checkedOutProducts.findIndex(
        (product) => product.id === toDelete.id
      );
      this.checkedOutProducts.splice(index, 1);
    }
  }

  clearCart(): void {
    this.checkedOutProducts.length = 0;
  }

  getTotalCost(): number {
    return this.checkedOutProducts.reduce(
      (accum, product) => accum + (product.price ?? 0),
      0
    );
  }

  getProductsQuantity(): number {
    return this.checkedOutProducts.length;
  }

  isInCart(idToCheck: string): boolean {
    return this.checkedOutProducts
      .map((product) => product.id)
      .includes(idToCheck);
  }
}
