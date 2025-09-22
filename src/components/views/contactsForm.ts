import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { IForm } from "./form";
import { Form } from "./form";

export class ContactsForm extends Form<IForm> {
    protected email: HTMLInputElement;
    protected phone: HTMLInputElement;
    protected continueButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.email = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.continueButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container)
    }
}