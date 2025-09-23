import { Component } from "../base/Component";

interface ICatalogView {
  productsArray: HTMLElement[];
}

export class CatalogView extends Component<ICatalogView> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set productsArray(array: HTMLElement[]) {
    this.container.replaceChildren(...array);
  }
}
