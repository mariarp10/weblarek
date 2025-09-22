import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface ICartModal {
  total: number;
  products: HTMLElement[];
}

export class CartModal extends Component<ICartModal> {
  protected totalContainer: HTMLElement;
  protected cartButton: HTMLButtonElement;
  protected listContainer: HTMLUListElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.totalContainer = ensureElement<HTMLElement>(
      '.basket__price',
      this.container
    );
    this.cartButton = ensureElement<HTMLButtonElement>(
      '.button.basket__button',
      this.container
    );
    this.listContainer = ensureElement<HTMLUListElement>(
      '.basket__list',
      this.container
    );

    this.cartButton.addEventListener('click', () => {
      this.events.emit('cart:checkout')
    })
  }

  set products(productsArray: HTMLElement[]) {
    if (productsArray.length) {
      this.listContainer.replaceChildren(...productsArray);
    } else {
      this.cartButton.disabled = true;
      this.listContainer.textContent = 'Корзина пуста';
      this.listContainer.style.color = 'rgba(255, 255, 255, 0.3)';
    }
  }

  set total(value: number) {
    this.totalContainer.textContent = `${value} синапсисов`;
  }
}
