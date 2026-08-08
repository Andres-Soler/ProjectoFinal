export default function mostrarNavbar() {
    const navbar = document.getElementById("navbar");

    if (!navbar) {
        console.error("No se encontró el elemento #navbar");
        return;
    }

    navbar.innerHTML = `
        <nav class="navbar">
            <div class="navbar-logo">
                <h2>DuoProg</h2>
            </div>

            <div class="navbar-links">
                <button id="btnInicio">Inicio</button>
                <button id="btnLogin">Iniciar sesión</button>
                <button id="btnRegistro">Registrarse</button>
                <button id="btnUsuario">Usuario</button>
            </div>
        </nav>
    `;

    document.getElementById("btnInicio").addEventListener("click", () => {
        window.location.hash = "#inicio";
    });

    document.getElementById("btnLogin").addEventListener("click", () => {
        window.location.hash = "#login";
    });

    document.getElementById("btnRegistro").addEventListener("click", () => {
        window.location.hash = "#registro";
    });

    document.getElementById("btnUsuario").addEventListener("click", () => {
        window.location.hash = "#usuario";
    });
}
