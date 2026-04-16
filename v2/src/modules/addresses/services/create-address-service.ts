import { Types } from "mongoose";
import { BaseError } from "src/shared/BaseError.js";
import { IAddressRepository, IAddress, IUserRepository, IUser, ICreateAddressRequest, IRegionalRepository, INeighborhood, ICity, IProvince } from "../index.js";

export class CreateAddressService {
    constructor(
        private addressRepository: IAddressRepository,
        private userRepository: IUserRepository,
        private regionalRepository: IRegionalRepository
    ) {}

    async execute(data: ICreateAddressRequest): Promise<IAddress | null> {
        const user: IUser | null = await this.userRepository.getUser({ userId: data.userId });

        if (!user) {
            throw new BaseError("User not found", 404);
        }

        if (!user.customer) {
            throw new BaseError("Complete your profile to create an address", 404);
        }

        const neighborhood: INeighborhood | null = await this.regionalRepository.getNeighborhood({ _id: data.neighborhood });

        if (!neighborhood) {
            throw new BaseError("Neighborhood not found", 404);
        }

        if (neighborhood.city.toString() !== data.city) {
            throw new BaseError("City not found or mismatch", 404);
        }

        const city: ICity | null = await this.regionalRepository.getCity({ _id: neighborhood.city });
        if (!city) {
            throw new BaseError("City not found", 404);
        }

        if (city.province.toString() !== data.province) {
            throw new BaseError("Province not found or mismatch", 404);
        }

        const province: IProvince | null = await this.regionalRepository.getProvince({ _id: city.province });
        if (!province) {
            throw new BaseError("Province not found", 404);
        }

        const newAddress: Partial<IAddress> = {
            customer: user.customer,
            complete: data.complete,
            city: city._id as Types.ObjectId,
            province: province._id as Types.ObjectId,
            neighborhood: neighborhood._id as Types.ObjectId,
            cellNumber: data.cellNumber,
        };

        if (data.reference) {
            newAddress.reference = data.reference;
        }

        if (data.note) {
            newAddress.note = data.note;
        }

        return await this.addressRepository.createAddress(newAddress);
    }
}
