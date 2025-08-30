import { ICustomer } from "../../types";

export class Customer {
  protected customerData: ICustomer = {
    payment: null,
    address: "",
    email: "",
    phone: "",
  };

  setField(fieldName: "address" | "email" | "phone", value: string): this {
    if (this.validateValueNotEmpty(value.trim())) {
      this.customerData[fieldName] = value;
    }
    return this;
  }

  setPaymentMethod(value: "cash" | "card"): this {
    if (this.validatePaymentMethod(value)) {
      this.customerData.payment = value;
      return this;
    } else {
      throw new Error("Выберите оплату наличными или картой");
    }
  }

  validatePaymentMethod(value: "cash" | "card"): boolean {
    return value === "cash" || value === "card";
  }

  getCustomerData(): ICustomer {
    return this.customerData;
  }

  validateValueNotEmpty(value: string): boolean {
    if (value) {
      return Boolean(value);
    } else {
      throw new Error("Поле не может быть пустым");
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
}
