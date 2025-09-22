import { ensureElement } from '../../utils/utils';
import { baseCard, IBaseCard } from './baseCard';
import { categoryMap } from '../../utils/constants';
import { ICardActions } from '../../types';
import { CDN_URL } from '../../utils/constants';

export interface ICatalogCard extends IBaseCard {
  category: string;
  image: string;
}

type CategoryKey = keyof typeof categoryMap;

export class CatalogCard extends baseCard<ICatalogCard> {
  protected categoryContainer: HTMLElement;
  protected imageContainer: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryContainer = ensureElement<HTMLElement>(
      '.card__category',
      this.container
    );
    this.imageContainer = ensureElement<HTMLImageElement>(
      '.card__image',
      this.container
    );

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick)
    }
  }

  set category(value: string) {
    this.categoryContainer.textContent = value;
    for (const key in categoryMap) {
      this.categoryContainer.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      )
    }
  }

  set image(value: string) {
    const imageAddress = `${CDN_URL}${value}`.replace('svg', 'png')
    this.setImage(this.imageContainer, imageAddress, this._title);
  }
}
