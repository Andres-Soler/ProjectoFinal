import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig.js';

export default async function mostrarUsuario() {
    const app = document.getElementById("app");

    const user = auth.currentUser;

    if (!user) {
        app.innerHTML = `
            <div>
                <h2>No has iniciado sesión</h2>
                <p>Debes iniciar sesión para ver tu información.</p>
            </div>
        `;
        return;
    }

    try {
        const usuarioRef = doc(db, "usuarios", user.uid);
        const usuarioSnap = await getDoc(usuarioRef);

        if (!usuarioSnap.exists()) {
            app.innerHTML = `
                <div>
                    <h2>Usuario</h2>
                    <p>No se encontraron los datos de tu perfil.</p>
                </div>
            `;
            return;
        }

        const datos = usuarioSnap.data();

        app.innerHTML = `
            <div>
                <h2>Mi Usuario</h2>

                <p><strong>Nombre:</strong> ${datos.nombre}</p>
                <p><strong>Correo:</strong> ${datos.correo}</p>
                <p><strong>UID:</strong> ${datos.uid}</p>
                <p><strong>Fecha de nacimiento:</strong> ${datos.fecha}</p>
                <p><strong>Teléfono:</strong> ${datos.telefono}</p>

                <button id="btnModificar">
                    Modificar datos
                </button>

                <button id="btnCerrarSesion">
                    Cerrar sesión
                </button>
            </div>
        `;

        document.getElementById("btnModificar").addEventListener("click", () => {

            app.innerHTML = `
                <div>
                    <h2>Modificar datos</h2>

                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        value="${datos.nombre || ''}"
                    >

                    <br><br>

                    <label>Fecha de nacimiento:</label>
                    <input 
                        type="text" 
                        id="fecha" 
                        value="${datos.fecha || ''}"
                    >

                    <br><br>

                    <label>Teléfono:</label>
                    <input 
                        type="tel" 
                        id="telefono" 
                        value="${datos.telefono || ''}"
                    >

                    <br><br>

                    <button id="btnGuardar">
                        Guardar cambios
                    </button>

                    <button id="btnCancelar">
                        Cancelar
                    </button>
                </div>
            `;

            document.getElementById("btnGuardar").addEventListener("click", async () => {

                const nuevoNombre = document.getElementById("nombre").value;
                const nuevaFecha = document.getElementById("fecha").value;
                const nuevoTelefono = document.getElementById("telefono").value;

                try {
                    await updateDoc(usuarioRef, {
                        nombre: nuevoNombre,
                        fecha: nuevaFecha,
                        telefono: nuevoTelefono
                    });

                    alert("Datos actualizados correctamente");

                    mostrarUsuario();

                } catch (error) {
                    console.error("Error actualizando los datos:", error);
                    alert("Error al actualizar los datos: " + error.message);
                }
            });

            document.getElementById("btnCancelar").addEventListener("click", () => {
                mostrarUsuario();
            });
        });

        document.getElementById("btnCerrarSesion").addEventListener("click", async () => {
            try {
                await signOut(auth);

                alert("Sesión cerrada correctamente");
                window.location.reload();

            } catch (error) {
                alert("Error al cerrar sesión: " + error.message);
            }
        });

    } catch (error) {
        console.error("Error obteniendo los datos:", error);

        app.innerHTML = `
            <div>
                <h2>Error</h2>
                <p>No se pudieron cargar los datos del usuario.</p>
            </div>
        `;
    }
}

