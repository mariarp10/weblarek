import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, IForm } from "./form";

export class OrderForm extends Form<IForm> {
  protected paymentCard: HTMLElement;
  protected paymentCash: HTMLElement;
  protected continueButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(events, container);

    this.paymentCard = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container
    );
    this.paymentCash = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container
    );

    this.continueButton = ensureElement<HTMLButtonElement>('.button.order__button', this.container);

    this.paymentCard.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLButtonElement;
      const paymentOption = target.name as "cash" | "card";
      this.OnClick(paymentOption);
    });

    this.paymentCash.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLButtonElement;
      const paymentOption = target.name as "cash" | "card";
      this.OnClick(paymentOption);
    });

    this.continueButton.addEventListener("click", () => {
      this.events.emit("checkout:continue")
    })
  }

  OnClick(value: "cash" | "card") {
    this.events.emit("checkout:paymentChanged", { value });
  }

  markSelectedButton(buttonName: string) {
    switch (buttonName) {
      case "card": {
        this.paymentCard.classList.add("button_alt-active");
        this.paymentCash.classList.remove("button_alt-active");
        break;
      }
      case "cash": {
        this.paymentCash.classList.add("button_alt-active");
        this.paymentCard.classList.remove("button_alt-active");
      }
    }
  }
}
