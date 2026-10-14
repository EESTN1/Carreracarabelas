import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB-J8OshhWRK0gytGyTkWeVYieJaV3YCGw",
    authDomain: "carreracarabelas.firebaseapp.com",
    databaseURL: "https://carreracarabelas-default-rtdb.firebaseio.com/", 
    projectId: "carreracarabelas",
    storageBucket: "carreracarabelas.firebasestorage.app",
    messagingSenderId: "420866974634",
    appId: "1:420866974634:web:75535bf8f25f53ba29c1d3",
    measurementId: "G-PFVG60ZV72"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referencias al HTML
const lista5 = document.getElementById("lista5km");
const lista10 = document.getElementById("lista10km");
const listaBusqueda = document.getElementById("listaCorredores");
const buscador = document.getElementById("buscador");
const errorFirebase = document.getElementById("errorFirebase");

let datosCorredores = []; // Variable global para guardar lo que viene de Firebase

// --- 1. FUNCIÓN PARA CREAR ELEMENTOS (Fábrica de LI) ---
function crearFilaCorredor(id, datos) {
    const li = document.createElement("li");
    
    const texto = document.createElement("span");
    texto.textContent = `${datos.nombre} ${datos.apellido} | DNI: ${datos.DNI} | [Talle: ${datos.talle || 'S/N'}]`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = datos.pago || false;

    // Vinculación directa a Firebase
    checkbox.addEventListener("change", () => {
        update(ref(db, "inscripciones/" + id), {
            pago: checkbox.checked
        });
    });

    li.appendChild(texto);
    li.appendChild(checkbox);
    return li;
}

// --- 2. FUNCIÓN PARA DIBUJAR LAS LISTAS ---
function renderizarListas() {
    const filtro = buscador.value.toLowerCase().trim();

    // Limpiamos las tres listas antes de dibujar
    lista5.innerHTML = "";
    lista10.innerHTML = "";
    listaBusqueda.innerHTML = "";

    datosCorredores.forEach(corredor => {
        const { id, datos } = corredor;
        const nombreCompleto = `${datos.nombre} ${datos.apellido}`.toLowerCase();
        const dniString = datos.DNI ? datos.DNI.toString() : "";

        // Dibujar en listas generales (5km / 10km)
        const filaOriginal = crearFilaCorredor(id, datos);
        if (datos.distancia === "5KM") {
            lista5.appendChild(filaOriginal);
        } else if (datos.distancia === "10KM") {
            lista10.appendChild(filaOriginal);
        }

        // Dibujar en lista de buscador (si hay coincidencia)
        if (filtro !== "" && (nombreCompleto.includes(filtro) || dniString.includes(filtro))) {
            const filaBusqueda = crearFilaCorredor(id, datos);
            listaBusqueda.appendChild(filaBusqueda);
        }
    });
}

// --- 3. ESCUCHAR FIREBASE ---
onValue(ref(db, "inscripciones"), (snapshot) => {
    errorFirebase.hidden = true;
    datosCorredores = []; // Vaciamos el array local
    
    snapshot.forEach((childSnapshot) => {
        datosCorredores.push({
            id: childSnapshot.key,
            datos: childSnapshot.val()
        });
    });

    renderizarListas(); // Dibujamos todo apenas llegan datos
}, (error) => {
    console.error("No se pudieron cargar las inscripciones de Firebase:", error);
    errorFirebase.textContent = "No se pudieron cargar los corredores. Revisá la conexión y los permisos de Firebase.";
    errorFirebase.hidden = false;
});

// --- 4. ESCUCHAR EL BUSCADOR (INSTANTÁNEO) ---
buscador.addEventListener("input", renderizarListas);
