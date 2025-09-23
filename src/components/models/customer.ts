import { IEvents } from "../base/Events";
import { ICustomer } from "../../types";

export class Customer {

  protected payment: "card" | "cash" | null = null;
  protected address: string = "";
  protected email: string = "";
  protected phone: string = "";

  constructor(protected events: IEvents) {}

  setAddress(value: string) {
      this.address = value.trim();
      this.events.emit("customer:change")
  }

  setEmail(value: string) {
      this.email = value.trim();
      this.events.emit("customer:change")
  }

  setPhone(value: string) {
    this.phone = value.trim();
    this.events.emit("customer:change")
  }

  setPayment(value: "cash" | "card") {
    this.payment = value;
    this.events.emit("customer:change");
  }

  getCustomerData(): ICustomer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone
    };
  }

  validateData() {
    const result = {
      payment: !!this.payment,
      address: !!this.address,
      email: !!this.email,
      phone: !!this.phone,
    }
    return result
  }

  clearCustomerData(): void {
    this.payment = null;
    this.address = "";
    this.email = "";
    this.phone = ""
  }
}
