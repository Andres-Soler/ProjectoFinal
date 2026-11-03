// Diálogos con el estilo de la app (reemplazan alert / confirm / prompt del navegador).
//
//   import { avisar, confirmar, pedirTexto } from '../../utils/dialogos.js';
//
//   await avisar('Tu cuenta fue eliminada.', { tipo: 'exito', titulo: 'Listo' });
//   const ok = await confirmar('Esta acción no se puede deshacer.', { titulo: '¿Eliminar?', si: 'Sí, eliminar' });
//   const clave = await pedirTexto('Escribe tu contraseña.', { titulo: 'Confirma', boton: 'Continuar' });  // null si cancela
//
// tipo: 'exito' | 'error' | 'info' | 'peligro'

import './dialogos.css';

const COLORES = { exito: '#14b8a6', error: '#f43f5e', info: '#6C4CFF', peligro: '#fbbf24' };

// Iconos incrustados (no dependen de archivos)
function icono(tipo) {
    const color = COLORES[tipo] || COLORES.info;
    const trazo = tipo === 'peligro' ? '#15131C' : '#FFFFFF';
    const interior = {
        exito: `<path d="M8 12.3 L10.8 15 L16 9.2" stroke="${trazo}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
        error: `<path d="M8.8 8.8 L15.2 15.2 M15.2 8.8 L8.8 15.2" stroke="${trazo}" stroke-width="2" stroke-linecap="round"/>`,
        info: `<path d="M12 11 V16" stroke="${trazo}" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="8" r="1.1" fill="${trazo}"/>`,
        peligro: `<path d="M12 7.5 V13" stroke="${trazo}" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.3" r="1.1" fill="${trazo}"/>`
    }[tipo] || '';

    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle transform="translate(1.5 1.5)" cx="12" cy="12" r="8.5" fill="#15131C" stroke="#15131C" stroke-width="2"/>
        <circle cx="12" cy="12" r="8.5" fill="${color}" stroke="#15131C" stroke-width="2"/>
        ${interior}
    </svg>`;
}

function el(etiqueta, clase) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    return nodo;
}

// botones: [{ texto, estilo: 'primario' | 'secundario' | 'peligro', resultado: () => valor }]
function abrir({ tipo, titulo, mensaje, campo = null, botones, cancelar }) {
    return new Promise((resolve) => {
        const anterior = document.activeElement;

        const fondo = el('div', 'kc-dialogo-fondo');
        const caja = el('div', `kc-dialogo kc-${tipo}`);
        caja.setAttribute('role', 'dialog');
        caja.setAttribute('aria-modal', 'true');
        caja.setAttribute('aria-labelledby', 'kc-dialogo-titulo');
        caja.setAttribute('aria-describedby', 'kc-dialogo-mensaje');

        const iconoBox = el('div', 'kc-dialogo-icono');
        iconoBox.innerHTML = icono(tipo);

        // textContent (no innerHTML): los mensajes pueden traer texto de usuarios o de errores
        const h2 = el('h2');
        h2.id = 'kc-dialogo-titulo';
        h2.textContent = titulo;

        const p = el('p');
        p.id = 'kc-dialogo-mensaje';
        p.textContent = mensaje;

        caja.append(iconoBox, h2, p);
        if (campo) caja.append(campo);

        const zonaBotones = el('div', 'kc-dialogo-botones');
        const botonesDom = botones.map((b) => {
            const btn = el('button', `kc-btn kc-btn-${b.estilo}`);
            btn.type = 'button';
            btn.textContent = b.texto;
            btn.addEventListener('click', () => cerrar(b.resultado()));
            zonaBotones.append(btn);
            return btn;
        });
        caja.append(zonaBotones);
        fondo.append(caja);

        function cerrar(valor) {
            document.removeEventListener('keydown', alTeclear);
            fondo.remove();
            if (anterior && anterior.focus) anterior.focus();
            resolve(valor);
        }

        function alTeclear(e) {
            if (e.key === 'Escape') {
                cerrar(cancelar());
            } else if (e.key === 'Enter' && campo && document.activeElement === campo) {
                botonesDom[0].click();
            }
        }

        document.addEventListener('keydown', alTeclear);
        fondo.addEventListener('click', (e) => {
            if (e.target === fondo) cerrar(cancelar());
        });

        document.body.append(fondo);
        (campo || botonesDom[0]).focus();
    });
}

export function avisar(mensaje, { titulo = 'Aviso', tipo = 'info', boton = 'Entendido' } = {}) {
    return abrir({
        tipo,
        titulo,
        mensaje,
        botones: [{ texto: boton, estilo: 'primario', resultado: () => undefined }],
        cancelar: () => undefined
    });
}

export function confirmar(mensaje, { titulo = '¿Estás seguro?', si = 'Sí', no = 'Cancelar', tipo = 'peligro' } = {}) {
    return abrir({
        tipo,
        titulo,
        mensaje,
        botones: [
            { texto: si, estilo: tipo === 'peligro' ? 'peligro' : 'primario', resultado: () => true },
            { texto: no, estilo: 'secundario', resultado: () => false }
        ],
        cancelar: () => false
    });
}

export function pedirTexto(mensaje, { titulo = 'Escribe aquí', tipo = 'info', tipoCampo = 'password', placeholder = '', boton = 'Aceptar' } = {}) {
    const campo = el('input', 'kc-dialogo-input');
    campo.type = tipoCampo;
    campo.placeholder = placeholder;
    campo.autocomplete = tipoCampo === 'password' ? 'current-password' : 'off';

    return abrir({
        tipo,
        titulo,
        mensaje,
        campo,
        botones: [
            { texto: boton, estilo: 'primario', resultado: () => campo.value },
            { texto: 'Cancelar', estilo: 'secundario', resultado: () => null }
        ],
        cancelar: () => null
    });
}