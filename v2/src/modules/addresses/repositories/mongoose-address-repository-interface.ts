import { AddressModel, IAddress, IAddressRepository } from "../index.js";
import { ResponsePaginate } from "src/shared/interface.js";

export class MongooseAddressRepository implements IAddressRepository {
    async createAddress(address: Partial<IAddress>): Promise<IAddress | null> {
        return await AddressModel.create(address);
    }

    async updateAddress(addressId: string, address: Partial<IAddress>): Promise<IAddress | null> {
        return await AddressModel.findByIdAndUpdate(addressId, address, { new: true });
    }

    async deleteAddress(addressId: string): Promise<boolean> {
        const deleted: IAddress | null = await AddressModel.findByIdAndUpdate(
            addressId,
            { deleted: true },
            { new: true }
        );
        return !!deleted;
    }

    async getAddress(query: any): Promise<IAddress | null> {
        return await AddressModel.findOne(query);
    }

    async fetchAddresses(query: any, options: any): Promise<ResponsePaginate<IAddress>> {
        return await (AddressModel as any).paginate(query, options);
    }
}