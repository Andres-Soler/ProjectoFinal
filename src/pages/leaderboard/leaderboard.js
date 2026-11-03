import { auth, db } from '../../firebaseConfig.js';
import { collection, getDocs } from 'firebase/firestore';
import cloud from '../../../assets/images/cloud.svg';
import iconTrophy from '../../../assets/images/icon-trophy.svg';
import iconCrown from '../../../assets/images/icon-crown.svg';
import iconMedalSilver from '../../../assets/images/icon-medal-silver.svg';
import iconMedalBronze from '../../../assets/images/icon-medal-bronze.svg';
import iconBolt from '../../../assets/images/icon-bolt.svg';
import { nombreSeguro, escaparHTML } from '../../utils/filtroPalabras.js';
import './style.css';

// Icono como imagen (los emojis no se veían igual en todos los dispositivos)
const ico = (src, size) =>
    `<img src="${src}" alt="" width="${size}" height="${size}" style="vertical-align:middle">`;

const badgeRanking = `<div class="badge-tag">${ico(iconTrophy, 20)} Ranking Semanal</div>`;
const xpTag = (xp) => `${ico(iconBolt, 16)} ${xp} XP`;

export default async function mostrarLeaderboard() {
    const app = document.getElementById("app");
    if (!app) {
        console.error("❌ No se encontró #app");
        return;
    }

    const decoraciones = `
        <img src="${cloud}" class="cloud cloud-1" alt="Nube decorativa">
        <img src="${cloud}" class="cloud cloud-2" alt="Nube decorativa">
        <div class="stars">
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
        </div>
    `;

    // Estado inicial de carga
    app.innerHTML = `
        ${decoraciones}
        <div class="leaderboard-page">
            <header class="leaderboard-header">
                ${badgeRanking}
                <h1>Tabla de Clasificación</h1>
                <p>Compite con otros estudiantes y sube en el podio esta semana.</p>
            </header>
            <div class="leaderboard-loading">
                <div class="spinner"></div>
                <p>Cargando posiciones...</p>
            </div>
        </div>
    `;

    try {
        // Consultar usuarios y progreso registrado en Firestore
        const usuariosSnap = await getDocs(collection(db, "usuarios"));
        const progresoSnap = await getDocs(collection(db, "progreso"));

        const progresoMap = {};
        progresoSnap.forEach((docSnap) => {
            progresoMap[docSnap.id] = docSnap.data();
        });

        let usersList = [];
        usuariosSnap.forEach((docSnap) => {
            const u = docSnap.data();
            const prog = progresoMap[docSnap.id] || {};
            // Soporta weeklyXP o xp general registrado
            const weeklyXP = prog.weeklyXP !== undefined ? prog.weeklyXP : (prog.xp || 0);

            const nombreBruto = u.nombre || (u.email ? u.email.split('@')[0] : 'Programador');

            usersList.push({
                uid: docSnap.id,
                // Si el nombre trae palabras no permitidas se muestra "Programador"
                nombre: nombreSeguro(nombreBruto),
                email: u.email || '',
                weeklyXP: Number(weeklyXP) || 0,
                totalXP: Number(prog.xp) || 0
            });
        });

        // Si hay menos de 10 usuarios en la base de datos (por ser entorno de desarrollo),
        // complementamos con competidores ilustrativos para garantizar que siempre se visualice el Top 10 completo
        if (usersList.length < 10) {
            const demoUsers = [
                { uid: 'demo_1', nombre: 'Valentina Code', weeklyXP: 380, isDemo: true },
                { uid: 'demo_2', nombre: 'Carlos Py', weeklyXP: 320, isDemo: true },
                { uid: 'demo_3', nombre: 'Mateo Algoritmos', weeklyXP: 290, isDemo: true },
                { uid: 'demo_4', nombre: 'Sofía Dev', weeklyXP: 250, isDemo: true },
                { uid: 'demo_5', nombre: 'Sebastián Logic', weeklyXP: 210, isDemo: true },
                { uid: 'demo_6', nombre: 'Camila JS', weeklyXP: 180, isDemo: true },
                { uid: 'demo_7', nombre: 'Daniel Loops', weeklyXP: 140, isDemo: true },
                { uid: 'demo_8', nombre: 'Mariana Git', weeklyXP: 110, isDemo: true },
                { uid: 'demo_9', nombre: 'Alejandro Data', weeklyXP: 90, isDemo: true }
            ];

            const existingUids = new Set(usersList.map(u => u.uid));
            for (const demo of demoUsers) {
                if (!existingUids.has(demo.uid) && usersList.length < 10) {
                    usersList.push(demo);
                }
            }
        }

        // Ordenar descendentemente por XP de la semana
        usersList.sort((a, b) => b.weeklyXP - a.weeklyXP);

        const currentUser = auth.currentUser;
        const currentUid = currentUser ? currentUser.uid : null;

        // Identificar posición del usuario actual
        const currentUserIndex = currentUid ? usersList.findIndex(u => u.uid === currentUid) : -1;
        const currentUserRank = currentUserIndex !== -1 ? currentUserIndex + 1 : null;
        const currentUserData = currentUserIndex !== -1 ? usersList[currentUserIndex] : null;

        // Limitar a los 10 mejores usuarios para la semana
        const top10 = usersList.slice(0, 10);

        if (top10.length === 0) {
            app.innerHTML = `
                ${decoraciones}
                <div class="leaderboard-page">
                    <header class="leaderboard-header">
                        ${badgeRanking}
                        <h1>Tabla de Clasificación</h1>
                        <p>Los 10 usuarios con más experiencia acumulada esta semana.</p>
                    </header>
                    <div class="leaderboard-loading">
                        <p>Aún no hay usuarios con XP acumulado. ¡Completa lecciones para aparecer aquí!</p>
                    </div>
                </div>
            `;
            return;
        }

        // Helper para iniciales de avatar
        const getInitials = (name) => {
            if (!name) return "U";
            const parts = name.trim().split(" ");
            if (parts.length >= 2) {
                return (parts[0][0] + parts[1][0]).toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
        };

        // Una tarjeta del podio (el nombre y las iniciales se escapan porque vienen de usuarios)
        const podiumCard = (user, clase, insignia) => {
            const isCurrent = currentUid && user.uid === currentUid;
            const nombre = escaparHTML(user.nombre);
            return `
                <div class="podium-card ${clase} ${isCurrent ? 'is-current-user' : ''}">
                    <div class="podium-badge">${insignia}</div>
                    <div class="podium-avatar">${escaparHTML(getInitials(user.nombre))}</div>
                    <div class="podium-name" title="${nombre}">
                        ${nombre} ${isCurrent ? '<span class="you-badge">Tú</span>' : ''}
                    </div>
                    <div class="podium-xp">${xpTag(user.weeklyXP)}</div>
                </div>
            `;
        };

        // Renderizar el podio (Top 3): 2º a la izquierda, 1º al centro (elevado), 3º a la derecha
        const renderPodium = () => {
            const [first, second, third] = top10;

            let html = '<div class="podium-container">';
            if (second) html += podiumCard(second, 'second', ico(iconMedalSilver, 34));
            if (first) html += podiumCard(first, 'first', ico(iconCrown, 38));
            if (third) html += podiumCard(third, 'third', ico(iconMedalBronze, 34));
            html += '</div>';
            return html;
        };

        // Renderizar lista de posiciones 4 a 10
        const renderRemainingRanks = () => {
            const remaining = top10.slice(3);
            if (remaining.length === 0) return '';

            let html = '<div class="ranking-list">';
            remaining.forEach((user, index) => {
                const rankNumber = index + 4;
                const isCurrent = currentUid && user.uid === currentUid;

                html += `
                    <div class="ranking-item ${isCurrent ? 'is-current-user' : ''}">
                        <div class="ranking-left">
                            <span class="ranking-pos">#${rankNumber}</span>
                            <div class="ranking-avatar">${escaparHTML(getInitials(user.nombre))}</div>
                            <div class="ranking-info">
                                <span class="ranking-name">
                                    ${escaparHTML(user.nombre)}
                                    ${isCurrent ? '<span class="you-badge">Tú</span>' : ''}
                                </span>
                            </div>
                        </div>
                        <div class="ranking-xp">
                            ${xpTag(user.weeklyXP)}
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            return html;
        };

        // Si el usuario actual está registrado pero quedó fuera del Top 10
        const renderCurrentUserSticky = () => {
            if (!currentUid || !currentUserData || currentUserRank <= 10) {
                return '';
            }

            const xpToTop10 = top10[9] ? Math.max(0, top10[9].weeklyXP - currentUserData.weeklyXP + 1) : 0;

            return `
                <div class="current-user-banner">
                    <div class="user-rank-status">
                        <div class="rank-circle">#${currentUserRank}</div>
                        <div class="user-meta">
                            <h4>Tu posición semanal: #${currentUserRank}</h4>
                            <p>${currentUserData.weeklyXP} XP acumulados esta semana ${xpToTop10 > 0 ? `• ¡Te faltan ${xpToTop10} XP para entrar al Top 10!` : ''}</p>
                        </div>
                    </div>
                    <div class="ranking-xp">
                        ${xpTag(currentUserData.weeklyXP)}
                    </div>
                </div>
            `;
        };

        // Renderizar página completa
        app.innerHTML = `
            ${decoraciones}
            <div class="leaderboard-page">
                <header class="leaderboard-header">
                    ${badgeRanking}
                    <h1>Tabla de Clasificación</h1>
                    <p>Los 10 usuarios con más experiencia acumulada esta semana.</p>
                </header>

                ${renderPodium()}
                ${renderRemainingRanks()}
                ${renderCurrentUserSticky()}
            </div>
        `;

    } catch (error) {
        console.error("❌ Error cargando leaderboard:", error);
        app.innerHTML = `
            ${decoraciones}
            <div class="leaderboard-page">
                <header class="leaderboard-header">
                    ${badgeRanking}
                    <h1>Tabla de Clasificación</h1>
                </header>
                <div class="leaderboard-loading">
                    <p>No se pudo cargar la tabla de clasificación en este momento.</p>
                    <button class="primary-btn" onclick="window.location.reload()" style="background:#2778FF;color:#fff;border:none;padding:10px 20px;border-radius:12px;font-family:inherit;font-weight:600;cursor:pointer;margin-top:10px;">
                        Reintentar
                    </button>
                </div>
            </div>
        `;
    }
}