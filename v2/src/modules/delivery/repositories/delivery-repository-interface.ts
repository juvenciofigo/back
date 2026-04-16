import { ResponsePaginate } from "src/shared/interface.js";
import { IDelivery, } from "../index.js"

export interface IDeliveryRepository {
    createDelivery(data: Partial<IDelivery>, options?: any): Promise<IDelivery | null>;
    updateDelivery(deliveryId: string, update: Partial<IDelivery>, options?: any): Promise<IDelivery | null>;
    deleteDelivery(deliveryId: string): Promise<boolean>;

    getDelivery(query: any, options: any): Promise<IDelivery | null>;
    fetchDeliveries(query: any, options: any): Promise<ResponsePaginate<IDelivery>>;
}