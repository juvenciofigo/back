import { IAddressRepository, IAddress } from "../index.js";
import { BaseError } from "src/shared/BaseError.js";

interface IGetAddressRequest {
    addressId: string;
}

export class GetAddressAdminService {
    constructor(private addressRepository: IAddressRepository) { }

    async execute({ addressId }: IGetAddressRequest): Promise<IAddress | null> {
        const address: IAddress | null = await this.addressRepository.getAddress({ _id: addressId });

        if (!address) {
            throw new BaseError("Address Not Found!", 404);
        }

        return address;
    }
}
