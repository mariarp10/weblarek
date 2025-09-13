import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IProductCard {
    productName: string,
    price: string;
}

export class productCart extends Component<IProductCard> {
    protected cardTitle: HTMLElement;
    protected priceField: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.cardTitle = ensureElement<HTMLElement>('', this.container)
    }
}