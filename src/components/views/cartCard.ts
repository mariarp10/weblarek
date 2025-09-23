import { ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { baseCard, IBaseCard } from "./baseCard";

export interface ICartCard extends IBaseCard {
  index: number;
}

export class cartCard extends baseCard<ICartCard> {
  protected deleteButton: HTMLButtonElement;
  protected indexContainer: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
    actions?: ICardActions
  ) {
    super(container);

    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete.card__button",
      this.container
    );
    this.indexContainer = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );

    if (actions?.onClick) {
      this.deleteButton.addEventListener("click", actions.onClick);
    }
  }

  set index(value: number) {
    this.indexContainer.textContent = `${value}`;
  }
}
