import { TFieldName } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IOrderModal {
  error: string;
  activeButton: string;
}

export class OrderModal extends Component<IOrderModal> {
  protected paymentOnline: HTMLButtonElement;
  protected paymentCash: HTMLButtonElement;
  protected address: HTMLInputElement;
  protected continueButton: HTMLButtonElement;
  protected errorMessage: HTMLElement;
  protected selectedPaymentButton?: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.paymentOnline = ensureElement<HTMLButtonElement>(
      '[name="card"]',
      this.container
    );
    this.paymentCash = ensureElement<HTMLButtonElement>(
      '[name="cash"]',
      this.container
    );
    this.address = ensureElement<HTMLInputElement>(
      ".form__input",
      this.container
    );
    this.continueButton = ensureElement<HTMLButtonElement>(
      ".button.order__button",
      this.container
    );
    this.errorMessage = ensureElement<HTMLElement>(
      ".form__errors",
      this.container
    );

    this.paymentOnline.addEventListener("click", () => {
      this.events.emit("checkout:paymentOnline");
    });

    this.paymentCash.addEventListener("click", () => {
      this.events.emit("checkout:paymentCash");
    });

    this.address.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const fieldName = target.name as TFieldName;
      const value = target.value;
      this.OnInputChange(fieldName, value);
    });
  }

  protected OnInputChange(fieldName: TFieldName, value: string) {
    this.events.emit("checkout:address", { fieldName, value });
  }

  set error(value: string) {
    this.errorMessage.textContent = value;
  }

  set activeButton(arg: "Online" | "Cash") {
    switch (arg) {
      case "Online": {
        this.paymentOnline.classList.add("button_alt-active");
        this.paymentCash.classList.remove("button_alt-active");
        break;
      }
      case "Cash": {
        this.paymentCash.classList.add("button_alt-active");
        this.paymentOnline.classList.remove("button_alt-active");
      }
    }
  }

  enableSubmit() {
    this.continueButton.disabled = false
  }

  disableSubmit() {
    this.continueButton.disabled = true;
  }
}
