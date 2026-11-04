import heartFull from './assets/images/icon-heart.svg';
import heartEmpty from './assets/images/icon-heart-empty.svg';
import { auth, db } from './src/firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import mostrarNavbar from './src/componentes/navbar/navbar.js';

if (document.getElementById('navbar')) {
    mostrarNavbar();
}
// ===============================
// KODICODE SOUND EFFECTS
// ===============================

const sounds = {
    click: new Audio("assets/sounds/click.mp3"),
    correct: new Audio("assets/sounds/correct.mp3"),
    wrong: new Audio("assets/sounds/wrong.mp3")
};

function playSound(soundName) {
    const sound = sounds[soundName];

    if (!sound) return;

    sound.currentTime = 0;
    sound.play().catch(() => {});
}

// ============================================================
// GLOBAL VARIABLES
// ============================================================

let lives = 3;
let userXP = 0;

let completedLessons = [];
let currentUser = null;
let progressLoaded = false;

let currentActivityIndex = 0;
let selectedAnswer = null;
let currentQuestion = null;

document.addEventListener("click", (event) => {
    if (event.target.closest("button")) {
        playSound("click");
    }
});
// ============================================================
// LESSON DATA
// ============================================================

const lessons = {

    introduction: {

        title: "Introducción a Python",

        activities: [

            {
                type: "info",

                title: "¿Qué es la Programación?",

                text:
                    "Una computadora es una máquina muy rápida y potente, pero no puede pensar por sí misma. Programar consiste en darle una serie de instrucciones claras y ordenadas para que realice tareas o resuelva problemas. Python es uno de los lenguajes de programación más populares y fáciles de aprender del mundo gracias a su sintaxis clara, parecida al idioma humano."
            },

            {
                type: "multiple-choice",

                question: "¿Qué es programar en el contexto de la computación?",

                answers: [
                    "Darle instrucciones a una computadora para realizar tareas",
                    "Armar las piezas físicas y circuitos de una computadora",
                    "Navegar por diferentes páginas en internet",
                    "Instalar videojuegos y aplicaciones"
                ],

                correct: 0,

                feedback: [
                    null,
                    "Eso corresponde al hardware o electrónica física. Programar es escribir instrucciones lógicas para el software.",
                    "Navegar por internet es usar una aplicación (el navegador), no programar ni crear instrucciones.",
                    "Instalar aplicaciones es una tarea de usuario; programar consiste en crear las instrucciones de esos programas."
                ]
            },

            {
                type: "info",

                title: "Tu primera instrucción: print()",

                text:
                    "En Python usamos la función print() para mostrar texto o resultados en la pantalla. Lo que deseamos mostrar se coloca entre paréntesis. Cuando se trata de texto, siempre debe ir envuelto entre comillas (por ejemplo: \"Hola\" o 'Hola'). Ejemplo:\n\nprint(\"¡Hola, mundo!\")"
            },

            {
                type: "multiple-choice",

                question: "¿Qué mostrará en la pantalla la siguiente línea de código?",

                code: 'print("Bienvenido a Python")',

                answers: [
                    "Nada, solo guarda el texto en silencio",
                    "Bienvenido a Python",
                    'print("Bienvenido a Python")',
                    "Un error de sintaxis"
                ],

                correct: 1,

                feedback: [
                    "La función print() precisamente sirve para mostrar datos en la pantalla, no para guardarlos en silencio.",
                    null,
                    "print() muestra únicamente lo que está dentro de los paréntesis y comillas, no el nombre de la función.",
                    "La sintaxis es 100% válida: print con paréntesis y el texto entre comillas."
                ]
            },

            {
                type: "multiple-choice",

                question: "¿Por qué el siguiente código produce un error en Python?",

                code: "print(Hola mundo)",

                answers: [
                    "Porque le faltan las comillas alrededor del texto",
                    "Porque la palabra print debe ir en mayúsculas",
                    "Porque no se puede mostrar texto en Python",
                    "Porque le falta un punto y coma al final"
                ],

                correct: 0,

                feedback: [
                    null,
                    "En Python los comandos van en minúsculas (print, no PRINT). Usar mayúsculas causaría error.",
                    "Sí se puede mostrar texto con print(), pero siempre debe estar envuelto entre comillas.",
                    "En Python no se necesitan puntos y comas al final de las líneas."
                ]
            },

            {
                type: "info",

                title: "Comentarios y orden de ejecución",

                text:
                    "Python lee y ejecuta las instrucciones en orden: de arriba hacia abajo, una línea a la vez. Si deseas dejar notas explicativas en tu código, usas el símbolo numeral (#). Todo lo que escribas después de # es un comentario que Python ignorará por completo al ejecutar el programa."
            },

            {
                type: "multiple-choice",

                question: "¿Qué símbolo se utiliza en Python para escribir un comentario de una sola línea?",

                code: '# Esta línea es un comentario y no se ejecuta\nprint("Esta línea sí se ejecuta")',

                answers: [
                    "//",
                    "#",
                    "/*",
                    "--"
                ],

                correct: 1,

                feedback: [
                    "// se usa en lenguajes como C++, Java o JavaScript. En Python se usa el numeral (#).",
                    null,
                    "/* se utiliza para comentarios multilínea en lenguajes como C o CSS. En Python se usa #.",
                    "-- se usa para comentarios en SQL, no en Python."
                ]
            },

            {
                type: "matching",

                question: "Relaciona cada concepto con su función en Python:",

                pairs: [

                    {
                        left: "print()",
                        right: "Muestra mensajes o datos en pantalla"
                    },

                    {
                        left: 'Comillas (" ")',
                        right: "Indican que el contenido es texto"
                    },

                    {
                        left: "# (Numeral)",
                        right: "Inicia un comentario que Python ignora"
                    },

                    {
                        left: "Python",
                        right: "Lenguaje que interpreta las instrucciones"
                    }

                ]
            },

            {
                type: "code",

                question:
                    'Escribe el código para mostrar en pantalla exactamente: "Hola, mundo!" (recuerda usar print y comillas dobles).',

                expected: [
                    'print("Hola, mundo!")',
                    "print('Hola, mundo!')",
                    'print("Hola, mundo! ")',
                    'print("Hola mundo!")',
                    "print('Hola mundo!')"
                ],

                feedback: 'Recuerda usar la función print con paréntesis y texto entre comillas: print("Hola, mundo!")'
            }

        ]
    },


    variables: {

        title: "Variables en Python",

        activities: [

            {
                type: "info",

                title: "¿Qué es una Variable?",

                text:
                    "Imagina una variable como una caja etiquetada en la memoria de la computadora donde puedes guardar datos para usarlos más adelante. El nombre de la etiqueta es el nombre de la variable, y lo que guardas dentro es su valor. Por ejemplo, puedes guardar el nombre de un usuario, su puntuación o sus vidas restantes."
            },

            {
                type: "multiple-choice",

                question: "¿Cuál es el propósito principal de una variable?",

                answers: [
                    "Guardar y recordar información en memoria durante el programa",
                    "Acelerar la conexión a internet de la computadora",
                    "Apagar la pantalla al terminar el código",
                    "Crear un nuevo archivo de texto en el disco duro"
                ],

                correct: 0,

                feedback: [
                    null,
                    "Las variables almacenan información en memoria, no afectan la conexión de red.",
                    "Las variables no controlan el hardware de la pantalla.",
                    "Las variables guardan información temporalmente en la memoria RAM, no crean archivos en el disco."
                ]
            },

            {
                type: "info",

                title: "Asignación con el signo =",

                text:
                    "Para guardar un valor en una variable usamos el signo igual (=), conocido como el operador de asignación. A la izquierda escribes el nombre de la variable y a la derecha el valor que deseas guardarle:\n\npuntos = 100\njugador = \"Carlos\"\n\n¡Importante! En programación, el signo = no significa igualdad matemática, significa 'asigna o guarda el valor de la derecha en la variable de la izquierda'."
            },

            {
                type: "multiple-choice",

                question: "¿Cuál de las siguientes líneas crea correctamente una variable llamada 'energia' con el valor 100?",

                answers: [
                    "energia = 100",
                    "100 = energia",
                    "guardar 100 en energia",
                    "energia == 100"
                ],

                correct: 0,

                feedback: [
                    null,
                    "En Python el nombre de la variable siempre va a la izquierda y el valor a la derecha del signo =.",
                    "'guardar en' no es sintaxis de Python; la asignación se realiza con el signo igual (=).",
                    "El doble igual (==) se usa para comparar si dos valores son iguales, no para asignar un valor."
                ]
            },

            {
                type: "multiple-choice",

                question: "¿Qué valor tendrá la variable 'vidas' al final de la ejecución?",

                code: "vidas = 3\nvidas = vidas - 1\nprint(vidas)",

                answers: [
                    "3",
                    "2",
                    "vidas",
                    "1"
                ],

                correct: 1,

                feedback: [
                    "vidas comenzó en 3, pero luego se ejecutó vidas = vidas - 1, restando 1 a su valor.",
                    null,
                    "print(vidas) evalúa el valor contenido en la variable y muestra el número, no la palabra literal.",
                    "Solo se restó 1 una vez a 3: 3 - 1 = 2."
                ]
            },

            {
                type: "multiple-choice",

                question: "¿Cuál es la diferencia entre print(nombre) y print(\"nombre\")?",

                code: 'nombre = "Sara"\nprint(nombre)\nprint("nombre")',

                answers: [
                    'print(nombre) muestra el valor "Sara" y print("nombre") muestra la palabra literal "nombre"',
                    'Ambas instrucciones muestran exactamente la palabra "Sara"',
                    'Ambas instrucciones muestran exactamente la palabra "nombre"',
                    "print(nombre) produce un error porque le faltan comillas"
                ],

                correct: 0,

                feedback: [
                    null,
                    'Las comillas indican texto literal. print("nombre") siempre mostrará la palabra "nombre".',
                    "Sin comillas, Python busca la variable nombre y muestra su valor guardado (\"Sara\").",
                    "print(nombre) es completamente válido porque 'nombre' es una variable creada previamente."
                ]
            },

            {
                type: "info",

                title: "Reglas para nombrar variables",

                text:
                    "En Python los nombres de variables deben ser claros y seguir reglas:\n1. No pueden contener espacios (usa guiones bajos: mi_puntaje).\n2. No pueden empezar con un número (correcto: nivel1, incorrecto: 1nivel).\n3. Distinguen mayúsculas de minúsculas (Edad y edad son dos variables diferentes)."
            },

            {
                type: "matching",

                question: "Relaciona cada concepto sobre variables con su definición:",

                pairs: [

                    {
                        left: "Variable",
                        right: "Espacio con nombre para guardar un dato"
                    },

                    {
                        left: "Operador =",
                        right: "Asigna un valor a la variable"
                    },

                    {
                        left: "Reasignación",
                        right: "Cambiar el valor previo por uno nuevo"
                    },

                    {
                        left: "snake_case",
                        right: "Estilo con guión bajo para nombres (mi_dato)"
                    }

                ]
            },

            {
                type: "code",

                question:
                    'Crea una variable llamada nombre y asígnale el texto "Alex" (usa comillas dobles y el operador =).',

                expected: [
                    'nombre = "Alex"',
                    "nombre = 'Alex'",
                    'nombre="Alex"',
                    "nombre='Alex'"
                ],

                feedback: 'Recuerda: nombre a la izquierda, signo =, y "Alex" entre comillas: nombre = "Alex"'
            }

        ]
    },


    dataTypes: {

        title: "Tipos de Datos",

        activities: [

            {
                type: "info",

                title: "Los Tipos de Datos Fundamentales",

                text:
                    "En Python, cada dato pertenece a una categoría llamada tipo de dato. Esto le indica a Python qué operaciones puede realizar con él. Los 4 tipos primitivos esenciales son:\n\n• str (String): Texto entre comillas, ej: \"Hola\"\n• int (Integer): Números enteros sin decimales, ej: 42 o -5\n• float: Números con punto decimal, ej: 3.14 o 0.5\n• bool (Boolean): Valores lógicos, únicamente True o False"
            },

            {
                type: "multiple-choice",

                question: "¿Qué tipo de dato representa el texto \"Aprender Python\"?",

                answers: [
                    "str (String / Cadena de texto)",
                    "int (Entero)",
                    "float (Decimal)",
                    "bool (Booleano)"
                ],

                correct: 0,

                feedback: [
                    null,
                    "int es para números enteros sin comillas. Al tener comillas, es una cadena de texto (str).",
                    "float es para números decimales. Todo dato entre comillas es de tipo str.",
                    "bool solo puede ser True o False. Todo dato envuelto en comillas es un str."
                ]
            },

            {
                type: "multiple-choice",

                question: "¿Qué tipo de dato representa el número 42 (sin comillas y sin punto decimal)?",

                answers: [
                    "float (Decimal)",
                    "int (Entero)",
                    "str (Texto)",
                    "bool (Booleano)"
                ],

                correct: 1,

                feedback: [
                    "float lleva punto decimal (por ejemplo 42.0). El número 42 sin punto es un entero (int).",
                    null,
                    "str siempre lleva comillas (por ejemplo \"42\"). Sin comillas es un int.",
                    "bool solo admite True o False."
                ]
            },

            {
                type: "multiple-choice",

                question: "¿Qué tipo de dato es la variable precio en este código?",

                code: "precio = 19.99",

                answers: [
                    "int (Entero)",
                    "float (Número decimal)",
                    "str (Texto)",
                    "bool (Booleano)"
                ],

                correct: 1,

                feedback: [
                    "int es para números enteros. 19.99 tiene un punto decimal, por lo que es de tipo float.",
                    null,
                    "str requiere comillas (\"19.99\"). Aquí es un número real con punto decimal.",
                    "bool solo almacena True o False."
                ]
            },

            {
                type: "multiple-choice",

                question: "¿Cuáles son los únicos dos valores válidos para el tipo bool (Booleano) en Python?",

                answers: [
                    "True y False (con la primera letra mayúscula)",
                    "true y false (todo en minúsculas)",
                    "1 y 0 únicamente",
                    '"Verdadero" y "Falso"'
                ],

                correct: 0,

                feedback: [
                    null,
                    "En Python los booleanos son sensibles a mayúsculas: deben ser True y False con inicial mayúscula.",
                    "1 y 0 son enteros (int). En Python el tipo bool usa formalmente True y False.",
                    '"Verdadero" y "Falso" son cadenas de texto (str) por estar entre comillas.'
                ]
            },

            {
                type: "info",

                title: "Operaciones y el tipo de dato",

                text:
                    "El operador de suma (+) se comporta de forma diferente según el tipo de dato:\n\n• Con números (int o float): Suma matemáticamente -> 10 + 20 da 30\n• Con textos (str): Concatena o une los textos -> \"10\" + \"20\" da \"1020\"\n\n¡Por eso es fundamental conocer el tipo de dato de cada variable!"
            },

            {
                type: "multiple-choice",

                question: "¿Cuál es el resultado de ejecutar este código en Python?",

                code: 'a = "10"\nb = "20"\nprint(a + b)',

                answers: [
                    "30",
                    '"1020"',
                    "Error de tipos",
                    '"a + b"'
                ],

                correct: 1,

                feedback: [
                    'a y b son cadenas de texto ("10" y "20") porque tienen comillas. El operador + une los textos dando "1020".',
                    null,
                    "Ambas variables son del mismo tipo (str), por lo que unirlas con + es totalmente válido.",
                    "print(a + b) evalúa los valores de las variables y los concatena, no imprime los nombres literales."
                ]
            },

            {
                type: "matching",

                question: "Relaciona cada tipo de dato con su ejemplo exacto:",

                pairs: [

                    {
                        left: "str",
                        right: '"Hola mundo"'
                    },

                    {
                        left: "int",
                        right: "42"
                    },

                    {
                        left: "float",
                        right: "3.14"
                    },

                    {
                        left: "bool",
                        right: "True"
                    }

                ]
            },

            {
                type: "code",

                question:
                    'Crea una variable llamada edad y asígnale el número entero 19 (sin comillas).',

                expected: [
                    "edad = 19",
                    "edad=19"
                ],

                feedback: 'Recuerda asignar un entero sin comillas usando el operador =: edad = 19'
            }

        ]
    },

    // ============================================================
    // DESARROLLO WEB
    // ============================================================

    webIntro: {
        title: "Introducción a la Web",
        course: "web",
        activities: [
            {
                type: "info",
                title: "¿Cómo funciona la Web?",
                text: "La World Wide Web es un sistema global que nos permite ver e interactuar con páginas por internet. Cuando escribes una dirección en tu navegador (como Chrome o Firefox), tu dispositivo actúa como cliente y envía una petición a una computadora especial llamada servidor, la cual responde enviando los archivos que forman la página web para que tu navegador los dibuje."
            },
            {
                type: "multiple-choice",
                question: "¿Cuál es la función principal de un navegador web (Chrome, Firefox, Safari)?",
                answers: [
                    "Interpretar el código de las páginas y mostrárselo visualmente al usuario",
                    "Armar y soldar los circuitos físicos de tu computadora",
                    "Guardar todas las páginas web del mundo en tu disco duro",
                    "Aumentar físicamente la memoria RAM de tu equipo"
                ],
                correct: 0,
                feedback: [
                    null,
                    "Los navegadores son software que interpretan código web, no ensamblan componentes de hardware.",
                    "Las páginas web se alojan en servidores de internet, no se descargan completas en tu disco duro.",
                    "Los navegadores consumen memoria para funcionar, no pueden aumentar físicamente la memoria de tu equipo."
                ]
            },
            {
                type: "info",
                title: "Las 3 Tecnologías Fundamentales de la Web",
                text: "Toda página web moderna se construye usando tres lenguajes clave:\n\n1. HTML: Es el esqueleto o estructura (títulos, párrafos, botones, imágenes).\n2. CSS: Es la apariencia o estilo visual (colores, fuentes, márgenes, bordes).\n3. JavaScript: Es el cerebro o interactividad (animaciones, clics, lógica dinámica)."
            },
            {
                type: "multiple-choice",
                question: "Si comparamos una página web con un edificio, ¿qué parte representaría HTML?",
                answers: [
                    "La pintura, la decoración y las cortinas",
                    "La estructura, vigas y paredes de las habitaciones",
                    "El ascensor y el sistema eléctrico automático",
                    "El letrero luminoso de la entrada únicamente"
                ],
                correct: 1,
                feedback: [
                    "La pintura y decoración corresponden a CSS, que define el estilo estético.",
                    null,
                    "El sistema eléctrico y ascensor representan JavaScript, encargado de la dinámica y movimiento.",
                    "El letrero es solo un elemento individual; HTML conforma toda la estructura completa del edificio."
                ]
            },
            {
                type: "matching",
                question: "Relaciona cada tecnología web con su función primordial:",
                pairs: [
                    { left: "HTML", right: "Estructura y contenido del sitio" },
                    { left: "CSS", right: "Colores, fuentes y diseño visual" },
                    { left: "JavaScript", right: "Interactividad y comportamiento dinámico" },
                    { left: "Servidor", right: "Computadora que aloja y entrega la página" }
                ]
            },
            {
                type: "multiple-choice",
                question: "¿Qué tecnología se encarga de dar colores, tipografías y diseño a una página web?",
                answers: [
                    "HTML",
                    "CSS",
                    "SQL",
                    "Python"
                ],
                correct: 1,
                feedback: [
                    "HTML define la estructura y el contenido, pero los colores y fuentes los maneja CSS.",
                    null,
                    "SQL es para consultar bases de datos, no para diseñar páginas web visualmente.",
                    "Python es un lenguaje de programación de propósito general, no el lenguaje de estilos web."
                ]
            }
        ]
    },

    webHtml: {
        title: "Estructura con HTML",
        course: "web",
        activities: [
            {
                type: "info",
                title: "¿Qué son las etiquetas en HTML?",
                text: "HTML funciona mediante etiquetas rodeadas por los símbolos menor que (<) y mayor que (>).\n\nCasi todas las etiquetas se abren y se cierran con una barra oblicua (/):\n<h1>Título Principal</h1>\n<p>Este es un párrafo de texto.</p>\nEl contenido va en medio de la apertura y el cierre."
            },
            {
                type: "multiple-choice",
                question: "¿Cómo se escribe la etiqueta de cierre correcta para un párrafo en HTML?",
                answers: [
                    "<p>",
                    "</p>",
                    "<close-p>",
                    "<p>"
                ],
                correct: 1,
                feedback: [
                    "<p> es la etiqueta de apertura. El cierre siempre lleva la barra diagonal (/): </p>.",
                    null,
                    "HTML usa la barra inclinada (/) dentro del nombre original, no palabras como close.",
                    "La barra debe ser diagonal hacia adelante (/), no barra invertida (\\)."
                ]
            },
            {
                type: "info",
                title: "Encabezados y Enlaces",
                text: "HTML tiene 6 niveles de encabezados: desde <h1> (el más importante y grande) hasta <h6> (el más pequeño).\n\nPara crear enlaces que dirijan a otras páginas usamos la etiqueta <a> (ancla) con el atributo href:\n<a href=\"https://kodicode.com\">Visitar KodiCode</a>"
            },
            {
                type: "multiple-choice",
                question: "¿Cuál es la etiqueta utilizada en HTML para el título principal de una página?",
                answers: [
                    "<h1>",
                    "<title-big>",
                    "<h6>",
                    "<heading>"
                ],
                correct: 0,
                feedback: [
                    null,
                    "<title-big> no existe en la especificación de HTML.",
                    "<h6> es el título más pequeño de menor jerarquía; el principal es <h1>.",
                    "<heading> no es una etiqueta válida de HTML, se usa <h1> hasta <h6>."
                ]
            },
            {
                type: "matching",
                question: "Relaciona cada etiqueta HTML con su significado:",
                pairs: [
                    { left: "<h1>", right: "Encabezado principal o más importante" },
                    { left: "<p>", right: "Párrafo de texto regular" },
                    { left: "<a>", right: "Enlace o hipervínculo a otra página" },
                    { left: "<button>", right: "Botón interactivo para hacer clic" }
                ]
            },
            {
                type: "code",
                question: 'Escribe la etiqueta completa de un título de nivel 1 con el texto "Mi Blog". Ejemplo: <h1>Mi Blog</h1>',
                expected: [
                    "<h1>Mi Blog</h1>",
                    "<h1> Mi Blog </h1>",
                    "<h1>Mi blog</h1>"
                ],
                feedback: 'Recuerda abrir con <h1>, escribir "Mi Blog" y cerrar con </h1>: <h1>Mi Blog</h1>'
            }
        ]
    },

    webCss: {
        title: "Estilo con CSS",
        course: "web",
        activities: [
            {
                type: "info",
                title: "¿Cómo funciona CSS?",
                text: "CSS (Cascading Style Sheets) le da vida y color a tu HTML. Una regla de CSS tiene un selector (a qué etiqueta queremos darle estilo) y un bloque entre llaves {} con propiedades y valores:\n\nh1 {\n  color: blue;\n  font-size: 24px;\n}\n\nEsto hará que todos los títulos <h1> sean de color azul y de 24 píxeles de tamaño."
            },
            {
                type: "multiple-choice",
                question: "¿Qué propiedad de CSS se utiliza para cambiar el color del texto?",
                answers: [
                    "text-paint",
                    "color",
                    "font-background",
                    "textColor"
                ],
                correct: 1,
                feedback: [
                    "text-paint no existe en CSS.",
                    null,
                    "font-background no existe; para fondo se usa background-color.",
                    "textColor se usa a veces en JavaScript, pero en CSS la propiedad estándar es 'color'."
                ]
            },
            {
                type: "info",
                title: "Fondos y Tamaños",
                text: "Dos propiedades muy comunes en CSS son:\n• background-color: Cambia el color de fondo de un elemento (ejemplo: background-color: yellow;).\n• font-size: Controla el tamaño de la letra (ejemplo: font-size: 16px;).\n\nRecuerda que cada línea dentro del bloque CSS siempre termina con un punto y coma (;)."
            },
            {
                type: "multiple-choice",
                question: "¿Qué símbolo separa una propiedad de su valor en una regla CSS (por ejemplo color y red)?",
                answers: [
                    "El signo igual (=)",
                    "Dos puntos (:)",
                    "Un guión (-)",
                    "Una flecha (->)"
                ],
                correct: 1,
                feedback: [
                    "El signo igual (=) se usa en HTML y programación, en CSS se usan dos puntos (:).",
                    null,
                    "El guión se usa para unir nombres de propiedades (como font-size), no para separar el valor.",
                    "Las flechas no forman parte de la sintaxis de reglas CSS."
                ]
            },
            {
                type: "matching",
                question: "Relaciona cada propiedad CSS con el aspecto visual que modifica:",
                pairs: [
                    { left: "color", right: "Color de las letras o texto" },
                    { left: "background-color", right: "Color de fondo del elemento" },
                    { left: "font-size", right: "Tamaño de la tipografía" },
                    { left: "border", right: "Línea o marco alrededor del elemento" }
                ]
            },
            {
                type: "code",
                question: 'Escribe la propiedad CSS para poner el color de texto en rojo. Escribe: color: red;',
                expected: [
                    "color: red;",
                    "color:red;",
                    "color: red",
                    "color:red"
                ],
                feedback: 'Recuerda escribir la propiedad color seguida de dos puntos y el valor: color: red;'
            }
        ]
    },

    // ============================================================
    // BASES DE DATOS
    // ============================================================

    dbIntro: {
        title: "Introducción a las Bases de Datos",
        course: "database",
        activities: [
            {
                type: "info",
                title: "¿Qué es una Base de Datos?",
                text: "Una base de datos es un almacén digital estructurado para guardar, organizar y consultar grandes cantidades de información de forma rápida y segura.\n\nEn las bases de datos relacionales, los datos se guardan en Tablas compuestas por:\n• Columnas (Campos): El tipo de dato que se guarda (ej: nombre, email, edad).\n• Filas (Registros): Cada entrada individual de un usuario o elemento."
            },
            {
                type: "multiple-choice",
                question: "En una tabla de base de datos de 'usuarios', ¿qué representa cada fila?",
                answers: [
                    "Un usuario individual con toda su información registrada",
                    "El nombre de la aplicación",
                    "Un tipo de dato como texto o número",
                    "El cable que conecta el servidor a internet"
                ],
                correct: 0,
                feedback: [
                    null,
                    "El nombre de la aplicación no es un registro en la tabla.",
                    "Los tipos de datos son definidos por las columnas, cada fila es un usuario concreto.",
                    "El cable de red es hardware físico de conexión."
                ]
            },
            {
                type: "info",
                title: "¿Qué es SQL?",
                text: "SQL significa Structured Query Language (Lenguaje de Consulta Estructurado). Es el lenguaje universal que usamos para comunicarnos con las bases de datos.\n\nCon SQL podemos:\n1. Consultar y buscar datos.\n2. Guardar nuevos registros.\n3. Actualizar información existente.\n4. Eliminar datos obsoletos."
            },
            {
                type: "multiple-choice",
                question: "¿Cuál es el propósito principal del lenguaje SQL?",
                answers: [
                    "Hacer animaciones 3D para películas",
                    "Consultar y gestionar información en bases de datos",
                    "Diseñar la carcasa física de los servidores",
                    "Pintar el estilo visual de una página web"
                ],
                correct: 1,
                feedback: [
                    "SQL no tiene funciones de modelado ni animación 3D.",
                    null,
                    "SQL es software de consultas, no ingeniería de hardware ni carcasas.",
                    "El estilo visual de las páginas web lo maneja CSS, no SQL."
                ]
            },
            {
                type: "matching",
                question: "Relaciona cada concepto de bases de datos con su descripción:",
                pairs: [
                    { left: "Base de Datos", right: "Sistema organizado para almacenar y consultar datos" },
                    { left: "Tabla", right: "Estructura de filas y columnas donde residen los datos" },
                    { left: "Columna", right: "Campo que define una característica (ej: correo)" },
                    { left: "Fila", right: "Registro individual que representa una entidad" }
                ]
            },
            {
                type: "multiple-choice",
                question: "¿Cuál de las siguientes opciones se parece más a una tabla de base de datos?",
                answers: [
                    "Una hoja de cálculo con columnas con encabezados y filas numeradas",
                    "Un archivo de música en formato MP3",
                    "Una foto tomada con un teléfono móvil",
                    "Un mensaje de audio de WhatsApp"
                ],
                correct: 0,
                feedback: [
                    null,
                    "Un archivo MP3 contiene sonido digital comprimido, no registros estructurados.",
                    "Una foto contiene píxeles de color, no tablas relacionales.",
                    "Un mensaje de audio es multimedia, no una tabla de datos."
                ]
            }
        ]
    },

    dbSql: {
        title: "Consultas con SQL (SELECT)",
        course: "database",
        activities: [
            {
                type: "info",
                title: "La instrucción SELECT y FROM",
                text: "La operación más frecuente en bases de datos es consultar o leer información. Para esto usamos dos palabras clave fundamentales de SQL:\n\n• SELECT: Indica qué columnas queremos ver.\n• FROM: Indica de qué tabla provienen los datos.\n\nEjemplo para ver los nombres de la tabla alumnos:\nSELECT nombre FROM alumnos;"
            },
            {
                type: "multiple-choice",
                question: "¿Qué palabra clave de SQL indica qué columnas queremos consultar?",
                answers: [
                    "SHOW",
                    "SELECT",
                    "GET",
                    "OBTENER"
                ],
                correct: 1,
                feedback: [
                    "SHOW se usa en algunos motores para ver metadatos, no para seleccionar columnas de tablas.",
                    null,
                    "GET se usa en protocolos HTTP y APIs, en SQL la instrucción estándar es SELECT.",
                    "Las palabras clave de SQL están en inglés; se usa SELECT."
                ]
            },
            {
                type: "info",
                title: "El comodín asterisco (*)",
                text: "Si deseas ver todas las columnas de una tabla sin tener que escribir los nombres de cada una, usamos el asterisco (*):\n\nSELECT * FROM usuarios;\n\nEsta instrucción traerá absolutamente todas las columnas y filas de la tabla 'usuarios'."
            },
            {
                type: "multiple-choice",
                question: "¿Qué hace el asterisco (*) en la consulta SELECT * FROM productos;?",
                answers: [
                    "Multiplica todos los precios por sí mismos",
                    "Selecciona todas las columnas de la tabla",
                    "Borra los productos que tengan errores",
                    "Crea una copia de seguridad en la nube"
                ],
                correct: 1,
                feedback: [
                    "En una cláusula SELECT, el asterisco actúa como comodín de 'todas las columnas'.",
                    null,
                    "Para borrar se usa DELETE; SELECT únicamente lee y muestra datos.",
                    "SELECT no crea copias de seguridad de la base de datos."
                ]
            },
            {
                type: "matching",
                question: "Relaciona cada componente de una consulta SQL con su función:",
                pairs: [
                    { left: "SELECT", right: "Indica las columnas deseadas" },
                    { left: "*", right: "Comodín para traer todas las columnas" },
                    { left: "FROM", right: "Indica la tabla de origen" },
                    { left: ";", right: "Finaliza la sentencia SQL" }
                ]
            },
            {
                type: "code",
                question: 'Escribe la consulta SQL para seleccionar todas las columnas de la tabla clientes: SELECT * FROM clientes;',
                expected: [
                    "SELECT * FROM clientes;",
                    "SELECT * FROM clientes",
                    "select * from clientes;",
                    "select * from clientes"
                ],
                feedback: 'Recuerda usar SELECT *, luego FROM y el nombre de la tabla: SELECT * FROM clientes;'
            }
        ]
    },

    dbWhere: {
        title: "Filtrar con WHERE",
        course: "database",
        activities: [
            {
                type: "info",
                title: "Filtrando datos con WHERE",
                text: "No siempre queremos ver todos los registros de una tabla. La cláusula WHERE nos permite filtrar filas según una condición:\n\nSELECT * FROM usuarios WHERE edad >= 18;\n\nEsta consulta devolverá únicamente a los usuarios mayores o iguales a 18 años."
            },
            {
                type: "multiple-choice",
                question: "¿Qué cláusula de SQL se usa para filtrar filas que cumplan una condición específica?",
                answers: [
                    "FILTER",
                    "WHERE",
                    "SEARCH",
                    "FIND"
                ],
                correct: 1,
                feedback: [
                    "FILTER no es la cláusula estándar de SQL para filtrar filas; se usa WHERE.",
                    null,
                    "SEARCH no es una palabra reservada estándar en SQL.",
                    "FIND no se utiliza en consultas SQL estándar."
                ]
            },
            {
                type: "info",
                title: "Filtrar por texto en WHERE",
                text: "Cuando filtramos por un texto en SQL, el valor debe ir envuelto entre comillas simples ('):\n\nSELECT * FROM clientes WHERE pais = 'Colombia';\n\nEn cambio, los números van sin comillas:\nSELECT * FROM productos WHERE precio > 50;"
            },
            {
                type: "multiple-choice",
                question: "¿Cuál es la consulta SQL correcta para filtrar usuarios cuyo rol sea 'admin'?",
                answers: [
                    "SELECT * FROM usuarios WHERE rol = 'admin';",
                    "SELECT * FROM usuarios WHERE rol = admin;",
                    "SELECT * FROM usuarios FILTER rol == admin;",
                    "SELECT rol FROM usuarios WHERE 'admin';"
                ],
                correct: 0,
                feedback: [
                    null,
                    "El texto 'admin' debe ir entre comillas simples en SQL; sin comillas se confunde con una columna.",
                    "FILTER no existe en SQL estándar y las comparaciones de igualdad usan un solo signo igual (=).",
                    "Se debe especificar la columna a comparar: rol = 'admin'."
                ]
            },
            {
                type: "matching",
                question: "Relaciona cada operador de comparación con su significado en WHERE:",
                pairs: [
                    { left: "=", right: "Igual a un valor específico" },
                    { left: ">", right: "Estrictamente mayor que" },
                    { left: "<", right: "Estrictamente menor que" },
                    { left: ">=", right: "Mayor o igual que" }
                ]
            },
            {
                type: "code",
                question: 'Escribe la consulta para seleccionar todos los usuarios con edad igual a 20: SELECT * FROM usuarios WHERE edad = 20;',
                expected: [
                    "SELECT * FROM usuarios WHERE edad = 20;",
                    "SELECT * FROM usuarios WHERE edad = 20",
                    "SELECT * FROM usuarios WHERE edad=20;",
                    "SELECT * FROM usuarios WHERE edad=20",
                    "select * from usuarios where edad = 20;",
                    "select * from usuarios where edad = 20"
                ],
                feedback: 'Recuerda usar: SELECT * FROM usuarios WHERE edad = 20;'
            }
        ]
    }

};


// ============================================================
// LOAD USER PROGRESS
// ============================================================

async function loadProgress(user) {

    currentUser = user;

    if (user) {

        try {

            const progresoRef =
                doc(db, "progreso", user.uid);

            const snap =
                await getDoc(progresoRef);

            if (snap.exists()) {

                const data = snap.data();

                userXP =
                    Number(data.xp) || 0;

                completedLessons =
                    data.cursos?.python?.completedLessons || [];

                const webCompleted = data.cursos?.web?.completedLessons || [];
                const dbCompleted = data.cursos?.database?.completedLessons || [];

                // Save progress to cache

                localStorage.setItem(
                    `kodicode_completed_${user.uid}`,
                    JSON.stringify(completedLessons)
                );
                localStorage.setItem(
                    `kodicode_completed_web_${user.uid}`,
                    JSON.stringify(webCompleted)
                );
                localStorage.setItem(
                    `kodicode_completed_db_${user.uid}`,
                    JSON.stringify(dbCompleted)
                );

                localStorage.setItem(
                    `kodicode_xp_${user.uid}`,
                    userXP.toString()
                );
            }

        } catch (err) {

            console.warn(
                "No se pudo conectar a Firestore, usando caché local:",
                err
            );

            const cached =
                (localStorage.getItem(`kodicode_completed_${user.uid}`) || localStorage.getItem(`kodicode_completed_${user.uid}`));

            if (cached) {

                completedLessons =
                    JSON.parse(cached);
            }

            const cachedXP =
                (localStorage.getItem(`kodicode_xp_${user.uid}`) || localStorage.getItem(`kodicode_xp_${user.uid}`));

            if (cachedXP) {

                userXP =
                    Number(cachedXP) || 0;
            }
        }

    } else {

        // Guest progress

        const cached =
            (localStorage.getItem("kodicode_completed_guest") || localStorage.getItem("kodicode_completed_guest"));

        if (cached) {

            completedLessons =
                JSON.parse(cached);
        }

        const cachedXP =
            (localStorage.getItem("kodicode_xp_guest") || localStorage.getItem("kodicode_xp_guest"));

        if (cachedXP) {

            userXP =
                Number(cachedXP) || 0;
        }
    }

    progressLoaded = true;

    updateCourseMapUI();
}


// ============================================================
// FIREBASE AUTH LISTENER
// ============================================================

onAuthStateChanged(auth, async (user) => {

    await loadProgress(user);

});


// ============================================================
// UPDATE COURSE MAP
// ============================================================

function updateCourseMapUI() {
    const setNodeStatus = (node, status) => {
        if (!node) return;
        node.classList.remove("completed", "available", "locked");
        node.classList.add(status);
    };

    // Helper to get completed list for current user or guest
    const getCompletedFor = (courseKey) => {
        const uid = currentUser ? currentUser.uid : "guest";
        try {
            const raw = localStorage.getItem(`kodicode_completed_${courseKey}_${uid}`);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return [];
    };

    // --------------------------------------------------------
    // 1. PYTHON COURSE MAP
    // --------------------------------------------------------
    const introNode = document.getElementById("lesson-introduction");
    const varsNode = document.getElementById("lesson-variables");
    const typesNode = document.getElementById("lesson-dataTypes");
    const path1 = document.getElementById("path-1");
    const path2 = document.getElementById("path-2");

    if (introNode || varsNode || typesNode) {
        if (completedLessons.includes("introduction")) {
            setNodeStatus(introNode, "completed");
            if (path1) path1.classList.add("completed");
        } else {
            setNodeStatus(introNode, "available");
            if (path1) path1.classList.remove("completed");
        }

        if (completedLessons.includes("variables")) {
            setNodeStatus(varsNode, "completed");
            if (path2) path2.classList.add("completed");
        } else if (completedLessons.includes("introduction")) {
            setNodeStatus(varsNode, "available");
            if (path2) path2.classList.remove("completed");
        } else {
            setNodeStatus(varsNode, "locked");
            if (path2) path2.classList.remove("completed");
        }

        if (completedLessons.includes("dataTypes")) {
            setNodeStatus(typesNode, "completed");
        } else if (completedLessons.includes("variables")) {
            setNodeStatus(typesNode, "available");
        } else {
            setNodeStatus(typesNode, "locked");
        }
    }

    // --------------------------------------------------------
    // 2. DESARROLLO WEB COURSE MAP
    // --------------------------------------------------------
    const webIntroNode = document.getElementById("lesson-webIntro");
    const webHtmlNode = document.getElementById("lesson-webHtml");
    const webCssNode = document.getElementById("lesson-webCss");
    const webPath1 = document.getElementById("path-web-1");
    const webPath2 = document.getElementById("path-web-2");

    if (webIntroNode || webHtmlNode || webCssNode) {
        const webCompleted = getCompletedFor("web");
        if (webCompleted.includes("webIntro")) {
            setNodeStatus(webIntroNode, "completed");
            if (webPath1) webPath1.classList.add("completed");
        } else {
            setNodeStatus(webIntroNode, "available");
            if (webPath1) webPath1.classList.remove("completed");
        }

        if (webCompleted.includes("webHtml")) {
            setNodeStatus(webHtmlNode, "completed");
            if (webPath2) webPath2.classList.add("completed");
        } else if (webCompleted.includes("webIntro")) {
            setNodeStatus(webHtmlNode, "available");
            if (webPath2) webPath2.classList.remove("completed");
        } else {
            setNodeStatus(webHtmlNode, "locked");
            if (webPath2) webPath2.classList.remove("completed");
        }

        if (webCompleted.includes("webCss")) {
            setNodeStatus(webCssNode, "completed");
        } else if (webCompleted.includes("webHtml")) {
            setNodeStatus(webCssNode, "available");
        } else {
            setNodeStatus(webCssNode, "locked");
        }
    }

    // --------------------------------------------------------
    // 3. BASES DE DATOS COURSE MAP
    // --------------------------------------------------------
    const dbIntroNode = document.getElementById("lesson-dbIntro");
    const dbSqlNode = document.getElementById("lesson-dbSql");
    const dbWhereNode = document.getElementById("lesson-dbWhere");
    const dbPath1 = document.getElementById("path-db-1");
    const dbPath2 = document.getElementById("path-db-2");

    if (dbIntroNode || dbSqlNode || dbWhereNode) {
        const dbCompleted = getCompletedFor("db");
        if (dbCompleted.includes("dbIntro")) {
            setNodeStatus(dbIntroNode, "completed");
            if (dbPath1) dbPath1.classList.add("completed");
        } else {
            setNodeStatus(dbIntroNode, "available");
            if (dbPath1) dbPath1.classList.remove("completed");
        }

        if (dbCompleted.includes("dbSql")) {
            setNodeStatus(dbSqlNode, "completed");
            if (dbPath2) dbPath2.classList.add("completed");
        } else if (dbCompleted.includes("dbIntro")) {
            setNodeStatus(dbSqlNode, "available");
            if (dbPath2) dbPath2.classList.remove("completed");
        } else {
            setNodeStatus(dbSqlNode, "locked");
            if (dbPath2) dbPath2.classList.remove("completed");
        }

        if (dbCompleted.includes("dbWhere")) {
            setNodeStatus(dbWhereNode, "completed");
        } else if (dbCompleted.includes("dbSql")) {
            setNodeStatus(dbWhereNode, "available");
        } else {
            setNodeStatus(dbWhereNode, "locked");
        }
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateCourseMapUI);
} else {
    updateCourseMapUI();
}


// ============================================================
// URL / CURRENT LESSON
// ============================================================

const urlParams =
    new URLSearchParams(window.location.search);

const lessonId =
    urlParams.get("lesson");

const currentLesson =
    lessons[lessonId];


// ============================================================
// OPEN LESSON
// ============================================================

function openLesson(lesson) {
    const uid = currentUser ? currentUser.uid : "guest";
    const getCompleted = (prefix) => {
        try {
            const raw = localStorage.getItem(`kodicode_completed_${prefix}_${uid}`);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    };

    // Python prerequisites
    if (lesson === "variables" && !completedLessons.includes("introduction")) {
        alert("Debes completar la lección de 'Introducción a Python' primero para desbloquear esta.");
        return;
    }
    if (lesson === "dataTypes" && !completedLessons.includes("variables")) {
        alert("Debes completar la lección de 'Variables en Python' primero para desbloquear esta.");
        return;
    }

    // Web prerequisites
    const webDone = getCompleted("web");
    if (lesson === "webHtml" && !webDone.includes("webIntro")) {
        alert("Debes completar 'Introducción a la Web' primero para desbloquear esta.");
        return;
    }
    if (lesson === "webCss" && !webDone.includes("webHtml")) {
        alert("Debes completar 'Estructura con HTML' primero para desbloquear esta.");
        return;
    }

    // Database prerequisites
    const dbDone = getCompleted("db");
    if (lesson === "dbSql" && !dbDone.includes("dbIntro")) {
        alert("Debes completar 'Introducción a las Bases de Datos' primero para desbloquear esta.");
        return;
    }
    if (lesson === "dbWhere" && !dbDone.includes("dbSql")) {
        alert("Debes completar 'Consultas con SQL' primero para desbloquear esta.");
        return;
    }

    window.location.href = "lesson.html?lesson=" + lesson;
}


// ============================================================
// HEARTS / LIVES
// ============================================================

function resetLives() {

    lives = 3;

    const l1 =
        document.getElementById("life-1");

    const l2 =
        document.getElementById("life-2");

    const l3 =
        document.getElementById("life-3");


    if (l1) {
        l1.src = heartFull;
    }

    if (l2) {
        l2.src = heartFull;
    }

    if (l3) {
        l3.src = heartFull;
    }
}


function loseLife() {

    if (lives <= 0) {
        return;
    }


    const heart =
        document.getElementById("life-" + lives);


    console.log("Heart:", heart);


    if (heart) {

        heart.src =
            heartEmpty;
    }


    lives--;


    console.log(
        "Lives remaining:",
        lives
    );


    if (lives === 0) {

        showGameOver();
    }
    // Flash all hearts red when losing a life
const hearts = [
    document.getElementById("life-1"),
    document.getElementById("life-2"),
    document.getElementById("life-3")
];

hearts.forEach(heart => {
    heart.classList.remove("damage-flash");

    // Restart the animation
    void heart.offsetWidth;

    heart.classList.add("damage-flash");
});

// Remove the effect after it finishes
setTimeout(() => {
    hearts.forEach(heart => {
        heart.classList.remove("damage-flash");
    });
}, 700);
}


// ============================================================
// GAME OVER
// ============================================================

function showGameOver() {

    // Hide current question

    const question =
        document.querySelector(".question");

    if (question) {
        question.style.display = "none";
    }


    // Hide CHECK button

    const checkButton =
        document.querySelector(".check-button");

    if (checkButton) {
        checkButton.style.display = "none";
    }


    // Hide matching activity

    const matchingContainer =
        document.getElementById(
            "matching-container"
        );

    if (matchingContainer) {
        matchingContainer.style.display = "none";
    }


    // Hide code editor

    const codeEditor =
        document.getElementById(
            "code-editor"
        );

    if (codeEditor) {
        codeEditor.style.display = "none";
    }


    // Show game over

    const gameOverScreen =
        document.getElementById(
            "game-over-screen"
        );

    if (gameOverScreen) {

        gameOverScreen.style.display =
            "flex";
    }
}


// ============================================================
// START LESSON
// ============================================================

function startLesson() {

    if (!currentLesson) {

        console.error(
            "Lesson not found:",
            lessonId
        );

        return;
    }

    if (currentLesson.title) {
        document.title = `${currentLesson.title} - KodiCode`;
    }

    currentActivityIndex = 0;

    resetLives();

    showActivity();
}


// ============================================================
// SHOW CURRENT ACTIVITY
// ============================================================

function showActivity() {

    limpiarFeedback();

    const activity =
        currentLesson.activities[
            currentActivityIndex
        ];


    if (!activity) {

        finishLesson();

        return;
    }


    // Make sure game-over screen is hidden

    const gameOverScreen =
        document.getElementById(
            "game-over-screen"
        );

    if (gameOverScreen) {

        gameOverScreen.style.display =
            "none";
    }


    // Update activity counter
    const qNum =
        document.getElementById(
            "question-number"
        );

    if (qNum && currentLesson) {
        qNum.textContent =
            `Paso ${currentActivityIndex + 1} de ${currentLesson.activities.length}`;
    }


    // Hide matching and code editor containers by default
    const matchingContainer =
        document.getElementById(
            "matching-container"
        );

    if (matchingContainer) {
        matchingContainer.style.display =
            "none";
    }

    const editor =
        document.getElementById(
            "code-editor"
        );

    if (editor) {
        editor.style.display =
            "none";
    }


    // Choose activity type

    if (activity.type === "info") {

        showInfo(activity);

    }

    else if (
        activity.type === "multiple-choice"
    ) {

        createQuestion(activity);

    }

    else if (
        activity.type === "matching"
    ) {

        showMatching(activity);

    }

    else if (
        activity.type === "code"
    ) {

        showCodeExercise(activity);

    }

    else if (
        activity.type === "debug"
    ) {

        showDebugExercise(activity);

    }

    else {

        console.error(
            "Unknown activity type:",
            activity.type
        );
    }
}


// ============================================================
// INFO ACTIVITY
// ============================================================

function showInfo(activity) {

    const infoScreen =
        document.getElementById(
            "info-screen"
        );

    const questionScreen =
        document.querySelector(
            ".question"
        );


    if (infoScreen) {

        infoScreen.style.display =
            "block";
    }


    if (questionScreen) {

        questionScreen.style.display =
            "none";
    }


    const title =
        document.getElementById(
            "info-title"
        );

    const text =
        document.getElementById(
            "info-text"
        );


    if (title) {
        title.textContent =
            activity.title;
    }


    if (text) {
        text.textContent =
            activity.text;
    }


    const nextButton =
        document.getElementById(
            "info-next"
        );


    if (nextButton) {

        nextButton.onclick =
            function () {

                if (infoScreen) {
                    infoScreen.style.display =
                        "none";
                }

                if (questionScreen) {
                    questionScreen.style.display =
                        "block";
                }

                nextActivity();
            };
    }
}


// ============================================================
// MULTIPLE CHOICE
// ============================================================

function createQuestion(questionData) {

    currentQuestion =
        questionData;

    selectedAnswer = null;

    const matchingContainer =
        document.getElementById(
            "matching-container"
        );

    if (matchingContainer) {
        matchingContainer.style.display =
            "none";
    }

    const editor =
        document.getElementById(
            "code-editor"
        );

    if (editor) {
        editor.style.display =
            "none";
    }

    const checkButton =
        document.querySelector(
            ".check-button"
        );

    const answersContainer =
        document.querySelector(
            ".answers"
        );


    if (checkButton) {
        checkButton.style.display =
            "block";
    }


    if (answersContainer) {
        answersContainer.style.display =
            "flex";
    }


    // Question text

    const questionText =
        document.getElementById(
            "question-text"
        );

    if (questionText) {

        questionText.textContent =
            questionData.question;
    }


    // Optional code block

    const codeBlock =
        document.getElementById(
            "question-code"
        );

    if (codeBlock) {

        if (questionData.code) {

            codeBlock.textContent =
                questionData.code;

            codeBlock.style.display =
                "block";

        } else {

            codeBlock.style.display =
                "none";
        }
    }


    // Answer buttons

    const answers =
        document.querySelectorAll(
            ".answer"
        );


    answers.forEach(
        (button, index) => {

            // Hide buttons if there are
            // fewer answers than buttons

            if (
                questionData.answers[index] ===
                undefined
            ) {

                button.style.display =
                    "none";

                return;
            }


            button.style.display =
                "block";

            button.textContent =
                questionData.answers[index];

            button.classList.remove(
                "selected"
            );


            button.onclick =
                function () {

                    limpiarFeedback();

                    selectedAnswer =
                        index;


                    answers.forEach(
                        answer => {

                            answer.classList.remove(
                                "selected"
                            );
                        }
                    );


                    button.classList.add(
                        "selected"
                    );
                };
        }
    );


    // CHECK button

    if (checkButton) {

        checkButton.onclick =
            checkAnswer;
    }
}


// ============================================================
// QUESTION FEEDBACK (WRONG ANSWER FEEDBACK)
// ============================================================

function mostrarFeedback(mensaje, esError = true) {
    let feedbackEl = document.getElementById("question-feedback");
    const checkBtn = document.querySelector(".check-button");

    if (!feedbackEl) {
        feedbackEl = document.createElement("div");
        feedbackEl.id = "question-feedback";
        feedbackEl.className = "question-feedback";
        feedbackEl.setAttribute("role", "alert");
        if (checkBtn && checkBtn.parentNode) {
            checkBtn.parentNode.insertBefore(feedbackEl, checkBtn);
        } else {
            const questionSec = document.querySelector(".question");
            if (questionSec) questionSec.appendChild(feedbackEl);
        }
    }

    feedbackEl.innerHTML = `
        <div class="feedback-content ${esError ? 'feedback-error' : 'feedback-success'}">
            <span class="feedback-icon">${esError ? '⚠️' : '✅'}</span>
            <span class="feedback-text">${mensaje}</span>
        </div>
    `;
    feedbackEl.style.display = "block";

    if (checkBtn && esError) {
        checkBtn.classList.add("check-button-error");
        checkBtn.textContent = "INCORRECTO — INTENTA DE NUEVO";
    }
}

function limpiarFeedback() {
    const feedbackEl = document.getElementById("question-feedback");
    if (feedbackEl) {
        feedbackEl.style.display = "none";
        feedbackEl.innerHTML = "";
    }
    const checkBtn = document.querySelector(".check-button");
    if (checkBtn) {
        checkBtn.classList.remove("check-button-error");
        checkBtn.textContent = "COMPROBAR";
    }
}


// ============================================================
// CHECK MULTIPLE CHOICE ANSWER
// ============================================================

function checkAnswer() {

    if (selectedAnswer === null) {

        return;
    }


    if (
        selectedAnswer ===
        currentQuestion.correct
    ) {

        console.log("Correct!");
        playSound("correct");

        limpiarFeedback();

        nextActivity();

    } else {
        playSound("wrong");

        console.log("Wrong!");

        loseLife();

        let mensajeFeedback = "Respuesta incorrecta. ¡Inténtalo de nuevo!";
        if (currentQuestion && currentQuestion.feedback) {
            if (Array.isArray(currentQuestion.feedback) && currentQuestion.feedback[selectedAnswer]) {
                mensajeFeedback = currentQuestion.feedback[selectedAnswer];
            } else if (typeof currentQuestion.feedback === "object" && currentQuestion.feedback[selectedAnswer]) {
                mensajeFeedback = currentQuestion.feedback[selectedAnswer];
            } else if (typeof currentQuestion.feedback === "string") {
                mensajeFeedback = currentQuestion.feedback;
            }
        }

        mostrarFeedback(mensajeFeedback);
    }
}


// ============================================================
// MATCHING ACTIVITY
// ============================================================

function showMatching(activity) {

    const editor =
        document.getElementById(
            "code-editor"
        );

    if (editor) {
        editor.style.display =
            "none";
    }

    const codeBlock =
        document.getElementById(
            "question-code"
        );

    if (codeBlock) {
        codeBlock.style.display =
            "none";
    }


    const questionScreen =
        document.querySelector(
            ".question"
        );

    if (questionScreen) {

        questionScreen.style.display =
            "block";
    }


    // Hide multiple-choice answers

    const answersContainer =
        document.querySelector(
            ".answers"
        );

    if (answersContainer) {

        answersContainer.style.display =
            "none";
    }


    // Hide CHECK button

    const checkButton =
        document.querySelector(
            ".check-button"
        );

    if (checkButton) {

        checkButton.style.display =
            "none";
    }


    // Question text

    const questionText =
        document.getElementById(
            "question-text"
        );

    if (questionText) {

        questionText.textContent =
            activity.question;
    }


    // Create / reuse matching container

    let matchingContainer =
        document.getElementById(
            "matching-container"
        );


    if (!matchingContainer) {

        matchingContainer =
            document.createElement(
                "div"
            );

        matchingContainer.id =
            "matching-container";


        if (questionScreen) {

            questionScreen.appendChild(
                matchingContainer
            );
        }
    }


    matchingContainer.innerHTML = "";

    matchingContainer.style.display =
        "flex";


    let selectedLeft = null;

    let matchedPairs = 0;


    // --------------------------------------------------------
    // Columns
    // --------------------------------------------------------

    const leftColumn =
        document.createElement(
            "div"
        );

    const rightColumn =
        document.createElement(
            "div"
        );


    leftColumn.className =
        "matching-column";

    rightColumn.className =
        "matching-column";


    // --------------------------------------------------------
    // LEFT SIDE
    // --------------------------------------------------------

    activity.pairs.forEach(
        (pair, index) => {

            const leftButton =
                document.createElement(
                    "button"
                );


            leftButton.className =
                "matching-option left-option";


            leftButton.textContent =
                pair.left;


            leftButton.dataset.index =
                index;


            leftButton.onclick =
                function () {

                    if (
                        leftButton.classList.contains(
                            "matched"
                        )
                    ) {

                        return;
                    }


                    document
                        .querySelectorAll(
                            ".left-option"
                        )
                        .forEach(
                            button => {

                                button.classList.remove(
                                    "selected"
                                );
                            }
                        );


                    selectedLeft =
                        index;


                    leftButton.classList.add(
                        "selected"
                    );
                };


            leftColumn.appendChild(
                leftButton
            );
        }
    );


    // --------------------------------------------------------
    // RIGHT SIDE
    // --------------------------------------------------------

    const shuffledPairs =
        [...activity.pairs];


    shuffledPairs.sort(
        () => Math.random() - 0.5
    );


    shuffledPairs.forEach(
        pair => {

            const rightButton =
                document.createElement(
                    "button"
                );


            rightButton.className =
                "matching-option right-option";


            rightButton.textContent =
                pair.right;


            const originalIndex =
                activity.pairs.indexOf(
                    pair
                );


            rightButton.dataset.index =
                originalIndex;


            rightButton.onclick =
                function () {

                    if (
                        rightButton.classList.contains(
                            "matched"
                        )
                    ) {

                        return;
                    }


                    if (
                        selectedLeft === null
                    ) {

                        return;
                    }


                    // Correct match

                    if (
                        selectedLeft ===
                        originalIndex
                    ) {

                        const leftButton =
                            document.querySelector(
                                `.left-option[data-index="${originalIndex}"]`
                            );


                        if (leftButton) {

                            leftButton.classList.remove(
                                "selected"
                            );

                            leftButton.classList.add(
                                "matched"
                            );
                        }


                        rightButton.classList.add(
                            "matched"
                        );


                        matchedPairs++;

                        selectedLeft =
                            null;


                        // All pairs completed

                        if (
                            matchedPairs ===
                            activity.pairs.length
                        ) {

                            console.log(
                                "Matching complete!"
                            );


                            setTimeout(
                                () => {

                                    nextActivity();

                                },
                                500
                            );
                        }

                    }

                    // Wrong match

                    else {

                        console.log(
                            "Wrong match!"
                        );


                        loseLife();

                        mostrarFeedback("Esa relación no es correcta. ¡Intenta unir la opción adecuada!");


                        selectedLeft =
                            null;


                        document
                            .querySelectorAll(
                                ".left-option"
                            )
                            .forEach(
                                button => {

                                    button.classList.remove(
                                        "selected"
                                    );
                                }
                            );
                    }
                };


            rightColumn.appendChild(
                rightButton
            );
        }
    );


    // Add columns

    matchingContainer.appendChild(
        leftColumn
    );

    matchingContainer.appendChild(
        rightColumn
    );
}


// ============================================================
// CODE EXERCISE
// ============================================================

function showCodeExercise(activity) {

    const matchingContainer =
        document.getElementById(
            "matching-container"
        );


    if (matchingContainer) {

        matchingContainer.style.display =
            "none";
    }


    const questionScreen =
        document.querySelector(
            ".question"
        );


    if (questionScreen) {

        questionScreen.style.display =
            "block";
    }


    // Hide multiple choice

    const answersContainer =
        document.querySelector(
            ".answers"
        );


    if (answersContainer) {

        answersContainer.style.display =
            "none";
    }


    // Hide question code block

    const codeBlock =
        document.getElementById(
            "question-code"
        );


    if (codeBlock) {

        codeBlock.style.display =
            "none";
    }


    // Show CHECK

    const checkButton =
        document.querySelector(
            ".check-button"
        );


    if (checkButton) {

        checkButton.style.display =
            "block";
    }


    // Question

    const questionText =
        document.getElementById(
            "question-text"
        );


    if (questionText) {

        questionText.textContent =
            activity.question;
    }


    // Editor

    const editor =
        document.getElementById(
            "code-editor"
        );


    if (!editor) {
        return;
    }


    editor.style.display =
        "block";

    editor.value = "";

    editor.oninput = function () {
        limpiarFeedback();
    };


    // CHECK code

    if (checkButton) {

        checkButton.onclick =
            function () {

                const userCode =
                    editor.value.trim();

                let isMatch = false;

                if (Array.isArray(activity.expected)) {
                    isMatch = activity.expected.some(
                        exp => exp.trim() === userCode
                    );
                } else if (typeof activity.expected === "string") {
                    isMatch =
                        userCode === activity.expected.trim();
                }

                if (isMatch) {

                    console.log(
                        "Correct!"
                    );

                    limpiarFeedback();

                    nextActivity();

                } else {

                    console.log(
                        "Wrong!"
                    );

                    loseLife();

                    mostrarFeedback(
                        activity.feedback ||
                        "El código no coincide con lo esperado. Revisa bien las instrucciones, comillas y sintaxis."
                    );
                }
            };
    }
}


// ============================================================
// DEBUG EXERCISE
// ============================================================

function showDebugExercise(activity) {

    console.log(
        "Debug exercise:",
        activity
    );

    // Debug activities can be implemented here later.
}


// ============================================================
// COMPLETE LESSON
// ============================================================

async function completeLesson() {

    // --------------------------------------------------------
    // Hide lesson UI
    // --------------------------------------------------------

    const infoScreen =
        document.getElementById(
            "info-screen"
        );

    if (infoScreen) {
        infoScreen.style.display =
            "none";
    }


    const questionEl =
        document.querySelector(
            ".question"
        );

    if (questionEl) {
        questionEl.style.display =
            "none";
    }


    const checkBtn =
        document.querySelector(
            ".check-button"
        );

    if (checkBtn) {
        checkBtn.style.display =
            "none";
    }


    const matchingContainer =
        document.getElementById(
            "matching-container"
        );

    if (matchingContainer) {
        matchingContainer.style.display =
            "none";
    }


    const codeEditor =
        document.getElementById(
            "code-editor"
        );

    if (codeEditor) {
        codeEditor.style.display =
            "none";
    }


    // --------------------------------------------------------
    // Completion screen
    // --------------------------------------------------------

    const completionScreen =
        document.getElementById(
            "completion-screen"
        );


    const xpRewardElem =
        document.querySelector(
            ".xp-reward"
        );


    let subtitleElem =
        document.getElementById(
            "completion-subtitle"
        );


    // Create subtitle if needed

    if (!subtitleElem) {

        subtitleElem =
            document.createElement(
                "p"
            );


        subtitleElem.id =
            "completion-subtitle";


        subtitleElem.style.color =
            "#969baa";


        subtitleElem.style.fontSize =
            "14px";


        subtitleElem.style.marginTop =
            "-15px";


        subtitleElem.style.marginBottom =
            "25px";


        if (
            xpRewardElem &&
            xpRewardElem.parentNode
        ) {

            xpRewardElem.parentNode.insertBefore(
                subtitleElem,
                xpRewardElem.nextSibling
            );
        }
    }


    const currentKey =
        lessonId;


    // --------------------------------------------------------
    // First completion?
    // --------------------------------------------------------

    const isFirstTime =
        currentKey &&
        !completedLessons.includes(
            currentKey
        );


    if (isFirstTime) {

        // Give XP

        userXP += 25;


        completedLessons.push(
            currentKey
        );


        // UI

        if (xpRewardElem) {

            xpRewardElem.textContent =
                "+25 XP";

            xpRewardElem.style.color =
                "var(--accent)";
        }


        if (subtitleElem) {

            subtitleElem.textContent =
                "¡Felicidades! Ganaste 25 XP por completar esta lección por primera vez.";
        }


        // ----------------------------------------------------
        // Logged-in user
        // ----------------------------------------------------

        if (currentUser) {

            try {

                const progresoRef =
                    doc(
                        db,
                        "progreso",
                        currentUser.uid
                    );


                const snap =
                    await getDoc(
                        progresoRef
                    );


                let currentXP = 0;

                let currentWeeklyXP = 0;

                let existingCompleted = [];


                if (snap.exists()) {

                    const data =
                        snap.data();


                    currentXP =
                        Number(data.xp) || 0;


                    currentWeeklyXP =
                        Number(
                            data.weeklyXP !== undefined
                                ? data.weeklyXP
                                : data.xp
                        ) || 0;


                    existingCompleted =
                        data.cursos?.python?.completedLessons || [];
                }


                // Determine course
                let courseKey = "python";
                let firestoreField = "cursos.python.completedLessons";
                let cachePrefix = "";

                if (currentKey.startsWith("web")) {
                    courseKey = "web";
                    firestoreField = "cursos.web.completedLessons";
                    cachePrefix = "web_";
                    existingCompleted = data.cursos?.web?.completedLessons || [];
                } else if (currentKey.startsWith("db")) {
                    courseKey = "database";
                    firestoreField = "cursos.database.completedLessons";
                    cachePrefix = "db_";
                    existingCompleted = data.cursos?.database?.completedLessons || [];
                }

                // Avoid duplicates
                if (!existingCompleted.includes(currentKey)) {
                    existingCompleted.push(currentKey);
                }

                // Save to Firestore
                const updatePayload = {
                    xp: currentXP + 25,
                    weeklyXP: currentWeeklyXP + 25
                };
                updatePayload[firestoreField] = existingCompleted;

                await updateDoc(progresoRef, updatePayload);

                if (cachePrefix) {
                    localStorage.setItem(
                        `kodicode_completed_${cachePrefix}${currentUser.uid}`,
                        JSON.stringify(existingCompleted)
                    );
                }


                // Update cache

                localStorage.setItem(
                    `kodicode_completed_${currentUser.uid}`,
                    JSON.stringify(
                        existingCompleted
                    )
                );


                localStorage.setItem(
                    `kodicode_xp_${currentUser.uid}`,
                    (
                        currentXP + 25
                    ).toString()
                );


            } catch (err) {

                console.error(
                    "Error guardando progreso en Firestore:",
                    err
                );
            }


        }

        // ----------------------------------------------------
        // Guest
        // ----------------------------------------------------

        else {

            localStorage.setItem(
                "kodicode_completed_guest",
                JSON.stringify(
                    completedLessons
                )
            );


            localStorage.setItem(
                "kodicode_xp_guest",
                userXP.toString()
            );
        }


    }

    // --------------------------------------------------------
    // Already completed
    // --------------------------------------------------------

    else {

        if (xpRewardElem) {

            xpRewardElem.textContent =
                "+0 XP";

            xpRewardElem.style.color =
                "#969baa";
        }


        if (subtitleElem) {

            subtitleElem.textContent =
                "Lección ya completada anteriormente. Solo ganas experiencia la primera vez.";
        }
    }


    // --------------------------------------------------------
    // Show completion screen
    // --------------------------------------------------------

    if (completionScreen) {

        completionScreen.style.display =
            "flex";
    }


    console.log(
        "XP actual:",
        userXP,

        "¿Primera vez completada?:",
        isFirstTime
    );
}


// ============================================================
// NEXT ACTIVITY
// ============================================================

function nextActivity() {

    limpiarFeedback();

    currentActivityIndex++;

    showActivity();
}


// ============================================================
// FINISH LESSON
// ============================================================

function finishLesson() {

    completeLesson();
}


// ============================================================
// RETRY BUTTON
// ============================================================

const retryBtn =
    document.getElementById(
        "retry-button"
    );


if (retryBtn) {

    retryBtn.onclick =
        function () {

            resetLives();


            const gameOverScreen =
                document.getElementById(
                    "game-over-screen"
                );


            if (gameOverScreen) {

                gameOverScreen.style.display =
                    "none";
            }


            startLesson();
        };
}


// ============================================================
// EXIT BUTTON
// ============================================================

const exitBtn =
    document.getElementById(
        "exit-button"
    );


function getTargetCoursePage() {
    if (lessonId && lessonId.startsWith("web")) return "web.html";
    if (lessonId && lessonId.startsWith("db")) return "database.html";
    return "python.html";
}

if (exitBtn) {
    exitBtn.onclick = function () {
        window.location.href = getTargetCoursePage();
    };
}


// ============================================================
// GO BACK TO COURSE
// ============================================================

function goBackToCourse() {
    window.location.href = getTargetCoursePage();
}


// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

// Needed for inline onclick="" buttons

window.openLesson =
    openLesson;

window.checkAnswer =
    checkAnswer;

window.goBackToCourse =
    goBackToCourse;

window.nextActivity =
    nextActivity;

window.finishLesson =
    finishLesson;

window.completeLesson =
    completeLesson;

window.mostrarFeedback =
    mostrarFeedback;

window.limpiarFeedback =
    limpiarFeedback;


// ============================================================
// INITIALIZE LESSON
// ============================================================

if (currentLesson) {

    startLesson();
}

