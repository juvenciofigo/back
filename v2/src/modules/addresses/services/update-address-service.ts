import { IAddressRepository, IAddress } from "../index.js";
import { BaseError } from "src/shared/BaseError.js";

interface IUpdateAddressRequest {
    addressId: string;
    complete?: string;
    city?: string;
    province?: string;
    neighborhood?: string;
    reference?: string;
    note?: string;
    cellNumber?: string;
}

export class UpdateAddressService {
    constructor(private addressRepository: IAddressRepository) {}

    async execute({ addressId, ...data }: IUpdateAddressRequest): Promise<IAddress | null> {
        const existing: IAddress | null = await this.addressRepository.getAddress({ _id: addressId, deleted: false });

        if (!existing) {
            throw new BaseError("Address Not Found!", 404);
        }

        const update: Partial<IAddress> = {};

        if (data.complete) update.complete = data.complete;
        if (data.city) update.city = data.city as any;
        if (data.province) update.province = data.province as any;
        if (data.neighborhood) update.neighborhood = data.neighborhood as any;
        if (data.reference !== undefined) update.reference = data.reference;
        if (data.note !== undefined) update.note = data.note;
        if (data.cellNumber) update.cellNumber = data.cellNumber;

        const address: IAddress | null = await this.addressRepository.updateAddress(addressId, update);

        if (!address) {
            throw new BaseError("Failed to update address", 500);
        }

        return address;
    }
}
