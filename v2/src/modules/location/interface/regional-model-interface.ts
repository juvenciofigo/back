import { Document, Types } from "mongoose";

export interface IRegion extends Document {
    name: string;
    availability: boolean;
}

export interface IProvince extends Document {
    name: string;
    region: Types.ObjectId; // Referência à Região
    availability: boolean;
}

export interface ICity extends Document {
    name: string;
    province: Types.ObjectId; // Referência à Província
    availability: boolean;
}

export interface IToll extends Document {
    name: string;             // Ex: 'Portagem da Circular', 'Portagem de Marracuene'
    prices: {
        motorcycle: number;   // Taxa para motociclos (Classe 1, se isento = 0)
        lightVehicle: number; // Taxa para carros ligeiros/vans (Classe 1 ou 2)
        heavyVehicle: number; // Taxa para camiões (Classe 3 ou superior)
    };
    availability: boolean;
}

export interface INeighborhood extends Document {
    name: string;
    city: Types.ObjectId;     // Referência à Cidade
    zone: Types.ObjectId;     // Zona de base da transportadora local
    hasToll: boolean;
    tolls: Types.ObjectId[];  // Referências para múltiplas portagens (IToll)
    availability: boolean;
}

export interface ICarrierTerminal extends Document {
    name: string;             // Ex: 'Terminal Etrago - Xai-Xai'
    carrierName: string;      // Ex: 'Etrago', 'Nagi Investimentos'
    city: Types.ObjectId;     // Referência à Cidade onde fica o terminal
    baseTax: number;          // Taxa de emissão de guia/documentação (opcional, comummente fixa ou zero)
    pricePerKg: number;       // Cobrança por cada Kg da encomenda
    estimatedDelivery: string;// Ex: '24-48h', '2-5 dias úteis'
    availability: boolean;
}

export interface IShippingZone extends Document {
    name: string;             // Ex: 'Z1', 'MATOLA_CENTRO', 'GAZA_INTERIOR'
    baseTax: number;          // Taxa para o veículo padrão (Classe 1)
    pricePerKg: number;       // Adicional por peso
    estimatedDelivery: string; // Ex: '24h', '3-5 dias'
    description?: string;
    availability: boolean;
}
