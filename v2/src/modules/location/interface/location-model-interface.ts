import { Document } from "mongoose";

export interface ILocation extends Document {
    province: string;
    region: 'SUL' | 'CENTRO' | 'NORTE';
    district: string;
    neighborhood: string;
    zone: string; // Ex: 'Z1', 'Z2', 'NACIONAL_NORTE'
    hasToll: boolean;
    tollType?: string;
}

interface IShippingRate extends Document {
    zone: string;
    vehicleClass: 1 | 2 | 3 | 4;
    basePrice: number;
    pricePerKg: number;
    minWeight: number;
    estimatedDays: string;
}