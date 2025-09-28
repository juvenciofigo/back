import mongoose, { Document, Schema, Model } from "mongoose";

interface IVisita extends Document {
    VisitaCount: number;
}

const VisitaSchema = new Schema<IVisita>(
    {
        VisitaCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Middleware que será executado antes de salvar uma nova visita
VisitaSchema.pre("save", function (next) {
    // Incrementa o valor do contador sempre que um novo documento for salvo
    this.VisitaCount += 1;
    next();
});

const Visita: Model<IVisita> = mongoose.models.Visita || mongoose.model<IVisita>("Visita", VisitaSchema);

export default Visita;
