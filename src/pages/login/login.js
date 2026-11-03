import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';
import kodiMascot from '../../../assets/images/kodicode-mascot.png';
import './style.css';

// Errores de Firebase Auth en español
function mensajeError(error, porDefecto = 'No se pudo iniciar sesión. Inténtalo de nuevo.') {
    switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            return 'Correo o contraseña incorrectos.';
        case 'auth/invalid-email':
            return 'Escribe un correo válido.';
        case 'auth/user-disabled':
            return 'Esta cuenta está deshabilitada.';
        case 'auth/too-many-requests':
            return 'Demasiados intentos. Espera un momento e inténtalo otra vez.';
        case 'auth/network-request-failed':
            return 'No hay conexión. Revisa tu internet.';
        default:
            return porDefecto;
    }
}

export default function mostrarLogin() {
    const main = document.querySelector('main');

    main.innerHTML = `
        <div class="login-page">
            <div class="login-card">
                <h2>Iniciar Sesión</h2>

                <input
                    type="email"
                    id="correo"
                    placeholder="Correo electrónico"
                    autocomplete="email"
                />

                <input
                    type="password"
                    id="contrasena"
                    placeholder="Contraseña"
                    autocomplete="current-password"
                />

                <p class="login-message" id="mensajeLogin" role="status"></p>

                <button id="btnLogin" type="button">
                    Ingresar
                </button>

                <button id="btnOlvide" type="button" class="link-btn">
                    ¿Olvidaste tu contraseña?
                </button>
            </div>
        </div>
    `;

    const mensaje = document.getElementById('mensajeLogin');
    const decir = (texto, ok = false) => {
        mensaje.textContent = texto;
        mensaje.classList.toggle('ok', ok);
    };

    // --- Iniciar sesión ---
    const boton = document.getElementById('btnLogin');

    boton.addEventListener('click', async () => {
        const correo = document.getElementById('correo').value.trim();
        const contrasena = document.getElementById('contrasena').value;

        if (!correo || !contrasena) {
            decir('Escribe tu correo y tu contraseña.');
            return;
        }

        boton.disabled = true;
        decir('');

        try {
            await signInWithEmailAndPassword(auth, correo, contrasena);
            window.location.reload();
        } catch (error) {
            console.error('Código:', error.code);
            decir(mensajeError(error));
            boton.disabled = false;
        }
    });

    // --- Olvidé mi contraseña ---
    document.getElementById('btnOlvide').addEventListener('click', async () => {
        const correo = document.getElementById('correo').value.trim();

        if (!correo) {
            decir('Escribe tu correo arriba y toca de nuevo "¿Olvidaste tu contraseña?".');
            return;
        }

        try {
            auth.languageCode = 'es'; // el correo de Firebase llega en español
            await sendPasswordResetEmail(auth, correo);

            // Mensaje genérico: no se revela si el correo existe o no
            decir('Si ese correo está registrado, te enviamos un enlace para crear una contraseña nueva. Revisa también la carpeta de spam.', true);
        } catch (error) {
            console.error('Código:', error.code);
            decir(mensajeError(error, 'No se pudo enviar el correo. Inténtalo de nuevo.'));
        }
    });
}