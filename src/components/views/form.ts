import { TFieldName } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IForm {
  isValid: boolean;
  error: string;
}

export abstract class Form<IForm> extends Component<IForm> {
  protected submitButton: HTMLButtonElement;
  protected errorMessage: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );
    this.errorMessage = ensureElement<HTMLElement>(
      ".form__errors",
      this.container
    );

    this.container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const fieldName = target.name as TFieldName;
      const value = target.value;
      this.OnInputChange(fieldName, value);
    });

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
    });
  }

  OnInputChange(fieldName: TFieldName, value: string) {
    this.events.emit("checkout:setField", { fieldName, value });
  }

  set isValid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set error(value: string) {
    this.errorMessage.textContent = value;
  }
}
