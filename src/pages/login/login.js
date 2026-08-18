import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';

export default function mostrarLogin() {

    console.log("🐱 1. mostrarLogin() se ejecutó");

    const main = document.querySelector("main");

    console.log("🐱 2. main encontrado:", main);

    main.innerHTML = `
        <div>
            <h2>Iniciar Sesión</h2>

            <input
                type="email"
                id="correo"
                placeholder="Correo electrónico"
            />

            <input
                type="password"
                id="contrasena"
                placeholder="Contraseña"
            />

            <button id="btnLogin" type="button">
                Ingresar
            </button>
        </div>
    `;

const boton = document.getElementById("btnLogin");

console.log("🐱 4. Botón encontrado:", boton);

boton.onclick = () => {
    console.log("🐱💥 ONCLICK FUNCIONA");
};

boton.addEventListener("click", async () => {

    console.log("🐱 5. SE HIZO CLICK EN INGRESAR");

    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
    

        console.log("🐱 6. Datos obtenidos");
        console.log("📧 Correo:", correo);
        console.log("🔑 Contraseña:", contrasena);

        try {

            console.log("🐱 7. Intentando iniciar sesión...");

            const credencial = await signInWithEmailAndPassword(
                auth,
                correo,
                contrasena
            );

            console.log("🐱 8. LOGIN EXITOSO");
            console.log("👤 Usuario:", credencial.user);

            window.location.reload();

        } catch (error) {

            console.error("🐱 ❌ 9. ERROR EN LOGIN");
            console.error(error);
            console.error("Código:", error.code);
            console.error("Mensaje:", error.message);

            alert("Error al iniciar sesión: " + error.message);
        }
    });
}