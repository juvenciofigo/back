// Controllers
export * from "./controllers/create-product-controller.js";
export * from "./controllers/update-product-controller.js";
export * from "./controllers/fetch-products-controller.js";
export * from "./controllers/get-product-controller.js";
export * from "./controllers/search-products-controller.js";

export * from "./controllers/fetch-brands-controller.js";
export * from "./controllers/create-brand-controller.js";

// Service
export * from "./services/create-product-service.js";
export * from "./services/update-product-service.js";
export * from "./services/fetch-products-service.js";
export * from "./services/get-product-service.js";
export * from "./services/search-products-service.js";
export * from "./services/trackProductView.js";

export * from "./services/fetch-brands-service.js";
export * from "./services/create-brand-service.js";
export * from "../category/sub_category/services/add-product-to-sub_category-service.js";

// Factories
export * from "./factories/make-create-product.js";
export * from "./factories/make-update-product.js";
export * from "./factories/make-fetch-products.js";
export * from "./factories/make-get-product.js";
export * from "./factories/make-search-products.js";
export * from "./factories/make-track-product-view.js";

export * from "./factories/make-fetch-brands.js";
export * from "./factories/make-create-brand.js";

// Validators
export * from "../../shared/validators/is-auth-validator.js";
export * from "../../shared/validators/is-admin-validator.js";

export * from "./validators/create-product-validator.js";
export * from "./validators/get-product-validator.js";
export * from "./validators/update-product-validator.js";
export * from "./validators/search-products-validator.js";
export * from "./validators/fetch-products-validator.js";

export * from "./validators/create-brand-validator.js";
export * from "./validators/fetch-brands-validator.js";

// Errors

// Interface
export * from "./interfaces/product-interface-repository.js";
export * from "./interfaces/brand-interface-repository.js";
export * from "./interfaces/product-interface-model.js";
export * from "./model/Brand-Model.js";
export * from "../variation/model/variation-model-interface.js";

// Models
export * from "./model/Product-Model.js";
export * from "./model/Brand-Model.js";
export * from "../variation/model/Variation-Model.js";
export * from "./model/Products-Views-Model.js";

// Repository
export * from "./interfaces/product-interface-repository.js";
export * from "./interfaces/brand-interface-repository.js";
export * from "./repositories/mongoose-product-repository.js";
export * from "./repositories/mongoose-brand-repository.js";

// Shared
export * from "../category/index.js";

// utils
export * from "../../shared/utils/multer.js";
export * from "../../shared/utils/firebase.js";
