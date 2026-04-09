import { MongooseAddressRepository } from "../repositories/mongoose-address-repository-interface.js";
import { GetAddressService } from "../services/get-address-service.js";

export function makeGetAddress() {
    const mongooseAddressRepository = new MongooseAddressRepository();
    const getAddressService = new GetAddressService(mongooseAddressRepository);
    return getAddressService;
}
