import { MongooseAddressRepository } from "../repositories/mongoose-address-repository-interface.js";
import { UpdateAddressService } from "../services/update-address-service.js";

export function makeUpdateAddress() {
    const mongooseAddressRepository = new MongooseAddressRepository();
    const updateAddressService = new UpdateAddressService(mongooseAddressRepository);
    return updateAddressService;
}
