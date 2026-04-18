const mongoose = require("mongoose");

const eventoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    fecha: {
        type: Date,
        required: true
    },
    ubicacion: {
        type: String,
        required: true,
        trim: true
    },
    categoria: {
        type: String,
        enum: ["Música", "Deporte", "Cultura", "Social"],
        default: "Social"
    }
});

module.exports = mongoose.model("Evento", eventoSchema);