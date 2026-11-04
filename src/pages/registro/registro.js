import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig.js';
import { validarNombre } from '../../utils/filtroPalabras.js';
import kodiMascot from '../../../assets/images/kodicode-mascot.png';
import './style.css';

export default function mostrarRegistro() {
    const main = document.querySelector('main');

    if (!main) {
        console.error('No se encontró <main>');
        return;
    }

    main.innerHTML = `
        <div class="registro-container">
            <section class="registro">
                <h1>Crear cuenta</h1>

                <form id="registroForm">
                    <label for="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        placeholder="Tu nombre"
                        maxlength="24"
                        autocomplete="name"
                        required
                    >

                    <label for="email">Correo</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="correo@ejemplo.com"
                        autocomplete="email"
                        required
                    >

                    <label for="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Mínimo 6 caracteres"
                        autocomplete="new-password"
                        required
                    >

                    <button type="submit">Registrarse</button>
                </form>

                <p id="mensajeRegistro"></p>
            </section>
        </div>
    `;

    const form = document.querySelector('#registroForm');
    const mensaje = document.querySelector('#mensajeRegistro');
    const boton = form.querySelector('button[type="submit"]');

    // Muestra un mensaje; los errores van en rojo
    function decir(texto, esError = false) {
        mensaje.textContent = texto;
        mensaje.style.color = esError ? 'var(--red, #E63946)' : '';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.querySelector('#nombre').value.trim();
        const email = document.querySelector('#email').value.trim();
        const password = document.querySelector('#password').value;

        // Validaciones ANTES de crear la cuenta en Firebase
        const validacion = validarNombre(nombre);
        if (!validacion.ok) {
            decir(validacion.motivo, true);
            return;
        }

        if (password.length < 6) {
            decir('La contraseña debe tener al menos 6 caracteres.', true);
            return;
        }

        boton.disabled = true;
        decir('Creando cuenta...');

        try {
            const credencial = await createUserWithEmailAndPassword(auth, email, password);
            const usuario = credencial.user;

            await setDoc(doc(db, 'usuarios', usuario.uid), {
                nombre: validacion.nombre,
                email: email,
                uid: usuario.uid,
                fechaRegistro: new Date()
            });

            await setDoc(doc(db, 'progreso', usuario.uid), {
                xp: 0,
                cursos: {
                    python: {
                        completedLessons: []
                    }
                }
            });

            console.log('Usuario registrado:', usuario.uid);

            decir('¡Cuenta creada correctamente!');

            form.reset();

            window.location.hash = '#inicio';
            const path = window.location.pathname.toLowerCase();
            if (!path.endsWith('index.html') && !path.endsWith('kodicode.html') && path !== '/' && path !== '') {
                window.location.href = 'index.html#inicio';
            }
        } catch (error) {
            console.error('Error al registrar:', error);
            decir(obtenerMensajeError(error), true);
            boton.disabled = false;
        }
    });

    function obtenerMensajeError(error) {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return 'Ese correo ya está registrado.';
            case 'auth/invalid-email':
                return 'El correo no es válido.';
            case 'auth/weak-password':
                return 'La contraseña es demasiado débil.';
            case 'auth/missing-password':
                return 'Debes escribir una contraseña.';
            case 'auth/network-request-failed':
                return 'No hay conexión. Revisa tu internet.';
            case 'auth/too-many-requests':
                return 'Demasiados intentos. Espera un momento e inténtalo otra vez.';
            default:
                return 'No se pudo crear la cuenta.';
        }
    }
}