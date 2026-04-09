import { Document } from "mongoose";

export interface IShippingRate extends Document {
    zone: string;
    vehicleClass: 1 | 2 | 3 | 4;
    basePrice: number;
    pricePerKg: number;
    minWeight: number;
    estimatedDays: string;
}