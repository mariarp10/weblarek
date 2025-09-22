import { ICustomer, TFieldName } from "../../types";
import { IEvents } from "../base/Events";

export class Customer {
  protected customerData: ICustomer = {
    payment: null,
    address: "",
    email: "",
    phone: "",
  };

  constructor(protected events: IEvents) {}

  setField(fieldName: TFieldName, value: string): this {
    if (this.validateValueNotEmpty(fieldName, value.trim())) {
      this.customerData[fieldName] = value;
    }
    this.events.emit('customer:changedField');
    return this;
  }

  setPaymentMethod(value: "cash" | "card" | null) {
    if (this.validatePaymentMethod(value)) {
      this.customerData.payment = value;
      this.events.emit('customer:validationSuccesses');
      return this;
    }
  }

  protected validatePaymentMethod(value: "cash" | "card" | null) {
    if (value === "cash" || value === "card") {
      return true
    } else {
      this.events.emit('customer:validationError', ({payment: "payment"}));
    }
  }

  getCustomerData(): ICustomer {
    return this.customerData;
  }

  protected validateValueNotEmpty(fieldName: TFieldName, value: string) {
    if (value) {
      return !!value;
    } else {
      this.events.emit('customer:validationError', ({fieldName}))
    }
  }

  clearCustomerData(): void {
    this.customerData = {
      payment: null,
      address: "",
      email: "",
      phone: "",
    };
  }

  checkOrder() {
    const isValid = !!(this.customerData.payment && this.customerData.address);
    return isValid
  }
}
