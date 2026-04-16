let eventoEditando = null;

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

        mostrarEventos(data.data);
            const div = document.createElement("div");
            div.classList.add("evento");

            div.innerHTML = `
                <h3>${evento.titulo}</h3>
                <p>${evento.descripcion || ""}</p>
                <p><b>Fecha:</b> ${new Date(evento.fecha).toLocaleDateString("es-ES")}</p>
                <p><b>Ubicación:</b> ${evento.ubicacion || ""}</p>
                <p><b>Categoría:</b> ${evento.categoria || "Social"}</p>

                <button onclick="eliminarEvento('${evento._id}')">
                    Eliminar
                </button>

                <button onclick='editarEvento(${JSON.stringify(evento)})'>
                    Editar
                </button>
            `;

            lista.appendChild(div);
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
        let res;

        if (eventoEditando) {
            res = await fetch(`${API}/${eventoEditando}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(evento)
            });

            eventoEditando = null;

        } else {
            res = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(evento)
            });
        }

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || data.mensaje || "Error al guardar evento");
        }

        e.target.reset();
        mostrarMensaje(data.mensaje || "Operación exitosa", "success");
        obtenerEventos();

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
});

async function eliminarEvento(id) {
    if (!confirm("¿Seguro que quiere eliminar este evento?")) return;

    await fetch(`${API}/${id}`, {
        method: "DELETE"
    });

    obtenerEventos();
}

function editarEvento(evento) {
    eventoEditando = evento._id;

    document.getElementById("titulo").value = evento.titulo;
    document.getElementById("descripcion").value = evento.descripcion;
    document.getElementById("fecha").value = evento.fecha.split("T")[0];
    document.getElementById("ubicacion").value = evento.ubicacion;
    document.getElementById("categoria").value = evento.categoria;
}

async function filtrarEventos() {
    const categoria = document.getElementById("filtroCategoria").value;
    const ubicacion = document.getElementById("filtroUbicacion").value;

    let url = API + "?";

    if (categoria) {
        url += `categoria=${encodeURIComponent(categoria)}&`;
    }

    if (ubicacion) {
        url += `ubicacion=${encodeURIComponent(ubicacion)}&`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();

        mostrarEventos(data.data);

    } catch (error) {
        mostrarMensaje("Error al filtrar eventos", "error");
    }
}

function limpiarFiltros() {
    document.getElementById("filtroCategoria").value = "";
    document.getElementById("filtroUbicacion").value = "";

    obtenerEventos();
}

function mostrarEventos(eventos) {
    const lista = document.getElementById("listaEventos");
    lista.innerHTML = "";

    eventos.forEach(evento => {
        const div = document.createElement("div");
        div.classList.add("evento");

        div.innerHTML = `
            <h3>${evento.titulo}</h3>
            <p>${evento.descripcion || ""}</p>
            <p><b>Fecha:</b> ${new Date(evento.fecha).toLocaleDateString("es-ES")}</p>
            <p><b>Ubicación:</b> ${evento.ubicacion || ""}</p>
            <p><b>Categoría:</b> ${evento.categoria || "Social"}</p>

            <button onclick="eliminarEvento('${evento._id}')">
                Eliminar
            </button>

            <button onclick='editarEvento(${JSON.stringify(evento)})'>
                Editar
            </button>
        `;

        lista.appendChild(div);
    });
}