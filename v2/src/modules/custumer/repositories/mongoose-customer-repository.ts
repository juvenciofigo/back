import { ICustomerRepository } from "./customer-repository-interface.js";
import { CustomerModel } from "../model/Customer-Model.js";
import { ICustomer } from "../model/customer-model-interface.js";
import { ResponsePaginate } from "src/shared/interface.js";

export class MongooseCustomerRepository implements ICustomerRepository {
    async createCustomer(customer: ICustomer): Promise<ICustomer | null> {
        return await CustomerModel.create(customer);
    }

    async updateCustomer(customerId: string, update: Partial<ICustomer>): Promise<ICustomer | null> {
        return await CustomerModel.findByIdAndUpdate(
            customerId,
            { $set: update },
            {
                new: true,
                runValidators: true
            }
        );
    }

    async deleteCustomer(customerId: string): Promise<boolean> {
        const deleted: ICustomer | null = await CustomerModel.findByIdAndDelete(customerId);
        return !!deleted;
    }

    async getCustomer(query: any): Promise<ICustomer | null> {
        return await CustomerModel.findOne(query);
    }

    async fetchCustomers(query: any, options: any): Promise<ResponsePaginate<ICustomer>> {
        return await CustomerModel.paginate(query, options);
    }

    async addAddressToCustomer(customerId: string, addressId: string | string[]): Promise<ICustomer | null> {
        return await CustomerModel.findByIdAndUpdate(
            customerId,
            {
                $addToSet: {
                    addresses: {
                        $each: Array.isArray(addressId) ? addressId : [addressId],
                    },
                },
            },
            { new: true }
        );
    }

    async removeAddressFromCustomer(customerId: string, addressId: string | string[]): Promise<ICustomer | null> {
        return await CustomerModel.findByIdAndUpdate(
            customerId,
            {
                $pull: {
                    addresses: {
                        $in: Array.isArray(addressId) ? addressId : [addressId],
                    },
                },
            },
            { new: true }
        );
    }

    async setDefaultAddress(customerId: string, addressId: string): Promise<ICustomer | null> {
        return await CustomerModel.findByIdAndUpdate(
            customerId,
            { $set: { defaultAddress: addressId } },
            { new: true }
        );
    }
}