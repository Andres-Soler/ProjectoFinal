import mostrarNavbar from './componentes/navbar/navbar.js';

import mostrarInicio from './pages/inicio/inicio.js';
import mostrarLogin from './pages/login/login.js';
import mostrarRegistro from './pages/registro/registro.js';
import mostrarUsuario from './pages/usuario/usuario.js';

async function mostrarPagina() {
    mostrarNavbar();

    switch (window.location.hash) {
        case '#login':
            mostrarLogin();
            break;

        case '#registro':
            mostrarRegistro();
            break;

        case '#usuario':
            await mostrarUsuario();
            break;

        case '#inicio':
        default:
            mostrarInicio();
            break;
    }
}

window.addEventListener('hashchange', mostrarPagina);

mostrarPagina();