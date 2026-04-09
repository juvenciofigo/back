import { IAddressRepository, IAddress } from "../index.js";
import { BaseError } from "src/shared/BaseError.js";

interface IDeleteAddressRequest {
    addressId: string;
}

export class DeleteAddressService {
    constructor(private addressRepository: IAddressRepository) {}

    async execute({ addressId }: IDeleteAddressRequest): Promise<boolean> {
        const existing: IAddress | null = await this.addressRepository.getAddress({ _id: addressId, deleted: false });

        if (!existing) {
            throw new BaseError("Address Not Found!", 404);
        }

        const deleted: boolean = await this.addressRepository.deleteAddress(addressId);

        if (!deleted) {
            throw new BaseError("Failed to delete address", 500);
        }

        return true;
    }
}
