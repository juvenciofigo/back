import { ResponsePaginate } from "src/shared/interface.js";
import { IAddress } from "../index.js";

export interface IAddressRepository {
    // Admin
    createAddress(address: Partial<IAddress>): Promise<IAddress | null>;
    updateAddress(addressId: string, address: Partial<IAddress>): Promise<IAddress | null>;
    deleteAddress(addressId: string): Promise<boolean>;

    // Public
    getAddress(query: any): Promise<IAddress | null>;
    fetchAddresses(query: any, options: any): Promise<ResponsePaginate<IAddress>>;
}