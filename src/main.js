import mostrarLogin from './pages/login/login.js';
import mostrarRegistro from './pages/registro/registro.js';
import mostrarUsuario from './pages/usuario/usuario.js';
import mostrarInicio from './pages/inicio/inicio.js';

const app = document.getElementById('app');

function iniciarAplicacion() {
    mostrarInicio();
}

iniciarAplicacion();