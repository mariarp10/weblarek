import { IPreviewCardActions, TCardButtonState } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CatalogCard, ICatalogCard } from "./catalogCard";

export interface ICardPreview extends ICatalogCard {
  description: string;
}

export class CardPreview extends CatalogCard {
  protected descriptionContainer: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
    actions?: IPreviewCardActions
  ) {
    super(container);
    this.descriptionContainer = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );
    this.cardButton = ensureElement<HTMLButtonElement>(
      ".button.card__button",
      this.container
    );

    this.cardButton.addEventListener("click", () => {
      this.events.emit("modal:close");
    });

    if (actions?.onClick) {
      this.cardButton.addEventListener("click", actions.onClick);
    }
  }

  set description(value: string) {
    this.descriptionContainer.textContent = value;
  }

  changeButton(state: TCardButtonState) {
    switch (state) {
      case "Unavailable":
        this.cardButton.textContent = "Недоступно";
        this.cardButton.disabled = true;
        break;
      case "InCart":
        this.cardButton.textContent = "Удалить из корзины";
        break;
    }
  }
}
