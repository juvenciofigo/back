import { MongooseAddressRepository } from "../repositories/mongoose-address-repository-interface.js";
import { GetAddressAdminService } from "../services/get-address-admin-service.js";

export function makeGetAddressAdmin() {
    const mongooseAddressRepository = new MongooseAddressRepository();
    const getAddressAdminService = new GetAddressAdminService(mongooseAddressRepository);
    return getAddressAdminService;
}
