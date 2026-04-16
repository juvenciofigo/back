import { BaseError } from "src/shared/BaseError.js";
import { ICustomer, ICustomerRepository, IUserRepository, IUser } from "../index.js";

export interface IGetCustomerRequest {
    userId: string;
}

export class GetCustumerService {
    constructor(
        private customerRepository: ICustomerRepository,
        private userRepository: IUserRepository,
    ) { }

    async execute(data: IGetCustomerRequest): Promise<ICustomer | null> {
        const user: IUser | null = await this.userRepository.getUser({ userId: data.userId });

        if (!user || user.deleted || user.customer) {
            throw new BaseError("Invalid Data", 400);
        }

        const customer: ICustomer | null = await this.customerRepository.getCustomer({ customerId: user.customer });

        if (!customer) {
            throw new BaseError("Failed to get customer", 500);
        }

        return customer;
    }
}