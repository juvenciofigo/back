const { Products } = require("../models/Products/Products");
const Deliveries = require("../models/Deliveries");

class DeliveryController {
    async deliveryShow(req, res, next) {
        try {
            console.log(req,res);
            
        } catch (error) {
            // Trata erros, repassando para o middleware de erro
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            console.log(req,res);
        } catch (error) {
            // Trata erros, repassando para o middleware de erro
            next(error);
        }
    }
    async calcucate(req, res, next) {
        try {
            console.log(req,res, Products,Deliveries);
        } catch (error) {
            // Trata erros, repassando para o middleware de erro
            next(error);
        }
    }
}

module.exports = new DeliveryController();
