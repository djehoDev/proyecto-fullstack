const express = require("express");
const router = express.Router();
const Evento = require("../models/evento.model");

// Crear evento POST
router.post("/", async (req, res) => {
    try {
        const datosEvento = {
            ...req.body,
            categoria: req.body.categoria?.trim() || undefined
        };

        const nuevoEvento = new Evento(datosEvento);
        const eventoGuardado = await nuevoEvento.save();
        res.status(201).json({
            mensaje: "Evento creado correctamente",
            data: eventoGuardado
        });

    } catch (error) {
        res.status(400).json({
            mensaje: "Error al crear evento",
            error: error.message
        });
    }
});

// Obtener todos los eventos GET
router.get("/", async (req, res) => {
    try {
        const filtros = req.query;
        const eventos = await Evento.find(filtros).sort({ fecha: 1 });
        res.json({
            mensaje: "Eventos obtenidos correctamente",
            data: eventos
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener eventos",
            error: error.message
        });
    }
});

// Obtener un evento por ID GET
router.get("/:id", async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.id);
        if (!evento) {
            return res.status(404).json({
                mensaje: "Evento no encontrado"
            });
        }

        res.json({
            mensaje: "Evento encontrado",
            data: evento
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al buscar evento",
            error: error.message
        });
    }
});

// Actualizar evento PUT
router.put("/:id", async (req, res) => {
    try {
        const eventoActualizado = await Evento.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!eventoActualizado) {
            return res.status(404).json({
                mensaje: "Evento no encontrado"
            });
        }

        res.json({
            mensaje: "Evento actualizado correctamente",
            data: eventoActualizado
        });

    } catch (error) {
        res.status(400).json({
            mensaje: "Error al actualizar evento",
            error: error.message
        });
    }
});

// Eliminar evento DELETE
router.delete("/:id", async (req, res) => {
    try {
        const eventoEliminado = await Evento.findByIdAndDelete(req.params.id);

        if (!eventoEliminado) {
            return res.status(404).json({
                mensaje: "Evento no encontrado"
            });
        }

        res.json({
            mensaje: "Evento eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar evento",
            error: error.message
        });
    }
});

module.exports = router;