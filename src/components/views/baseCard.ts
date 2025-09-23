import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IBaseCard {
  id: string;
  title: string;
  price: number | null;
}

export abstract class baseCard<T extends IBaseCard> extends Component<T> {
  protected cardTitle: HTMLElement;
  protected priceField: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);
    this.priceField = ensureElement<HTMLElement>(
      ".card__price",
      this.container
    );
  }

  set title(value: string) {
    this.cardTitle.textContent = value;
  }

  set price(value: number | null) {
    this.priceField.textContent = value ? `${value} синапсов` : "Бесценно";
  }
}
