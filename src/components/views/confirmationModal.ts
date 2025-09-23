import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IConfirmationModal {
  orderTotal: number;
}

export class ConfirmationModal extends Component<IConfirmationModal> {
  protected continueButton: HTMLButtonElement;
  protected totalContainer: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.continueButton = ensureElement<HTMLButtonElement>(
      ".button.order-success__close",
      this.container
    );

    this.totalContainer = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );

    this.continueButton.addEventListener("click", () => {
      this.events.emit("modal:close");
    });
  }

  set orderTotal(value: number) {
    this.totalContainer.textContent = `Списано ${value} синапсов`;
  }
}
