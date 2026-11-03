// Filtro de palabras fuertes para nombres de usuario (español).
// Importante: esto corre en el navegador, así que un usuario técnico podría saltárselo.
// Sirve para evitar casi todos los casos reales y para limpiar lo que se muestra.

// Palabras que solo cuentan si aparecen COMO PALABRA COMPLETA (evita falsos positivos:
// "puta" está dentro de "computadora", "culo" dentro de "calculo", etc.)
const PALABRAS_EXACTAS = [
    'puta', 'puto', 'verga', 'culo', 'zorra', 'perra', 'pendejo', 'pendeja',
    'cabron', 'cabrona', 'marica', 'marico', 'imbecil', 'estupido', 'estupida',
    'idiota', 'retrasado', 'retrasada', 'hp', 'hpta', 'hdp', 'jodete', 'joder',
    'pija', 'chinga', 'nazi', 'violador', 'pedofilo'
];

// Palabras largas y claras: se buscan incluso pegadas a otras ("hijueputa123", "h.i.j.u.e.p.u.t.a").
const PALABRAS_CONTENIDAS = [
    'hijueputa', 'hijodeputa', 'hijoputa', 'malparido', 'malparida', 'gonorrea',
    'mierda', 'maricon', 'pendejo', 'chingad', 'carechimba', 'carepicha',
    'careverga', 'mamaverga', 'mamahuevo', 'putamadre', 'sapahijueputa'
];

const LEET = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '!': 'i', '+': 't' };

// minúsculas, sin tildes, números/símbolos parecidos -> letras, letras repetidas (3+) -> una
function normalizar(texto) {
    return String(texto ?? '')
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[013457@$!+]/g, (c) => LEET[c] ?? c)
        .replace(/(.)\1{2,}/g, '$1');
}

export function contieneProhibidas(texto) {
    const norm = normalizar(texto);
    const tokens = norm.split(/[^a-z]+/).filter(Boolean);
    const compacto = norm.replace(/[^a-z]/g, '');

    const exacta = tokens.some((t) => {
        const singular = t.endsWith('s') ? t.slice(0, -1) : t;
        return PALABRAS_EXACTAS.includes(t) || PALABRAS_EXACTAS.includes(singular);
    });

    return exacta || PALABRAS_CONTENIDAS.some((p) => compacto.includes(p));
}

// Para el formulario de registro / edición de perfil
export function validarNombre(nombre) {
    const limpio = String(nombre ?? '').trim();

    if (limpio.length < 2) return { ok: false, motivo: 'El nombre debe tener al menos 2 caracteres.' };
    if (limpio.length > 24) return { ok: false, motivo: 'El nombre no puede pasar de 24 caracteres.' };
    if (contieneProhibidas(limpio)) return { ok: false, motivo: 'Elige otro nombre: ese contiene palabras no permitidas.' };

    return { ok: true, nombre: limpio };
}

// Para mostrar nombres ya guardados (cuentas viejas o creadas saltándose el filtro)
export function nombreSeguro(nombre, respaldo = 'Programador') {
    return contieneProhibidas(nombre) ? respaldo : nombre;
}

// Los nombres vienen de usuarios: se escapan antes de meterlos en innerHTML
export function escaparHTML(texto) {
    return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
