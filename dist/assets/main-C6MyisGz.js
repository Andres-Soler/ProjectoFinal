import{C as e,D as t,E as n,O as r,S as i,T as a,_ as o,a as s,c,d as l,f as u,g as d,i as f,k as p,l as m,m as h,n as g,o as _,p as v,r as y,s as b,t as x,v as ee,w as te,x as ne,y as re}from"./navbar-85-dsNbQ.js";var S,C=p((()=>{S=`data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='130'%20height='70'%20viewBox='0%200%20130%2070'%20fill='none'%3e%3cg%20fill='%2315131C'%20stroke='%2315131C'%20stroke-width='6'%20stroke-linejoin='round'%3e%3ccircle%20cx='36'%20cy='46'%20r='14'/%3e%3ccircle%20cx='58'%20cy='34'%20r='20'/%3e%3ccircle%20cx='86'%20cy='36'%20r='17'/%3e%3ccircle%20cx='106'%20cy='46'%20r='13'/%3e%3crect%20x='36'%20y='46'%20width='70'%20height='13'%20rx='6'/%3e%3c/g%3e%3cg%20fill='%23FFFFFF'%3e%3ccircle%20cx='36'%20cy='46'%20r='14'/%3e%3ccircle%20cx='58'%20cy='34'%20r='20'/%3e%3ccircle%20cx='86'%20cy='36'%20r='17'/%3e%3ccircle%20cx='106'%20cy='46'%20r='13'/%3e%3crect%20x='36'%20y='46'%20width='70'%20height='13'%20rx='6'/%3e%3c/g%3e%3c/svg%3e`})),w,T=p((()=>{w=`/assets/python-logo-yw-cT82l.png`})),ie=p((()=>{}));async function ae(){let e=document.getElementById(`app`);if(!e){console.error(`❌ No se encontró #app`);return}let t=y.currentUser;if(!t)window.location.hash=`#login`;else try{let n=h(f,`usuarios`,t.uid),r=await c(n),i=t.email;if(r.exists()){let e=r.data();e.nombre&&(i=e.nombre)}let a=h(f,`progreso`,t.uid),o=await c(a),s=0;o.exists()&&(s=o.data().xp||0),e.innerHTML=`

            <div class="stars">

                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>

            </div>


            <div class="inicio">



                <section class="welcome-card">


                    <h1>
                        ¡Hola, ${i}! 👋
                    </h1>



                    <p>
                        Continúa aprendiendo donde lo dejaste.
                    </p>



                    <div class="xp-mini">

                        ⭐ ${s} XP

                    </div>



                </section>






                <section class="mis-cursos">


                    <h2>
                        Mis cursos
                    </h2>





                    <div class="curso-card">



                        <div class="curso-icon">

                            <img src="${w}" alt="Python" class="curso-icon-img">

                        </div>




                        <div class="curso-info">



                            <h3>
                                Python Fundamentals
                            </h3>



                            <p>
                                Aprende los fundamentos de Python.
                            </p>




                            <button 
                                id="btnPython"
                                class="curso-btn"
                            >

                                CONTINUAR

                            </button>




                        </div>



                    </div>




                </section>





            </div>


        `,document.getElementById(`btnPython`).addEventListener(`click`,()=>{window.location.href=`python.html`})}catch(t){console.error(`❌ Error cargando inicio:`,t),e.innerHTML=`


            <div class="inicio">


                <section class="welcome-card">


                    <h1>
                        ¡Hola! 👋
                    </h1>


                    <p>
                        No pudimos cargar tu progreso.
                    </p>


                </section>


            </div>


        `}}var oe=p((()=>{s(),_(),T(),ie()})),se=p((()=>{}));function E(e,t=`No se pudo iniciar sesión. Inténtalo de nuevo.`){switch(e.code){case`auth/invalid-credential`:case`auth/wrong-password`:case`auth/user-not-found`:return`Correo o contraseña incorrectos.`;case`auth/invalid-email`:return`Escribe un correo válido.`;case`auth/user-disabled`:return`Esta cuenta está deshabilitada.`;case`auth/too-many-requests`:return`Demasiados intentos. Espera un momento e inténtalo otra vez.`;case`auth/network-request-failed`:return`No hay conexión. Revisa tu internet.`;default:return t}}function ce(){let t=document.querySelector(`main`);t.innerHTML=`
        <div class="login-page">
            <div class="login-card">
                <h2>Iniciar Sesión</h2>

                <input
                    type="email"
                    id="correo"
                    placeholder="Correo electrónico"
                    autocomplete="email"
                />

                <input
                    type="password"
                    id="contrasena"
                    placeholder="Contraseña"
                    autocomplete="current-password"
                />

                <p class="login-message" id="mensajeLogin" role="status"></p>

                <button id="btnLogin" type="button">
                    Ingresar
                </button>

                <button id="btnOlvide" type="button" class="link-btn">
                    ¿Olvidaste tu contraseña?
                </button>
            </div>
        </div>
    `;let n=document.getElementById(`mensajeLogin`),r=(e,t=!1)=>{n.textContent=e,n.classList.toggle(`ok`,t)},i=document.getElementById(`btnLogin`);i.addEventListener(`click`,async()=>{let e=document.getElementById(`correo`).value.trim(),t=document.getElementById(`contrasena`).value;if(!e||!t)r(`Escribe tu correo y tu contraseña.`);else{i.disabled=!0,r(``);try{await te(y,e,t),window.location.hash=`#inicio`;let n=window.location.pathname.toLowerCase();!n.endsWith(`index.html`)&&!n.endsWith(`kodicode.html`)&&n!==`/`&&n!==``&&(window.location.href=`index.html#inicio`)}catch(e){console.error(`Código:`,e.code),r(E(e)),i.disabled=!1}}}),document.getElementById(`btnOlvide`).addEventListener(`click`,async()=>{let t=document.getElementById(`correo`).value.trim();if(!t)r(`Escribe tu correo arriba y toca de nuevo "¿Olvidaste tu contraseña?".`);else try{y.languageCode=`es`,await e(y,t),r(`Si ese correo está registrado, te enviamos un enlace para crear una contraseña nueva. Revisa también la carpeta de spam.`,!0)}catch(e){console.error(`Código:`,e.code),r(E(e,`No se pudo enviar el correo. Inténtalo de nuevo.`))}})}var D=p((()=>{d(),s(),se()}));function le(e){return String(e??``).toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).replace(/[013457@$!+]/g,e=>N[e]??e).replace(/(.)\1{2,}/g,`$1`)}function O(e){let t=le(e),n=t.split(/[^a-z]+/).filter(Boolean),r=t.replace(/[^a-z]/g,``);return n.some(e=>{let t=e.endsWith(`s`)?e.slice(0,-1):e;return j.includes(e)||j.includes(t)})||M.some(e=>r.includes(e))}function k(e){let t=String(e??``).trim();return t.length<2?{ok:!1,motivo:`El nombre debe tener al menos 2 caracteres.`}:t.length>24?{ok:!1,motivo:`El nombre no puede pasar de 24 caracteres.`}:O(t)?{ok:!1,motivo:`Elige otro nombre: ese contiene palabras no permitidas.`}:{ok:!0,nombre:t}}function ue(e,t=`Programador`){return O(e)?t:e}function A(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}var j,M,N,P=p((()=>{j=`puta.puto.verga.culo.zorra.perra.pendejo.pendeja.cabron.cabrona.marica.marico.imbecil.estupido.estupida.idiota.retrasado.retrasada.hp.hpta.hdp.jodete.joder.pija.chinga.nazi.violador.pedofilo`.split(`.`),M=[`hijueputa`,`hijodeputa`,`hijoputa`,`malparido`,`malparida`,`gonorrea`,`mierda`,`maricon`,`pendejo`,`chingad`,`carechimba`,`carepicha`,`careverga`,`mamaverga`,`mamahuevo`,`putamadre`,`sapahijueputa`],N={0:`o`,1:`i`,3:`e`,4:`a`,5:`s`,7:`t`,"@":`a`,$:`s`,"!":`i`,"+":`t`}})),de=p((()=>{}));function fe(){let e=document.querySelector(`main`);if(!e){console.error(`No se encontró <main>`);return}e.innerHTML=`
        <div class="registro-container">
            <section class="registro">
                <h1>Crear cuenta</h1>

                <form id="registroForm">
                    <label for="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        placeholder="Tu nombre"
                        maxlength="24"
                        autocomplete="name"
                        required
                    >

                    <label for="email">Correo</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="correo@ejemplo.com"
                        autocomplete="email"
                        required
                    >

                    <label for="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Mínimo 6 caracteres"
                        autocomplete="new-password"
                        required
                    >

                    <button type="submit">Registrarse</button>
                </form>

                <p id="mensajeRegistro"></p>
            </section>
        </div>
    `;let t=document.querySelector(`#registroForm`),n=document.querySelector(`#mensajeRegistro`),r=t.querySelector(`button[type="submit"]`);function i(e,t=!1){n.textContent=e,n.style.color=t?`var(--red, #E63946)`:``}t.addEventListener(`submit`,async e=>{e.preventDefault();let n=document.querySelector(`#nombre`).value.trim(),o=document.querySelector(`#email`).value.trim(),s=document.querySelector(`#password`).value,c=k(n);if(!c.ok)i(c.motivo,!0);else if(s.length<6)i(`La contraseña debe tener al menos 6 caracteres.`,!0);else{r.disabled=!0,i(`Creando cuenta...`);try{let e=(await ee(y,o,s)).user;await l(h(f,`usuarios`,e.uid),{nombre:c.nombre,email:o,uid:e.uid,fechaRegistro:new Date}),await l(h(f,`progreso`,e.uid),{xp:0,cursos:{python:{completedLessons:[]}}}),console.log(`Usuario registrado:`,e.uid),i(`¡Cuenta creada correctamente!`),t.reset(),window.location.hash=`#inicio`;let n=window.location.pathname.toLowerCase();!n.endsWith(`index.html`)&&!n.endsWith(`kodicode.html`)&&n!==`/`&&n!==``&&(window.location.href=`index.html#inicio`)}catch(e){console.error(`Error al registrar:`,e),i(a(e),!0),r.disabled=!1}}});function a(e){switch(e.code){case`auth/email-already-in-use`:return`Ese correo ya está registrado.`;case`auth/invalid-email`:return`El correo no es válido.`;case`auth/weak-password`:return`La contraseña es demasiado débil.`;case`auth/missing-password`:return`Debes escribir una contraseña.`;case`auth/network-request-failed`:return`No hay conexión. Revisa tu internet.`;case`auth/too-many-requests`:return`Demasiados intentos. Espera un momento e inténtalo otra vez.`;default:return`No se pudo crear la cuenta.`}}}var pe=p((()=>{d(),_(),s(),P(),de()})),me=p((()=>{}));function he(e){let t=R[e]||R.info,n=e===`peligro`?`#15131C`:`#FFFFFF`;return`<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle transform="translate(1.5 1.5)" cx="12" cy="12" r="8.5" fill="#15131C" stroke="#15131C" stroke-width="2"/>
        <circle cx="12" cy="12" r="8.5" fill="${t}" stroke="#15131C" stroke-width="2"/>
        ${{exito:`<path d="M8 12.3 L10.8 15 L16 9.2" stroke="${n}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,error:`<path d="M8.8 8.8 L15.2 15.2 M15.2 8.8 L8.8 15.2" stroke="${n}" stroke-width="2" stroke-linecap="round"/>`,info:`<path d="M12 11 V16" stroke="${n}" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="8" r="1.1" fill="${n}"/>`,peligro:`<path d="M12 7.5 V13" stroke="${n}" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.3" r="1.1" fill="${n}"/>`}[e]||``}
    </svg>`}function F(e,t){let n=document.createElement(e);return t&&(n.className=t),n}function I({tipo:e,titulo:t,mensaje:n,campo:r=null,botones:i,cancelar:a}){return new Promise(o=>{let s=document.activeElement,c=F(`div`,`kc-dialogo-fondo`),l=F(`div`,`kc-dialogo kc-${e}`);l.setAttribute(`role`,`dialog`),l.setAttribute(`aria-modal`,`true`),l.setAttribute(`aria-labelledby`,`kc-dialogo-titulo`),l.setAttribute(`aria-describedby`,`kc-dialogo-mensaje`);let u=F(`div`,`kc-dialogo-icono`);u.innerHTML=he(e);let d=F(`h2`);d.id=`kc-dialogo-titulo`,d.textContent=t;let f=F(`p`);f.id=`kc-dialogo-mensaje`,f.textContent=n,l.append(u,d,f),r&&l.append(r);let p=F(`div`,`kc-dialogo-botones`),m=i.map(e=>{let t=F(`button`,`kc-btn kc-btn-${e.estilo}`);return t.type=`button`,t.textContent=e.texto,t.addEventListener(`click`,()=>h(e.resultado())),p.append(t),t});l.append(p),c.append(l);function h(e){document.removeEventListener(`keydown`,g),c.remove(),s&&s.focus&&s.focus(),o(e)}function g(e){e.key===`Escape`?h(a()):e.key===`Enter`&&r&&document.activeElement===r&&m[0].click()}document.addEventListener(`keydown`,g),c.addEventListener(`click`,e=>{e.target===c&&h(a())}),document.body.append(c),(r||m[0]).focus()})}function L(e,{titulo:t=`Aviso`,tipo:n=`info`,boton:r=`Entendido`}={}){return I({tipo:n,titulo:t,mensaje:e,botones:[{texto:r,estilo:`primario`,resultado:()=>void 0}],cancelar:()=>void 0})}function ge(e,{titulo:t=`¿Estás seguro?`,si:n=`Sí`,no:r=`Cancelar`,tipo:i=`peligro`}={}){return I({tipo:i,titulo:t,mensaje:e,botones:[{texto:n,estilo:i===`peligro`?`peligro`:`primario`,resultado:()=>!0},{texto:r,estilo:`secundario`,resultado:()=>!1}],cancelar:()=>!1})}function _e(e,{titulo:t=`Escribe aquí`,tipo:n=`info`,tipoCampo:r=`password`,placeholder:i=``,boton:a=`Aceptar`}={}){let o=F(`input`,`kc-dialogo-input`);return o.type=r,o.placeholder=i,o.autocomplete=r===`password`?`current-password`:`off`,I({tipo:n,titulo:t,mensaje:e,campo:o,botones:[{texto:a,estilo:`primario`,resultado:()=>o.value},{texto:`Cancelar`,estilo:`secundario`,resultado:()=>null}],cancelar:()=>null})}var R,ve=p((()=>{me(),R={exito:`#14b8a6`,error:`#f43f5e`,info:`#6C4CFF`,peligro:`#fbbf24`}})),ye=p((()=>{}));function z(e){return`
        ${W}
        <div class="inicio">
            <div class="user-card">
                ${e}
            </div>
        </div>
    `}function B(){window.location.hash=`#login`,window.location.reload()}function V(e){switch(e.code){case`auth/wrong-password`:case`auth/invalid-credential`:return`La contraseña actual no es correcta.`;case`auth/weak-password`:return`La nueva contraseña es muy débil (mínimo 6 caracteres).`;case`auth/email-already-in-use`:return`Ese correo ya está en uso por otra cuenta.`;case`auth/invalid-email`:return`El correo no es válido.`;case`auth/requires-recent-login`:return`Por seguridad, cierra sesión, vuelve a entrar e inténtalo de nuevo.`;case`auth/too-many-requests`:return`Demasiados intentos. Espera un momento e inténtalo otra vez.`;case`auth/network-request-failed`:return`No hay conexión. Revisa tu internet.`;default:return`No se pudo completar el cambio. Inténtalo de nuevo.`}}async function H(e=``){let r=document.getElementById(`app`),s=y.currentUser;if(!s){r.innerHTML=z(`
            <h2>No has iniciado sesión</h2>
            <p>Debes iniciar sesión para ver tu información.</p>
        `);return}let l=h(f,`usuarios`,s.uid);try{let d=await c(l);if(!d.exists()){r.innerHTML=z(`
                <h2>Usuario</h2>
                <p>No se encontraron los datos de tu perfil.</p>
            `);return}let f=d.data();s.email&&f.email!==s.email&&(u(l,{email:s.email}).catch(()=>{}),f.email=s.email),r.innerHTML=z(`
            <h2>Mi Usuario</h2>

            ${e?`<p class="user-message ok">${A(e)}</p>`:``}

            <div class="user-info">
                <p><strong>Nombre:</strong> ${A(f.nombre)}</p>
                <p><strong>Correo:</strong> ${A(s.email||f.email)}</p>
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
        `),document.getElementById(`btnModificar`).addEventListener(`click`,()=>{r.innerHTML=z(`
                <h2>Modificar datos</h2>

                <p class="user-message" id="mensajeUsuario" role="status"></p>

                <label for="nombre">Nombre:</label>
                <input class="user-input" type="text" id="nombre" maxlength="24" autocomplete="name"
                    value="${A(f.nombre||``)}">

                <label for="correo">Correo electrónico:</label>
                <input class="user-input" type="email" id="correo" autocomplete="email"
                    value="${A(s.email||``)}">

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
            `);let e=document.getElementById(`mensajeUsuario`),a=(t,n=!1)=>{e.textContent=t,e.classList.toggle(`ok`,n)};document.getElementById(`btnGuardar`).addEventListener(`click`,async e=>{let r=e.currentTarget,c=k(document.getElementById(`nombre`).value),d=document.getElementById(`correo`).value.trim(),p=document.getElementById(`nuevaContrasena`).value,m=document.getElementById(`confirmarContrasena`).value,h=document.getElementById(`contrasenaActual`).value;if(!c.ok)return a(c.motivo);if(!U.test(d))return a(`Escribe un correo válido.`);let g=c.nombre!==(f.nombre||``),_=d.toLowerCase()!==(s.email||``).toLowerCase(),v=p.length>0;if(v){if(p.length<6)return a(`La nueva contraseña debe tener al menos 6 caracteres.`);if(p!==m)return a(`Las contraseñas nuevas no coinciden.`)}if((_||v)&&!h)return a(`Escribe tu contraseña actual para cambiar el correo o la contraseña.`);if(!g&&!_&&!v)return a(`No hay cambios para guardar.`);r.disabled=!0,r.textContent=`Guardando...`,a(``);let y=[],b=`Datos actualizados correctamente.`;try{if(g&&(await u(l,{nombre:c.nombre}),y.push(`el nombre`)),_||v){let e=o.credential(s.email,h);await i(s,e)}v&&(await n(s,p),y.push(`la contraseña`)),_&&(await t(s,d),b+=` Te enviamos un enlace de confirmación a ${d}: tu correo cambiará cuando lo abras.`),H(b)}catch(e){console.error(`Error actualizando datos:`,e);let t=V(e);y.length&&(t+=` (Ya se guardó ${y.join(` y `)}.)`),a(t),r.disabled=!1,r.textContent=`Guardar cambios`}}),document.getElementById(`btnCancelar`).addEventListener(`click`,()=>{H()})}),document.getElementById(`btnCerrarSesionPerfil`).addEventListener(`click`,async()=>{try{await a(y),B()}catch(e){console.error(`Error al cerrar sesión:`,e),L(`No se pudo cerrar la sesión. Inténtalo de nuevo.`,{tipo:`error`,titulo:`Ups`})}}),document.getElementById(`btnEliminarCuenta`).addEventListener(`click`,async()=>{if(await ge(`Se borrarán tus datos de usuario. Esta acción no se puede deshacer.`,{titulo:`¿Eliminar tu cuenta?`,si:`Sí, eliminar`,no:`Cancelar`,tipo:`peligro`}))try{let e=await _e(`Escribe tu contraseña para confirmar.`,{titulo:`Confirma tu contraseña`,boton:`Eliminar cuenta`});if(!e)return;let t=o.credential(s.email,e);await i(s,t),await b(l),await re(s),await L(`Tu cuenta fue eliminada correctamente.`,{tipo:`exito`,titulo:`Cuenta eliminada`}),B()}catch(e){console.error(`Error eliminando cuenta:`,e),L(V(e),{tipo:`error`,titulo:`No se pudo eliminar`})}})}catch(e){console.error(`Error obteniendo datos:`,e),r.innerHTML=z(`
            <h2>Error</h2>
            <p>No se pudieron cargar los datos del usuario.</p>
        `)}}var U,W,be=p((()=>{d(),_(),s(),P(),ve(),ye(),U=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,W=`
    <div class="stars">
        <span>✦</span>
        <span>✧</span>
        <span>✦</span>
        <span>✧</span>
        <span>✦</span>
    </div>
`})),G,xe=p((()=>{G=`data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%3e%3cpath%20transform='translate(1.5%201.5)'%20d='M7%203.5%20H17%20V10%20C17%2013%2014.8%2015%2012%2015%20C9.2%2015%207%2013%207%2010%20Z'%20fill='%230b1220'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3crect%20transform='translate(1.5%201.5)'%20x='8'%20y='18'%20width='8'%20height='3'%20rx='1'%20fill='%230b1220'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3cpath%20d='M7%206%20H4%20V8%20C4%209.8%205.4%2010.8%207%2010.8'%20fill='none'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3cpath%20d='M17%206%20H20%20V8%20C20%209.8%2018.6%2010.8%2017%2010.8'%20fill='none'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3cpath%20d='M7%203.5%20H17%20V10%20C17%2013%2014.8%2015%2012%2015%20C9.2%2015%207%2013%207%2010%20Z'%20fill='%23fbbf24'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3cpath%20d='M12%2015%20V18'%20fill='none'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3crect%20x='8'%20y='18'%20width='8'%20height='3'%20rx='1'%20fill='%2314b8a6'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3c/svg%3e`})),K,Se=p((()=>{K=`data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%3e%3cpath%20transform='translate(1.5%201.5)'%20d='M3.5%208%20L8%2012%20L12%205%20L16%2012%20L20.5%208%20L19%2019%20H5%20Z'%20fill='%230b1220'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3cpath%20d='M3.5%208%20L8%2012%20L12%205%20L16%2012%20L20.5%208%20L19%2019%20H5%20Z'%20fill='%23fbbf24'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3cpath%20d='M5.8%2015.5%20H18.2'%20fill='none'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3ccircle%20cx='12'%20cy='11.5'%20r='1.3'%20fill='%2314b8a6'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3c/svg%3e`})),q,Ce=p((()=>{q=`data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%3e%3ccircle%20transform='translate(1.5%201.5)'%20cx='12'%20cy='15'%20r='5.5'%20fill='%230b1220'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3cpath%20d='M7.5%203%20L12%2011%20L16.5%203%20Z'%20fill='%2314b8a6'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3ccircle%20cx='12'%20cy='15'%20r='5.5'%20fill='%23cbd5e1'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3ccircle%20cx='12'%20cy='15'%20r='2'%20fill='%23ffffff'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3c/svg%3e`})),J,we=p((()=>{J=`data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%3e%3ccircle%20transform='translate(1.5%201.5)'%20cx='12'%20cy='15'%20r='5.5'%20fill='%230b1220'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3cpath%20d='M7.5%203%20L12%2011%20L16.5%203%20Z'%20fill='%2314b8a6'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3ccircle%20cx='12'%20cy='15'%20r='5.5'%20fill='%23d98b4a'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3ccircle%20cx='12'%20cy='15'%20r='2'%20fill='%23ffffff'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3c/svg%3e`})),Y,Te=p((()=>{Y=`data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%3e%3cpath%20transform='translate(1.5%201.5)'%20d='M13.5%203%20L5.5%2013.5%20H11%20L9.5%2021%20L18.5%209.5%20H12.5%20Z'%20fill='%230b1220'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3cpath%20d='M13.5%203%20L5.5%2013.5%20H11%20L9.5%2021%20L18.5%209.5%20H12.5%20Z'%20fill='%23fbbf24'%20stroke='%230b1220'%20stroke-width='2'%20stroke-linejoin='round'%20stroke-linecap='round'/%3e%3c/svg%3e`})),Ee=p((()=>{}));async function X(){let e=document.getElementById(`app`);if(!e){console.error(`❌ No se encontró #app`);return}let t=`
        <img src="${S}" class="cloud cloud-1" alt="Nube decorativa">
        <img src="${S}" class="cloud cloud-2" alt="Nube decorativa">
        <div class="stars">
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
        </div>
    `;e.innerHTML=`
        ${t}
        <div class="leaderboard-page">
            <header class="leaderboard-header">
                ${Q}
                <h1>Tabla de Clasificación</h1>
                <p>Compite con otros estudiantes y sube en el podio esta semana.</p>
            </header>
            <div class="leaderboard-loading">
                <div class="spinner"></div>
                <p>Cargando posiciones...</p>
            </div>
        </div>
    `;try{let n=await m(v(f,`usuarios`)),r=await m(v(f,`progreso`)),i={};r.forEach(e=>{i[e.id]=e.data()});let a=[];if(n.forEach(e=>{let t=e.data(),n=i[e.id]||{},r=n.weeklyXP===void 0?n.xp||0:n.weeklyXP,o=t.nombre||(t.email?t.email.split(`@`)[0]:`Programador`);a.push({uid:e.id,nombre:ue(o),email:t.email||``,weeklyXP:Number(r)||0,totalXP:Number(n.xp)||0})}),a.length<10){let e=[{uid:`demo_1`,nombre:`Valentina Code`,weeklyXP:380,isDemo:!0},{uid:`demo_2`,nombre:`Carlos Py`,weeklyXP:320,isDemo:!0},{uid:`demo_3`,nombre:`Mateo Algoritmos`,weeklyXP:290,isDemo:!0},{uid:`demo_4`,nombre:`Sofía Dev`,weeklyXP:250,isDemo:!0},{uid:`demo_5`,nombre:`Sebastián Logic`,weeklyXP:210,isDemo:!0},{uid:`demo_6`,nombre:`Camila JS`,weeklyXP:180,isDemo:!0},{uid:`demo_7`,nombre:`Daniel Loops`,weeklyXP:140,isDemo:!0},{uid:`demo_8`,nombre:`Mariana Git`,weeklyXP:110,isDemo:!0},{uid:`demo_9`,nombre:`Alejandro Data`,weeklyXP:90,isDemo:!0}],t=new Set(a.map(e=>e.uid));for(let n of e)!t.has(n.uid)&&a.length<10&&a.push(n)}a.sort((e,t)=>t.weeklyXP-e.weeklyXP);let o=y.currentUser,s=o?o.uid:null,c=s?a.findIndex(e=>e.uid===s):-1,l=c===-1?null:c+1,u=c===-1?null:a[c],d=a.slice(0,10);if(d.length===0){e.innerHTML=`
                ${t}
                <div class="leaderboard-page">
                    <header class="leaderboard-header">
                        ${Q}
                        <h1>Tabla de Clasificación</h1>
                        <p>Los 10 usuarios con más experiencia acumulada esta semana.</p>
                    </header>
                    <div class="leaderboard-loading">
                        <p>Aún no hay usuarios con XP acumulado. ¡Completa lecciones para aparecer aquí!</p>
                    </div>
                </div>
            `;return}let p=e=>{if(!e)return`U`;let t=e.trim().split(` `);return t.length>=2?(t[0][0]+t[1][0]).toUpperCase():e.substring(0,2).toUpperCase()},h=(e,t,n)=>{let r=s&&e.uid===s,i=A(e.nombre);return`
                <div class="podium-card ${t} ${r?`is-current-user`:``}">
                    <div class="podium-badge">${n}</div>
                    <div class="podium-avatar">${A(p(e.nombre))}</div>
                    <div class="podium-name" title="${i}">
                        ${i} ${r?`<span class="you-badge">Tú</span>`:``}
                    </div>
                    <div class="podium-xp">${$(e.weeklyXP)}</div>
                </div>
            `};e.innerHTML=`
            ${t}
            <div class="leaderboard-page">
                <header class="leaderboard-header">
                    ${Q}
                    <h1>Tabla de Clasificación</h1>
                    <p>Los 10 usuarios con más experiencia acumulada esta semana.</p>
                </header>

                ${(()=>{let[e,t,n]=d,r=`<div class="podium-container">`;return t&&(r+=h(t,`second`,Z(q,34))),e&&(r+=h(e,`first`,Z(K,38))),n&&(r+=h(n,`third`,Z(J,34))),r+=`</div>`,r})()}
                ${(()=>{let e=d.slice(3);if(e.length===0)return``;let t=`<div class="ranking-list">`;return e.forEach((e,n)=>{let r=n+4,i=s&&e.uid===s;t+=`
                    <div class="ranking-item ${i?`is-current-user`:``}">
                        <div class="ranking-left">
                            <span class="ranking-pos">#${r}</span>
                            <div class="ranking-avatar">${A(p(e.nombre))}</div>
                            <div class="ranking-info">
                                <span class="ranking-name">
                                    ${A(e.nombre)}
                                    ${i?`<span class="you-badge">Tú</span>`:``}
                                </span>
                            </div>
                        </div>
                        <div class="ranking-xp">
                            ${$(e.weeklyXP)}
                        </div>
                    </div>
                `}),t+=`</div>`,t})()}
                ${(()=>{if(!s||!u||l<=10)return``;let e=d[9]?Math.max(0,d[9].weeklyXP-u.weeklyXP+1):0;return`
                <div class="current-user-banner">
                    <div class="user-rank-status">
                        <div class="rank-circle">#${l}</div>
                        <div class="user-meta">
                            <h4>Tu posición semanal: #${l}</h4>
                            <p>${u.weeklyXP} XP acumulados esta semana ${e>0?`• ¡Te faltan ${e} XP para entrar al Top 10!`:``}</p>
                        </div>
                    </div>
                    <div class="ranking-xp">
                        ${$(u.weeklyXP)}
                    </div>
                </div>
            `})()}
            </div>
        `}catch(n){console.error(`❌ Error cargando leaderboard:`,n),e.innerHTML=`
            ${t}
            <div class="leaderboard-page">
                <header class="leaderboard-header">
                    ${Q}
                    <h1>Tabla de Clasificación</h1>
                </header>
                <div class="leaderboard-loading">
                    <p>No se pudo cargar la tabla de clasificación en este momento.</p>
                    <button class="primary-btn" onclick="window.location.reload()" style="background:#2778FF;color:#fff;border:none;padding:10px 20px;border-radius:12px;font-family:inherit;font-weight:600;cursor:pointer;margin-top:10px;">
                        Reintentar
                    </button>
                </div>
            </div>
        `}}var Z,Q,$,De=p((()=>{s(),_(),C(),xe(),Se(),Ce(),we(),Te(),P(),Ee(),Z=(e,t)=>`<img src="${e}" alt="" width="${t}" height="${t}" style="vertical-align:middle">`,Q=`<div class="badge-tag">${Z(G,20)} Ranking Semanal</div>`,$=e=>`${Z(Y,16)} ${e} XP`})),Oe=r((()=>{d(),s(),x(),oe(),D(),pe(),be(),De();async function e(e){if(g(),!e)switch(window.location.hash){case`#login`:ce();return;case`#registro`:fe();return;case`#leaderboard`:await X();return;default:window.location.hash=`#login`;return}if(!window.location.hash||window.location.hash===`#login`||window.location.hash===`#registro`)window.location.hash=`#inicio`;else switch(window.location.hash){case`#usuario`:await H();break;case`#leaderboard`:await X();break;default:await ae()}}ne(y,async t=>{console.log(t?`Usuario conectado: ${t.uid}`:`No hay usuario conectado`),await e(t)}),window.addEventListener(`hashchange`,async()=>{await e(y.currentUser)})}));export{Oe as t};