import { IProduct } from "../../types";

export class Cart {
  protected checkedOutProducts: IProduct[] = [];

  getCartProducts(): IProduct[] {
    return this.checkedOutProducts;
  }

  addProductToCart(toAdd: IProduct): void {
    this.checkedOutProducts.push(toAdd);
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
