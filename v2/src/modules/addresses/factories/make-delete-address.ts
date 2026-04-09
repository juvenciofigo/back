import { MongooseAddressRepository } from "../repositories/mongoose-address-repository-interface.js";
import { DeleteAddressService } from "../services/delete-address-service.js";

export function makeDeleteAddress() {
    const mongooseAddressRepository = new MongooseAddressRepository();
    const deleteAddressService = new DeleteAddressService(mongooseAddressRepository);
    return deleteAddressService;
}
