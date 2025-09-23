import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement; // поле содержит элемент, в котором на UI отображается счётчик
  protected cartButton: HTMLButtonElement; // содержит иконку-кнопку, по нажатию открывается корзина

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );
    this.cartButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );

    this.cartButton.addEventListener("click", () => {
      this.events.emit("cart:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
