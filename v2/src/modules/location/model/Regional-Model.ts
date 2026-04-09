import { Schema, model, Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IProvince, ICity, INeighborhood, IShippingZone, IRegion, IToll, ICarrierTerminal } from '../index.js';

const RegionSchema = new Schema<IRegion>({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['SUL', 'CENTRO', 'NORTE'],
    },
    availability: {
        type: Boolean,
        default: true
    }
});
RegionSchema.plugin(mongoosePaginate);

const ProvinceSchema = new Schema<IProvince>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    region: {
        type: Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    }
});
ProvinceSchema.plugin(mongoosePaginate);

const CitySchema = new Schema<ICity>({
    name: {
        type: String,
        required: true
    },
    province: {
        type: Schema.Types.ObjectId,
        ref: 'Province',
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    }
});
CitySchema.plugin(mongoosePaginate);

const TollSchema = new Schema<IToll>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    prices: {
        motorcycle: { type: Number, required: true },
        lightVehicle: { type: Number, required: true },
        heavyVehicle: { type: Number, required: true },
    },
    availability: {
        type: Boolean,
        default: true
    }
});
TollSchema.plugin(mongoosePaginate);

const NeighborhoodSchema = new Schema<INeighborhood>({
    name: {
        type: String,
        required: true
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    zone: {
        type: Schema.Types.ObjectId,
        ref: 'ShippingZone',
        required: true
    },
    hasToll: {
        type: Boolean,
        default: false
    },
    tolls: [{
        type: Schema.Types.ObjectId,
        ref: 'Toll'
    }],
    availability: {
        type: Boolean,
        default: true
    }
});
NeighborhoodSchema.plugin(mongoosePaginate);

const CarrierTerminalSchema = new Schema<ICarrierTerminal>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    carrierName: {
        type: String,
        required: true
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    baseTax: {
        type: Number,
        default: 0
    },
    pricePerKg: {
        type: Number,
        required: true
    },
    estimatedDelivery: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    }
});
CarrierTerminalSchema.plugin(mongoosePaginate);

const ShippingZoneSchema = new Schema<IShippingZone>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    baseTax: {
        type: Number,
        required: true
    },
    pricePerKg: {
        type: Number,
        default: 0
    },
    estimatedDelivery: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    availability: {
        type: Boolean,
        default: true
    }
});
ShippingZoneSchema.plugin(mongoosePaginate);


export const ProvinceModel = model<IProvince>('Province', ProvinceSchema);
export const CityModel = model<ICity>('City', CitySchema);
export const TollModel = model<IToll>('Toll', TollSchema);
export const CarrierTerminalModel = model<ICarrierTerminal>('CarrierTerminal', CarrierTerminalSchema);
export const NeighborhoodModel = model<INeighborhood>('Neighborhood', NeighborhoodSchema);
export const ShippingZoneModel = model<IShippingZone>('ShippingZone', ShippingZoneSchema);
export const RegionModel = model<IRegion>('Region', RegionSchema);