const API = "http://localhost:3000/eventos";

const mensaje = document.getElementById("mensaje");

function mostrarMensaje(texto, tipo = "info") {
    mensaje.textContent = texto;
    mensaje.className = tipo;
}

// Cargar eventos al iniciar
document.addEventListener("DOMContentLoaded", obtenerEventos);

// Obtener eventos
async function obtenerEventos() {
    try {
        const res = await fetch(API);
        if (!res.ok) {
            throw new Error("No se pudieron cargar los eventos");
        }

        const data = await res.json();
        const lista = document.getElementById("listaEventos");
        lista.innerHTML = "";

        data.data.forEach(evento => {
            const div = document.createElement("div");
            div.classList.add("evento");

            div.innerHTML = `
                <h3>${evento.titulo}</h3>
                <p>${evento.descripcion || ""}</p>
                <p><b>Fecha:</b> ${new Date(evento.fecha).toLocaleDateString("es-ES")}</p>
                <p><b>Ubicación:</b> ${evento.ubicacion || ""}</p>
                <p><b>Categoría:</b> ${evento.categoria || "Social"}</p>
            `;

            lista.appendChild(div);
        });
    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}

// Crear evento
document.getElementById("formEvento").addEventListener("submit", async (e) => {
    e.preventDefault();

    const evento = {
        titulo: document.getElementById("titulo").value,
        descripcion: document.getElementById("descripcion").value,
        fecha: document.getElementById("fecha").value,
        ubicacion: document.getElementById("ubicacion").value,
        categoria: document.getElementById("categoria").value || undefined
    };

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(evento)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || data.mensaje || "No se pudo crear el evento");
        }

        e.target.reset();
        mostrarMensaje(data.mensaje || "Evento creado correctamente", "success");
        obtenerEventos();
    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
});