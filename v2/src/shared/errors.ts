import { BaseError } from "./BaseError.js";

/// ==== USUÁRIO & AUTENTICAÇÃO ====
export class UserAlreadyExistsError extends BaseError {
    constructor() {
        super("Email already exists", 409); // Conflict
    }
}
export interface MongoError extends BaseError {
    code?: number;
    keyValue?: Record<string, unknown>;
}


export class UserNotFoundError extends BaseError {
    constructor() {
        super("User not found", 404);
    }
}

export class InvalidPasswordError extends BaseError {
    constructor() {
        super("Invalid password", 401); // Unauthorized
    }
}

export class InvalidTokenError extends BaseError {
    constructor() {
        super("Invalid or expired token", 401);
    }
}

export class UnauthorizedError extends BaseError {
    constructor() {
        super("Unauthorized access", 401);
    }
}

export class ForbiddenError extends BaseError {
    constructor() {
        super("You do not have permission to perform this action", 403);
    }
}

export class InvalidCredencialsError extends BaseError {
    constructor() {
        super("Invalid Credentials", 401);
    }
}

// ==== PRODUTOS ====
export class ProductNotFoundError extends BaseError {
    constructor() {
        super("Product not found", 404);
    }
}

export class OutOfStockError extends BaseError {
    constructor() {
        super("Product is out of stock", 409); // Conflict
    }
}

export class InvalidProductError extends BaseError {
    constructor() {
        super("Invalid product data", 400); // Bad Request
    }
}

// ==== CARRINHO ====
export class CartEmptyError extends BaseError {
    constructor() {
        super("Cart is empty", 400);
    }
}

export class CartItemNotFoundError extends BaseError {
    constructor() {
        super("Item not found in cart", 404);
    }
}
export class CartNotFoundError extends BaseError {
    constructor() {
        super("Cart not found", 404);
    }
}

// ==== PEDIDOS ====
export class OrderNotFoundError extends BaseError {
    constructor() {
        super("Order not found", 404);
    }
}

export class InvalidOrderStatusError extends BaseError {
    constructor() {
        super("Invalid order status transition", 400);
    }
}

// ==== PAGAMENTOS ====
export class PaymentFailedError extends BaseError {
    constructor() {
        super("Payment failed", 402); // Payment Required
    }
}

export class InvalidPaymentMethodError extends BaseError {
    constructor() {
        super("Invalid payment method", 400);
    }
}

// ==== BANCO / VALIDAÇÃO ====
export class DatabaseError extends BaseError {
    constructor() {
        super("Database error", 500);
    }
}

export class ValidationError extends BaseError {
    constructor(message: string) {
        super(message, 400);
    }
}
