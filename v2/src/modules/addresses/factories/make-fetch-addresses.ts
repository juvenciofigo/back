import { MongooseAddressRepository } from "../repositories/mongoose-address-repository-interface.js";
import { FetchAddressesService } from "../services/fetch-addresses-service.js";

export function makeFetchAddresses() {
    const mongooseAddressRepository = new MongooseAddressRepository();
    const fetchAddressesService = new FetchAddressesService(mongooseAddressRepository);
    return fetchAddressesService;
}
