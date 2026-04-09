import { MongooseAddressRepository } from "../repositories/mongoose-address-repository-interface.js";
import { FetchAddressesAdminService } from "../services/fetch-addresses-admin-service.js";

export function makeFetchAddressesAdmin() {
    const mongooseAddressRepository = new MongooseAddressRepository();
    const fetchAddressesAdminService = new FetchAddressesAdminService(mongooseAddressRepository);
    return fetchAddressesAdminService;
}
