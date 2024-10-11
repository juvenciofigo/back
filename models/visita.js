const mongoose = require("mongoose");

// Definindo o schema da visita
const VisitaSchema = new mongoose.Schema(
    {
        VisitaCount: {
            type: Number,
            default: 0, // Define o valor inicial como 0
        },
    },
    { timestamps: true } // Cria automaticamente os campos createdAt e updatedAt
);

// Middleware que será executado antes de salvar uma nova visita
VisitaSchema.pre("save", function (next) {
    // Incrementa o valor do contador sempre que um novo documento for salvo
    this.VisitaCount += 1;
    next();
});

// Exporta o modelo Visita
module.exports = mongoose.model("Visita", VisitaSchema, "visitas");
