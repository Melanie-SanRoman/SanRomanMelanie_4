"use strict"

// DECLARACION DE VARIABLES

// Variables que controlas estados
let juegoActivo = false;

// Variable que controlan puntos, vidas, tiempo 
let points = 0;
let livesAct = 5;
let pPoints = document.getElementById('pts');

// Variable que controlan la creacion de elementos
let loopInterval;
let temporizadores = {}; // Guarda los timeouts para poder cancelarlos si hace falta

// Variables que controlan las colisiones
let intervaloCheck;

// Variables que controlan las acciones del teclado (milisegundos permitidos entre dos pulsaciones)
let ultimaTecla = null;
let tiempoUltimaTecla = 0;
let escuchandoTeclas = false;

// Variables que controlan el timer inicial y el temporizador
let contTimer = 3;
let timer;
let timerInterval;
let timeReste = 0;

// Variables que controlan el manual de juego
let currentStep = 0;

// DECLARACION DE CONSTANTES

// Constantes que controlan los elementos
const cat = new Cat();
// const level = new Level();

// Constantes que controlan las acciones de teclado
const intervaloMaximo = 300;

// Constantes que controlan los puntos, las vidas y el timer inicial
const contTimerMax = 3;
const pointsBird = 100;
const pointsMin = 0;
const divTotalLives = document.getElementById('lives');
const livesMax = 5;
const livesMap = {
    1: 'url("assets/items/lives/oneLive.png")',
    2: 'url("assets/items/lives/twoLives.png")',
    3: 'url("assets/items/lives/threeLives.png")',
    4: 'url("assets/items/lives/fourLives.png")',
    5: 'url("assets/items/lives/fiveLives.png")'
}

// Constantes que controlan el manual de juego
const instructionData = [
    `<h2>🐱 Controles del Personaje</h2>
   <p>Presioná <strong>ESPACIO</strong> para saltar.</p>
   <p>Presioná dos veces rápido para hacer <strong>doble salto</strong>.</p>`,

    `<h2>🐦 Puntos y Objetivos</h2>
   <p>+100 puntos por cada pajarito atrapado.</p>
   <p>+1 vida si agarrás un regalo volador 🎁.</p>
   <p>-1 vida si chocás con un tronco 🌲.</p>`,

    `<h2>❤️ Vidas</h2>
   <p>Empezás con <strong>5 vidas</strong>.</p>
   <p>Si perdés todas, el juego termina.</p>
   <p>Recuperá vidas con los regalos voladores.</p>`,

    `<h2>⏱️ Tiempo Límite</h2>
   <p>Tenés <strong>2 minutos</strong> para sumar puntos.</p>
   <p>El juego termina cuando el tiempo se agota.</p>`,

    `<h2>🧠 Consejos</h2>
   <ul>
     <li>Usá el doble salto para esquivar y atrapar.</li>
     <li>Mantené la calma: ¡más precisión, más puntos!</li>
     <li>No dejes pasar los regalos. 💝</li>
   </ul>`
];
const content = document.getElementById('instruction_content');
const nextBtn = document.getElementById('next_btn');
const prevBtn = document.getElementById('prev_btn');
const startGameBtn = document.getElementById('btn_startGame');

// Constantes que controlan la aparicion u ocultamientos de distintas pantallas como el startGame o el gameOver
const divStart = document.getElementById("div_start");
const instructions = document.getElementById('instructions');
const infoModal = document.getElementById('info_modal');
const contentInfoModal = document.getElementById('content_info_modal');
const divTimeOut = document.getElementById('div_time_out');
const timeOutModal = document.getElementById('time_out_modal');
const contentTimeOutModal = document.getElementById('content_time_out_modal');
const divGameOver = document.getElementById('div_game_over');
const gameOverModal = document.getElementById('game_over_modal');
const contentGameOverModal = document.getElementById('content_game_over_modal');


// Constantes que controlan el timer inicial
const timerText = document.getElementById('timer_text');
const timerDiv = document.getElementById('div_timer');

// ESCUCHA DE EVENTOS
// document.getElementById("btn_run").addEventListener('click', () => { if (!juegoActivo) return; cat.run() });
document.getElementById("btn_start").addEventListener('click', openManual);
startGameBtn.addEventListener('click', closeManual);
document.getElementById("btn_reset").addEventListener('click', resetGame);
document.getElementById("btn_pause").addEventListener('click', stopGame);
document.getElementById("btn_play").addEventListener('click', playGame);
document.getElementById("btn_restart").addEventListener('click', restartGame);
document.getElementById("btn_again").addEventListener('click', again);
document.getElementById("btn_info").addEventListener('click', () => {
    stopGame();
    infoModal.style.display = "flex";
    contentInfoModal.classList.add('fadeIn');
});
document.getElementById("btn_info_ok").addEventListener('click', () => {
    contentInfoModal.classList.remove('fadeIn');
    contentInfoModal.classList.add('fadeOut');

    setTimeout(() => {
        infoModal.style.display = "none";
        contentInfoModal.classList.remove('fadeOut');
    }, 400)

    setTimeout(restartGame, 2000);
});

// DECLARACION DE FUNCIONES

// Funcion que muestra las reglas y objetivos del juego
function openManual() {
    divStart.classList.add('ocultar');

    divStart.addEventListener("animationend", function handler() {
        divStart.style.display = "none";
        divStart.removeEventListener("animationend", handler);
    });

    // Muestra la primer pagina del manual
    showStep(currentStep);
}

// Funcion que muestra las paginas del manual
function showStep(index) {
    content.style.opacity = 0;

    setTimeout(() => {
        content.innerHTML = instructionData[index];
        content.style.opacity = 1;

        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === instructionData.length - 1;

        if (index === instructionData.length - 1) {

            startGameBtn.style.display = 'flex';
            setTimeout(() => {
                startGameBtn.style.opacity = 1;
            }, 400);
        }
    }, 300);
}

// Escucha el evento y ejecuta la funcion de pasar a la siguiente pagina
nextBtn.addEventListener('click', () => {
    if (currentStep < instructionData.length - 1) {
        currentStep++;
        showStep(currentStep);
    }
});

// Escucha el evento y ejecuta la funcion de volver a la pagina anterior
prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
});

// Funcion que oculta las reglas y objetivos del juego y habilita el timer inicial
function closeManual() {
    instructions.classList.add('ocultar');

    instructions.addEventListener("animationend", function handler() {
        instructions.style.display = "none";
        instructions.removeEventListener("animationend", handler);
    });

    setTimeout(playTimer, 1000);
}

// Funcion que ejecuta el timer inicial, al finalizar ejecuta startGame()
function playTimer() {

    timerDiv.style.display = 'flex';
    timerText.innerHTML = contTimer;

    timerText.style.animation = 'none';
    void timerText.offsetWidth;
    timerText.style.animation = 'scaleUp 1s ease';

    timer = setInterval(() => {
        contTimer--;

        if (contTimer >= 0) {
            timerText.innerHTML = contTimer;
            timerText.style.animation = 'none';
            void timerText.offsetWidth;
            timerText.style.animation = 'scaleUp 1s ease';
        }

        if (contTimer < 0) {
            clearInterval(timer);
            timerText.innerHTML = 'Start';
            timerText.style.animation = 'none';
            void timerText.offsetWidth;
            timerText.style.animation = 'scaleUp 1s ease';

            setTimeout(() => {
                timerDiv.style.display = 'none';
                document.body.classList.remove('paused');
                startGame();
            }, 2000);
        }
    }, 1000);
}

// Funcion que da comienzo al juego
function startGame() {

    juegoActivo = true;

    // Reinicia el gameLoop
    if (loopInterval) clearInterval(loopInterval);
    loopInterval = setInterval(gameLoop, 50);

    // El personaje camina
    cat.walk();

    // Estable el tiempo de juego
    const tiempoInicio = 2 * 60;
    const display = document.getElementById('time');
    iniciarTemporizador(tiempoInicio, display);

    // Agrega la animación scroll a cada layer
    document.querySelectorAll('.layer').forEach(layer => {
        layer.classList.add('scroll');
    });

    // Inicia los loops de aparición
    iniciarLoop('obstaculo', generarObstaculo, 4000, 2000);
    iniciarLoop('objetivo', () => generarObjetivo('bird'), 3000, 2000);
    iniciarLoop('bonus', () => generarObjetivo('bonus'), 15000, 2000);

    // Escucha teclas
    if (!escuchandoTeclas) {
        escucharTeclas();
    }
}

// Funcion que verifica constantemente el estado del juego
function gameLoop() {
    if (!juegoActivo) return;

    // Verifica si el personaje ha colisionado con un objeto
    verificarColision();
}

// Función genérica para loops de aparición
function iniciarLoop(nombre, generador, baseTime, variacion) {
    if (!juegoActivo) return;


    const delay = baseTime + Math.random() * variacion;
    temporizadores[nombre] = setTimeout(() => {
        generador();
        iniciarLoop(nombre, generador, baseTime, variacion);
    }, delay);
}

// Funciones que cada 4-6 segundos genera un obstaculo (wood)
function generarObstaculo() {
    let obstaculo = new Obstaculo();
}

// Funciones que cada 3-5 segundos genera un objetivo (bird) 
function generarObjetivo(tipo) {
    let bird = new Objetivo(tipo);
}

// Funciones que cada 15-17 segundo genera un bonus (gitf);
function generarBonus(tipo) {
    let bonus = new Objetivo(tipo);
}

// Funcion que inicia el temporizador del juego
function iniciarTemporizador(duracion, display) {
    timeReste = duracion;

    timerInterval = setInterval(() => {
        const minutos = Math.floor(timeReste / 60);
        const segundos = timeReste % 60;

        // Formatear con dos dígitos
        display.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

        // Si el tiempo se ha acabado
        if (--timeReste < 0) {
            clearInterval(timerInterval);
            display.textContent = "00:00";
            timeOut();
        }
    }, 1000);
}

// Funcion que escucha los eventos del teclado para salto y doble salto
function escucharTeclas() {
    escuchandoTeclas = true;

    document.addEventListener("keydown", (e) => {
        if (!juegoActivo) return;
        const ahora = Date.now();

        if (e.code === "Space") {
            if (ultimaTecla === "Space" && (ahora - tiempoUltimaTecla) < intervaloMaximo) {
                cat.doubleJump(); // <- Salto doble
            } else {
                cat.jump(); // <- Salto común
            }
            ultimaTecla = "Space";
            tiempoUltimaTecla = ahora;
        }
    });
}

// Funcion que verifica las colisiones con los distintos elementos
function verificarColision() {
    intervaloCheck = setInterval(() => {

        // Constantes que controlan las colisiones
        const rectCat = document.getElementById('rect').getBoundingClientRect();
        const obstaculos = document.querySelectorAll('.obstaculo');
        const birds = document.querySelectorAll('.birdFly');
        const bonus = document.querySelectorAll('.bonus');

        // Verifica colision con bird's
        birds.forEach(bird => {
            const rectBird = bird.getBoundingClientRect();

            const hasColisionBird = !(
                rectCat.top > rectBird.bottom ||
                rectCat.bottom < rectBird.top ||
                rectCat.right < rectBird.left ||
                rectCat.left > rectBird.right
            );

            if (hasColisionBird) {
                sumPoints(bird);

                bird.classList.remove("birdFly");
                bird.classList.add("birdDead");

                setTimeout(() => {
                    bird.remove();
                }, 1000);
            }
        });

        // Verifica colision con bonus
        bonus.forEach(b => {
            const rectBonus = b.getBoundingClientRect();

            if (b.classList.contains('impact')) { return };

            const hasColisionBonus = !(
                rectCat.top > rectBonus.bottom ||
                rectCat.bottom < rectBonus.top ||
                rectCat.right < rectBonus.left ||
                rectCat.left > rectBonus.right
            );

            if (hasColisionBonus) {
                b.classList.add('impact');

                b.classList.add('bonusAdd');
                updateLives("add", b);

                b.addEventListener("animationend", () => {
                    b.remove();
                });
            }
        });

        // Verifica colision con wood's
        obstaculos.forEach(obs => {
            const rectObs = obs.getBoundingClientRect();

            if (obs.classList.contains('impact')) { return };

            const hasColisionWood = !(
                rectCat.top > rectObs.bottom ||
                rectCat.bottom < rectObs.top ||
                rectCat.right < rectObs.left ||
                rectCat.left > rectObs.right
            );

            if (hasColisionWood) {
                obs.classList.add('impact');
                obs.style.animation = 'fallObs 1s forwards linear';
                setTimeout(() => {
                    updateLives("remove", obs);
                }, 500);
            }
        });
    }, 50);
}

// Funcion que suma o resta vidas
function updateLives(action, e) {

    // Resta vidas
    if (action == 'remove') {
        livesAct--;

        // Creacion del "-1" del corazon roto flotante
        const floating = document.createElement('div');
        floating.innerText = '-1💔';
        floating.classList.add('floating');

        // Posición basada en el bonus
        const rect = e.getBoundingClientRect();
        floating.style.left = rect.left + 50 + 'px';
        floating.style.top = rect.top + 'px';

        // Inserta y elimina el elemento flotante
        document.body.appendChild(floating);
        setTimeout(() => {
            floating.remove();
        }, 2000);

        if (livesAct == 0) {
            gameOver();
        }
    }

    // Suma vidas
    if (action == 'add') {
        if (livesAct < 5) {
            livesAct++;

            // Creacion del "+1" del corazon flotante
            const floating = document.createElement('div');
            floating.innerText = '+1❤️';
            floating.classList.add('floating');

            // Posición basada en el bonus
            const rect = e.getBoundingClientRect();
            floating.style.left = rect.left + 50 + 'px';
            floating.style.top = rect.top + 'px';

            // Inserta y elimina elemento flotante
            document.body.appendChild(floating);
            setTimeout(() => {
                floating.remove();
            }, 2000);
        }
    }

    // Reinicia la animación
    divTotalLives.classList.remove('lives_animation');
    void divTotalLives.offsetWidth;
    divTotalLives.classList.add('lives_animation');

    divTotalLives.style.background = livesMap[livesAct];
    divTotalLives.classList.add()
}

// Funcion que suma puntos
function sumPoints(bird) {
    points += pointsBird;

    pPoints.innerHTML = points + ' points';

    // Reinicia la animación
    pts.classList.remove('pts_animation');
    void pts.offsetWidth;
    pts.classList.add('pts_animation');

    // Creacion del "+100" puntos flotantes
    const floating = document.createElement('div');
    floating.innerText = '+100';
    floating.classList.add('floating');

    // Posición basada en el pájaro
    const rect = bird.getBoundingClientRect();
    floating.style.left = rect.left + 'px';
    floating.style.top = rect.top + 'px';

    // Inserta y elimina animacion
    document.body.appendChild(floating);
    setTimeout(() => {
        floating.remove();
    }, 2000);

    // Sube de nivel (no habilitado)
    // if (points == 100) {
    //     levelUp();
    // }
}

// Funcion para subir de nivel NO IMPLEMENTADO
function levelUp() {
    cat.run();
    level.changeLevelSmooth(2);
}

// Funcion que controla cuando se pierde el juego
function gameOver() {
    stopGame();
    divGameOver.classList.remove('ocultar');
    divGameOver.classList.add('mostrar');
    document.getElementById('pts_conseguidos_game_over').innerHTML = points + ' points';
    setTimeout(() => {
        divGameOver.style.display = 'flex';
    }, 1000);

    setTimeout(() => {
        gameOverModal.style.display = "flex";
        contentGameOverModal.classList.add('fadeIn');
    }, 2000)
}

// Funcion que controla cuando se agota el tiempo
function timeOut() {
    stopGame();
    divTimeOut.classList.remove('ocultar');
    divTimeOut.classList.add('mostrar');
    document.getElementById('pts_conseguidos_time_out').innerHTML = points + ' points';
    setTimeout(() => {
        divTimeOut.style.display = 'flex'
    }, 1000);

    setTimeout(() => {
        timeOutModal.style.display = "flex";
        contentTimeOutModal.classList.add('fadeIn');
    }, 2000)
}

// Funcion que controla cuando se quiere volver a jugar despues de que se haya acabado el juego
function again() {
    contentTimeOutModal.classList.remove('fadeIn');
    contentTimeOutModal.classList.add('fadeOut');

    setTimeout(() => {
        timeOutModal.style.display = "none";
        contentTimeOutModal.classList.remove('fadeOut');
    }, 400)

    divTimeOut.classList.remove('mostrar');
    divTimeOut.classList.add('ocultar');
    divTimeOut.addEventListener('animationend', () => {
        divTimeOut.style.display = 'none';
        reiniciarValores();
        playTimer();
    }, { once: true });
}

// Funcion que reanuda el juego a traves del boton de play del menu principal
function playGame() {
    if (juegoActivo) return;

    juegoActivo = true;
    loopInterval = setInterval(gameLoop, 50);

    iniciarLoop('obstaculo', generarObstaculo, 4000, 2000);
    iniciarLoop('objetivo', () => generarObjetivo('bird'), 3000, 2000);
    iniciarLoop('bonus', () => generarObjetivo('bonus'), 10000, 2000);

    // Reanudar personaje
    cat.walk();

    // Reanudar temporizador
    const display = document.getElementById('time');
    iniciarTemporizador(timeReste, display);

    // Reanudar animaciones CSS
    document.body.classList.remove('paused');
}

// Funcion que detiene el juego ya sea por game over, por time out o por el boton de pause del menu principal
function stopGame() {
    juegoActivo = false;

    // Detener el loop principal
    if (loopInterval) {
        clearInterval(loopInterval);
        loopInterval = null;
    }

    // Detener la verificaciond de colisiones
    if (intervaloCheck) {
        clearInterval(intervaloCheck);
        intervaloCheck = null;
    }

    // Detener los temporizadores de aparición
    for (let key in temporizadores) {
        clearTimeout(temporizadores[key]);
    }

    // Detener el temporizador del contador
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // Pausar animaciones CSS
    document.body.classList.add('paused');

    // Detener al personaje
    cat.idle();
}

// Funcion que reinicia el juego desde el boton de restart del menu principal
function restartGame() {
    stopGame();

    // Eliminar elementos actuales del juego
    document.querySelectorAll('.obstaculo, .birdFly, .bonus').forEach(el => el.remove());

    iniciarLoop('obstaculo', generarObstaculo, 4000, 2000);
    iniciarLoop('objetivo', () => generarObjetivo('bird'), 3000, 2000);
    iniciarLoop('bonus', () => generarObjetivo('bonus'), 10000, 2000);

    // Reinicia los valores de vida y puntos
    reiniciarValores();

    // Volver a arrancar desde el timer
    playTimer();
}

// Funcion que reinicia el juego a partir de un game over
function resetGame() {
    contentGameOverModal.classList.remove('fadeIn');
    contentGameOverModal.classList.add('fadeOut');

    setTimeout(() => {
        gameOverModal.style.display = "none";
        contentGameOverModal.classList.remove('fadeOut');
    }, 400)

    divGameOver.classList.remove('mostrar');
    divGameOver.classList.add('ocultar');
    divGameOver.addEventListener('animationend', () => {
        divGameOver.style.display = 'none';
        restartGame();
    }, { once: true });
}

// Funcion que reinicia los valores de: puntos, vidas y timer inicial
function reiniciarValores() {
    pPoints.innerHTML = pointsMin + ' points';
    divTotalLives.style.background = livesMap[livesMax];
    contTimer = contTimerMax;
}
