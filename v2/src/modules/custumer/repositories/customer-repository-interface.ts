import { ICustomer } from "../model/customer-model-interface.js";
import { ResponsePaginate } from "src/shared/interface.js";

export interface ICustomerRepository {
    createCustomer(customer: Partial<ICustomer>): Promise<ICustomer | null>;
    updateCustomer(customerId: string, update: Partial<ICustomer>): Promise<ICustomer | null>;
    deleteCustomer(customerId: string): Promise<boolean>;
    getCustomer(query: any): Promise<ICustomer | null>;
    fetchCustomers(query: any, options: any): Promise<ResponsePaginate<ICustomer>>;
    addAddressToCustomer(customerId: string, addressId: string | string[]): Promise<ICustomer | null>;
    removeAddressFromCustomer(customerId: string, addressId: string | string[]): Promise<ICustomer | null>;
    setDefaultAddress(customerId: string, addressId: string): Promise<ICustomer | null>;
}