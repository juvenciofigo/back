const mongoose = require("mongoose");

// Definindo o schema da visita
const VisitsSchema = new mongoose.Schema(
  {
    VisitsCout: {
      type: Number,
      default: 0, // Define o valor inicial como 0
    },
  },
  { timestamps: true } // Cria automaticamente os campos createdAt e updatedAt
);

// Middleware que será executado antes de salvar uma nova visita
VisitsSchema.pre('save', function(next) {
  // Incrementa o valor do contador sempre que um novo documento for salvo
  this.VisitsCout += 1;
  next();
});

// Exporta o modelo Visita
module.exports = mongoose.model("Visit", VisitsSchema, "visits");
