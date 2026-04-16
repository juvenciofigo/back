import { BaseError } from "src/shared/BaseError.js";
import { ICustomer, ICustomerRepository, IUserRepository, ICreateCustomerRequest, IUser } from "../index.js";

export class CreateCustomerService {
    constructor(
        private customerRepository: ICustomerRepository,
        private userRepository: IUserRepository,
    ) { }

    async execute(data: ICreateCustomerRequest): Promise<ICustomer | null> {
        const user: IUser | null = await this.userRepository.getUser({ userId: data.userId });

        if (!user || user.deleted || user.customer) {
            throw new BaseError("Invalid Data", 400);
        }

        const newCustomer: Partial<ICustomer> = {
            user: user.id,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            gender: data.gender,
            birthDate: data.birthDate,
            nationality: data.nationality
        }

        const customer: ICustomer | null = await this.customerRepository.createCustomer(newCustomer);

        if (!customer) {
            throw new BaseError("Failed to create customer", 500);
        }

        await this.userRepository.updateUser(user.id, { customer: customer.id })

        return customer;
    }
}