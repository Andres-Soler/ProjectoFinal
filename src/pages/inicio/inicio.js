export default function mostrarInicio() {
    const app = document.getElementById("app");

    app.innerHTML = `
        <div class="inicio">
            <h1>Bienvenido a DuoProg</h1>

            <p>
                Bienvenido a nuestra aplicación.
            </p>

            <div class="botones-inicio">
                <button id="btnLogin">
                    Iniciar sesión
                </button>

                <button id="btnRegistro">
                    Registrarse
                </button>
            </div>
        </div>
    `;

    document.getElementById("btnLogin").addEventListener("click", () => {
        window.location.hash = "#login";
    });

    document.getElementById("btnRegistro").addEventListener("click", () => {
        window.location.hash = "#registro";
    });
}
