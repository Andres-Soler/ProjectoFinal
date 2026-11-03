import {
    signOut,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
    verifyBeforeUpdateEmail
} from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig.js';
import { validarNombre, escaparHTML } from '../../utils/filtroPalabras.js';
import { avisar, confirmar, pedirTexto } from '../../utils/dialogos.js';
import './style.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const decoraciones = `
    <div class="stars">
        <span>✦</span>
        <span>✧</span>
        <span>✦</span>
        <span>✧</span>
        <span>✦</span>
    </div>
`;

// Envuelve el contenido en la tarjeta de usuario
function tarjeta(contenido) {
    return `
        ${decoraciones}
        <div class="inicio">
            <div class="user-card">
                ${contenido}
            </div>
        </div>
    `;
}

// Después de cerrar sesión o borrar la cuenta se vuelve a la pantalla de login
function irALogin() {
    window.location.hash = '#login';
    window.location.reload();
}

// Errores de Firebase Auth en español
function mensajeError(error) {
    switch (error.code) {
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'La contraseña actual no es correcta.';
        case 'auth/weak-password':
            return 'La nueva contraseña es muy débil (mínimo 6 caracteres).';
        case 'auth/email-already-in-use':
            return 'Ese correo ya está en uso por otra cuenta.';
        case 'auth/invalid-email':
            return 'El correo no es válido.';
        case 'auth/requires-recent-login':
            return 'Por seguridad, cierra sesión, vuelve a entrar e inténtalo de nuevo.';
        case 'auth/too-many-requests':
            return 'Demasiados intentos. Espera un momento e inténtalo otra vez.';
        case 'auth/network-request-failed':
            return 'No hay conexión. Revisa tu internet.';
        default:
            return 'No se pudo completar el cambio. Inténtalo de nuevo.';
    }
}

// aviso: texto opcional que se muestra arriba de la tarjeta (ej. después de guardar cambios)
export default async function mostrarUsuario(aviso = '') {
    const app = document.getElementById('app');
    const user = auth.currentUser;

    if (!user) {
        app.innerHTML = tarjeta(`
            <h2>No has iniciado sesión</h2>
            <p>Debes iniciar sesión para ver tu información.</p>
        `);
        return;
    }

    const usuarioRef = doc(db, 'usuarios', user.uid);

    try {
        const usuarioSnap = await getDoc(usuarioRef);

        if (!usuarioSnap.exists()) {
            app.innerHTML = tarjeta(`
                <h2>Usuario</h2>
                <p>No se encontraron los datos de tu perfil.</p>
            `);
            return;
        }

        const datos = usuarioSnap.data();

        // El correo "de verdad" es el de Firebase Auth. Si cambió (ej. al confirmar un cambio
        // de correo), se sincroniza el documento de Firestore.
        if (user.email && datos.email !== user.email) {
            updateDoc(usuarioRef, { email: user.email }).catch(() => {});
            datos.email = user.email;
        }

        app.innerHTML = tarjeta(`
            <h2>Mi Usuario</h2>

            ${aviso ? `<p class="user-message ok">${escaparHTML(aviso)}</p>` : ''}

            <div class="user-info">
                <p><strong>Nombre:</strong> ${escaparHTML(datos.nombre)}</p>
                <p><strong>Correo:</strong> ${escaparHTML(user.email || datos.email)}</p>
            </div>

            <div class="user-buttons">
                <button class="primary-btn" id="btnModificar">
                    Modificar datos
                </button>

                <button class="secondary-btn" id="btnCerrarSesionPerfil">
                    Cerrar sesión
                </button>

                <button class="danger-btn" id="btnEliminarCuenta">
                    Eliminar cuenta
                </button>
            </div>
        `);

        // --- Modificar datos (nombre, correo y contraseña) ---
        document.getElementById('btnModificar').addEventListener('click', () => {
            app.innerHTML = tarjeta(`
                <h2>Modificar datos</h2>

                <p class="user-message" id="mensajeUsuario" role="status"></p>

                <label for="nombre">Nombre:</label>
                <input class="user-input" type="text" id="nombre" maxlength="24" autocomplete="name"
                    value="${escaparHTML(datos.nombre || '')}">

                <label for="correo">Correo electrónico:</label>
                <input class="user-input" type="email" id="correo" autocomplete="email"
                    value="${escaparHTML(user.email || '')}">

                <label for="nuevaContrasena">Nueva contraseña (opcional):</label>
                <input class="user-input" type="password" id="nuevaContrasena" autocomplete="new-password"
                    placeholder="Mínimo 6 caracteres">

                <label for="confirmarContrasena">Confirmar nueva contraseña:</label>
                <input class="user-input" type="password" id="confirmarContrasena" autocomplete="new-password">

                <label for="contrasenaActual">Contraseña actual:</label>
                <input class="user-input" type="password" id="contrasenaActual" autocomplete="current-password"
                    placeholder="Solo si cambias correo o contraseña">

                <div class="user-buttons">
                    <button class="primary-btn" id="btnGuardar">
                        Guardar cambios
                    </button>

                    <button class="secondary-btn" id="btnCancelar">
                        Cancelar
                    </button>
                </div>
            `);

            const mensaje = document.getElementById('mensajeUsuario');
            const decir = (texto, ok = false) => {
                mensaje.textContent = texto;
                mensaje.classList.toggle('ok', ok);
            };

            document.getElementById('btnGuardar').addEventListener('click', async (e) => {
                const boton = e.currentTarget;

                const validacion = validarNombre(document.getElementById('nombre').value);
                const correoNuevo = document.getElementById('correo').value.trim();
                const passNueva = document.getElementById('nuevaContrasena').value;
                const passConfirmar = document.getElementById('confirmarContrasena').value;
                const passActual = document.getElementById('contrasenaActual').value;

                if (!validacion.ok) return decir(validacion.motivo);
                if (!EMAIL_RE.test(correoNuevo)) return decir('Escribe un correo válido.');

                const cambiaNombre = validacion.nombre !== (datos.nombre || '');
                const cambiaCorreo = correoNuevo.toLowerCase() !== (user.email || '').toLowerCase();
                const cambiaPass = passNueva.length > 0;

                if (cambiaPass) {
                    if (passNueva.length < 6) return decir('La nueva contraseña debe tener al menos 6 caracteres.');
                    if (passNueva !== passConfirmar) return decir('Las contraseñas nuevas no coinciden.');
                }

                if ((cambiaCorreo || cambiaPass) && !passActual) {
                    return decir('Escribe tu contraseña actual para cambiar el correo o la contraseña.');
                }

                if (!cambiaNombre && !cambiaCorreo && !cambiaPass) {
                    return decir('No hay cambios para guardar.');
                }

                boton.disabled = true;
                boton.textContent = 'Guardando...';
                decir('');

                const hecho = [];
                let avisoFinal = 'Datos actualizados correctamente.';

                try {
                    if (cambiaNombre) {
                        await updateDoc(usuarioRef, { nombre: validacion.nombre });
                        hecho.push('el nombre');
                    }

                    // Cambiar correo o contraseña exige confirmar la contraseña actual
                    if (cambiaCorreo || cambiaPass) {
                        const credencial = EmailAuthProvider.credential(user.email, passActual);
                        await reauthenticateWithCredential(user, credencial);
                    }

                    if (cambiaPass) {
                        await updatePassword(user, passNueva);
                        hecho.push('la contraseña');
                    }

                    if (cambiaCorreo) {
                        // El correo cambia cuando la persona abre el enlace que llega al correo nuevo
                        await verifyBeforeUpdateEmail(user, correoNuevo);
                        avisoFinal += ` Te enviamos un enlace de confirmación a ${correoNuevo}: tu correo cambiará cuando lo abras.`;
                    }

                    mostrarUsuario(avisoFinal);
                } catch (error) {
                    console.error('Error actualizando datos:', error);

                    let texto = mensajeError(error);
                    if (hecho.length) texto += ` (Ya se guardó ${hecho.join(' y ')}.)`;
                    decir(texto);

                    boton.disabled = false;
                    boton.textContent = 'Guardar cambios';
                }
            });

            document.getElementById('btnCancelar').addEventListener('click', () => {
                mostrarUsuario();
            });
        });

        // --- Cerrar sesión ---
        document.getElementById('btnCerrarSesionPerfil').addEventListener('click', async () => {
            try {
                await signOut(auth);
                irALogin();
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                avisar('No se pudo cerrar la sesión. Inténtalo de nuevo.', { tipo: 'error', titulo: 'Ups' });
            }
        });

        // --- Eliminar cuenta ---
        document.getElementById('btnEliminarCuenta').addEventListener('click', async () => {
            const seguro = await confirmar('Se borrarán tus datos de usuario. Esta acción no se puede deshacer.', {
                titulo: '¿Eliminar tu cuenta?',
                si: 'Sí, eliminar',
                no: 'Cancelar',
                tipo: 'peligro'
            });
            if (!seguro) return;

            try {
                const password = await pedirTexto('Escribe tu contraseña para confirmar.', {
                    titulo: 'Confirma tu contraseña',
                    boton: 'Eliminar cuenta'
                });
                if (!password) return;

                const credential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, credential);

                await deleteDoc(usuarioRef);
                await deleteUser(user);

                await avisar('Tu cuenta fue eliminada correctamente.', { tipo: 'exito', titulo: 'Cuenta eliminada' });
                irALogin();
            } catch (error) {
                console.error('Error eliminando cuenta:', error);
                avisar(mensajeError(error), { tipo: 'error', titulo: 'No se pudo eliminar' });
            }
        });
    } catch (error) {
        console.error('Error obteniendo datos:', error);

        app.innerHTML = tarjeta(`
            <h2>Error</h2>
            <p>No se pudieron cargar los datos del usuario.</p>
        `);
    }
}