import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected contentContainer: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(protected events: IEvents, protected container: HTMLElement) {
    super(container);
    this.contentContainer = ensureElement<HTMLElement>(
      '.modal__content',
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      '.modal__close',
      this.container
    );
    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.events.emit('modal:close')
      }
    })
  }

  set content(value: HTMLElement) {
    this.contentContainer.appendChild(value);
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.contentContainer.replaceChildren();
    this.container.classList.remove('modal_active');
  }
}
