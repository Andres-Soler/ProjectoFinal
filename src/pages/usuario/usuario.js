import { signOut, deleteUser } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig.js';
import './style.css';

export default async function mostrarUsuario() {

    const app = document.getElementById("app");
    const user = auth.currentUser;

    if (!user) {

        app.innerHTML = `
            <div class="user-card">
                <h2>No has iniciado sesión</h2>
                <p>Debes iniciar sesión para ver tu información.</p>
            </div>
        `;

        return;
    }


    const usuarioRef = doc(db, "usuarios", user.uid);


    try {

        const usuarioSnap = await getDoc(usuarioRef);


        if (!usuarioSnap.exists()) {

            app.innerHTML = `
                <div class="user-card">
                    <h2>Usuario</h2>
                    <p>No se encontraron los datos de tu perfil.</p>
                </div>
            `;

            return;
        }


        const datos = usuarioSnap.data();


        app.innerHTML = `
            <div class="user-card">

                <h2>Mi Usuario</h2>

                <div class="user-info">

                    <p>
                        <strong>Nombre:</strong>
                        ${datos.nombre}
                    </p>

                    <p>
                        <strong>Correo:</strong>
                        ${datos.email}
                    </p>

                    <p>
                        <strong>UID:</strong>
                        ${user.uid}
                    </p>

                </div>


                <div class="user-buttons">

                    <button 
                        class="primary-btn"
                        id="btnModificar">
                        Modificar datos
                    </button>


                    <button 
                        class="secondary-btn"
                        id="btnCerrarSesion">
                        Cerrar sesión
                    </button>


                    <button 
                        class="danger-btn"
                        id="btnEliminarCuenta">
                        Eliminar cuenta
                    </button>

                </div>

            </div>
        `;



        document
            .getElementById("btnModificar")
            .addEventListener("click", () => {


                app.innerHTML = `

                    <div class="user-card">

                        <h2>Modificar datos</h2>


                        <label>
                            Nombre:
                        </label>


                        <input
                            class="user-input"
                            type="text"
                            id="nombre"
                            value="${datos.nombre || ''}"
                        >


                        <div class="user-buttons">

                            <button
                                class="primary-btn"
                                id="btnGuardar">
                                Guardar cambios
                            </button>


                            <button
                                class="secondary-btn"
                                id="btnCancelar">
                                Cancelar
                            </button>

                        </div>


                    </div>

                `;



                document
                    .getElementById("btnGuardar")
                    .addEventListener("click", async () => {


                        const nuevoNombre =
                            document.getElementById("nombre").value;


                        try {


                            await updateDoc(usuarioRef, {

                                nombre: nuevoNombre

                            });


                            alert(
                                "Datos actualizados correctamente"
                            );


                            mostrarUsuario();


                        } catch (error) {


                            console.error(
                                "Error actualizando datos:",
                                error
                            );


                            alert(
                                "Error al actualizar datos: "
                                + error.message
                            );

                        }

                    });



                document
                    .getElementById("btnCancelar")
                    .addEventListener("click", () => {

                        mostrarUsuario();

                    });


            });





        document
            .getElementById("btnCerrarSesion")
            .addEventListener("click", async () => {


                try {


                    await signOut(auth);


                    alert(
                        "Sesión cerrada correctamente"
                    );


                    window.location.reload();


                } catch(error) {


                    alert(
                        "Error al cerrar sesión: "
                        + error.message
                    );

                }


            });






        document
            .getElementById("btnEliminarCuenta")
            .addEventListener("click", async () => {


                const confirmar = confirm(
                    "¿Estás seguro de que quieres eliminar tu cuenta?"
                );


                if (!confirmar) {

                    return;

                }



                try {


                    await deleteDoc(usuarioRef);


                    await deleteUser(user);



                    alert(
                        "Cuenta eliminada correctamente"
                    );



                    window.location.reload();



                } catch(error) {


                    console.error(
                        "Error eliminando cuenta:",
                        error
                    );


                    alert(
                        "Error al eliminar cuenta: "
                        + error.message
                    );


                }


            });



    } catch(error) {


        console.error(
            "Error obteniendo datos:",
            error
        );


        app.innerHTML = `

            <div class="user-card">

                <h2>Error</h2>

                <p>
                    No se pudieron cargar los datos del usuario.
                </p>

            </div>

        `;


    }

}