import { MongooseAddressRepository } from "../repositories/mongoose-address-repository-interface.js";
import { CreateAddressService } from "../services/create-address-service.js";
import { MongooseUserRepository } from "../../user/index.js";
import { RegionalRepository } from "../../location/index.js";

export function makeCreateAddress() {
    const addressRepository = new MongooseAddressRepository();
    const userRepository = new MongooseUserRepository();
    const regionalRepository = new RegionalRepository();

    return new CreateAddressService(addressRepository, userRepository, regionalRepository);
}
