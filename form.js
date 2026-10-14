import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

// Configuración de Firebase
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Evento enviar formulario
document.getElementById("form").addEventListener("submit", async function(e){

    e.preventDefault();

    let DNI = document.getElementById("DNI").value;
    let apellido = document.getElementById("Apellido").value;
    let nombre = document.getElementById("Nombre").value;
    let email = document.getElementById("email").value;
    let telefono = document.getElementById("Telefono").value;
    let localidad = document.getElementById("localidad").value;
    let provincia = document.getElementById("Provincia").value;
    let fecha = document.getElementById("fecha-nacimiento").value;

  // Obtener valores de radio buttons (agregamos el || null para evitar el undefined)
    let talle = document.querySelector('input[name="talle"]:checked')?.id || null;
    let distancia = document.querySelector(
    'input[name="Distancia"]:checked'
    )?.value;

    // Validación básica
    if(!DNI || !apellido || !nombre || !talle || !email){
        alert("Por favor completa todos los campos obligatorios");
        return;
    }

    try {
        // Guardar en Firebase (espera a que termine)
        await push(ref(db, "inscripciones"), {
            DNI,
            apellido,
            nombre,
            email,
            telefono,
            localidad,
            provincia,
            fechaNacimiento: fecha,
            talle,
            distancia
        });

        // Redirigir a la página de pago
        window.location.href = "pago/p1.html";


} catch (error) {
    console.error("Error completo:", error);
    console.error("Código:", error.code);
    console.error("Mensaje:", error.message);

    alert(
        "Error al enviar: " +
        (error.code || error.message || error)
    );
}


});
