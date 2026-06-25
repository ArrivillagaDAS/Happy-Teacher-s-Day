var currentPage = 1;

/* navegación entre páginas */
function goTo(n) {
  document.querySelectorAll('.page').forEach(function (p) {
    p.classList.remove('active');
  });

  if (n > 6) {
    document.getElementById('pfinal').classList.add('active');
    launchConfetti();
    document.getElementById('prog').style.width = '100%';
    document.getElementById('nivel-txt').textContent = '¡COMPLETADO! 🎉';
    return;
  }

  var pg = document.getElementById('p' + n);
  pg.classList.add('active');
  currentPage = n;
  document.getElementById('prog').style.width = Math.round((n - 1) / 6 * 100) + '%';
  document.getElementById('nivel-txt').textContent = 'NIVEL ' + (n - 1) + ' / 6';

  if (n === 4) initMaze();
  if (n === 5) initSimon();
}

function reveal(fraseId, btnId) {
  var frase = document.getElementById(fraseId);
  frase.style.display = 'block';
  setTimeout(function () {
    document.getElementById(btnId).style.display = 'block';
  }, 4000);
}

/* página 1*/
var bootLines = [
  '> Cargando módulo: GRATITUD.py ...... 100%',
  '> Importando: paciencia de nuestros maestros .. 100%',
  '> Instalando: dedicacion_2026 ....... 100%',
  '> Verificando: lecciones aprendidas .. 100%',
  '> Compilando carta especial ......... 100%',
  '',
  '> ¡Sistema listo! Carta lista para enviar.',
];
var bootIdx = 0;

function bootAnim() {
  if (bootIdx < bootLines.length) {
    document.getElementById('boot-output').innerHTML += bootLines[bootIdx] + '<br>';
    bootIdx++;
    setTimeout(bootAnim, bootIdx === bootLines.length ? 0 : 320);
  } else {
    document.getElementById('btn-start').style.display = 'block';
  }
}
setTimeout(bootAnim, 600);

/* página 2 */
var symbols   = ['{}','[]','()','->','&&','||','!=','++','--','/*','*/','##','::','??','%%'];
var starPos   = [2, 5, 8, 11, 13];
var starsFound = 0;

(function initStars() {
  var grid = document.getElementById('stars-grid');
  symbols.forEach(function (sym, i) {
    var btn = document.createElement('button');
    btn.className = 'estrella-btn';
    var isStar = starPos.indexOf(i) !== -1;

    if (isStar) {
      btn.textContent = '⭐';
    } else {
      btn.textContent = sym;
      btn.classList.add('sym');
    }

    btn.addEventListener('click', function () {
      if (isStar && !btn.classList.contains('found')) {
        btn.classList.add('found');
        starsFound++;
        document.getElementById('stars-count').textContent =
          'Encontradas: ' + starsFound + ' / 5';
        if (starsFound === 5) reveal('frase2', 'btn2');
      }
    });

    grid.appendChild(btn);
  });
})();

/* página 3*/
function checkRiddle(btn, correct) {
  if (correct) {
    btn.classList.add('correcto');
    document.querySelectorAll('.code-opt').forEach(function (b) { b.disabled = true; });
    reveal('frase3', 'btn3');
  } else {
    btn.classList.add('incorrecto');
    setTimeout(function () { btn.classList.remove('incorrecto'); }, 600);
  }
}

/* página 4 */
var COLS = 7, ROWS = 7, CELL = 40;
var player     = { x: 0, y: 0 };
var mazeSolved = false;

var walls = [
  { x:1, y:0, d:'S' }, { x:1, y:1, d:'E' }, { x:2, y:1, d:'S' }, { x:2, y:2, d:'W' },
  { x:3, y:0, d:'S' }, { x:3, y:2, d:'S' }, { x:3, y:3, d:'E' }, { x:4, y:1, d:'S' },
  { x:4, y:3, d:'N' }, { x:5, y:1, d:'S' }, { x:5, y:4, d:'E' }, { x:0, y:2, d:'S' },
  { x:1, y:3, d:'S' }, { x:0, y:4, d:'E' }, { x:2, y:4, d:'S' }, { x:4, y:4, d:'S' },
  { x:1, y:5, d:'E' }, { x:3, y:5, d:'E' }, { x:5, y:5, d:'S' }, { x:5, y:6, d:'W' },
];

function hasWall(x, y, d) {
  return walls.some(function (w) { return w.x === x && w.y === y && w.d === d; });
}

function initMaze() {
  mazeSolved = false;
  player = { x: 0, y: 0 };
  drawMaze();
}

function movePlayer(dx, dy) {
  if (mazeSolved) return;
  var nx = player.x + dx, ny = player.y + dy;
  if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return;

  var blocked = false;
  if (dx ===  1) blocked = hasWall(player.x, player.y, 'E') || hasWall(nx, ny, 'W');
  if (dx === -1) blocked = hasWall(player.x, player.y, 'W') || hasWall(nx, ny, 'E');
  if (dy ===  1) blocked = hasWall(player.x, player.y, 'S') || hasWall(nx, ny, 'N');
  if (dy === -1) blocked = hasWall(player.x, player.y, 'N') || hasWall(nx, ny, 'S');

  if (!blocked) { player.x = nx; player.y = ny; }
  drawMaze();

  if (player.x === COLS - 1 && player.y === ROWS - 1 && !mazeSolved) {
    mazeSolved = true;
    reveal('frase4', 'btn4');
  }
}

function drawMaze() {
  var canvas = document.getElementById('maze-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 280, 280);
  ctx.fillStyle = '#0d0d1a';
  ctx.fillRect(0, 0, 280, 280);

  // cuadricula
  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) {
      ctx.strokeStyle = '#f59e0b22';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x * CELL, y * CELL, CELL, CELL);
    }
  }

  // Paredes
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  walls.forEach(function (w) {
    var px = w.x * CELL, py = w.y * CELL;
    ctx.beginPath();
    if (w.d === 'N') { ctx.moveTo(px, py);        ctx.lineTo(px + CELL, py); }
    if (w.d === 'S') { ctx.moveTo(px, py + CELL); ctx.lineTo(px + CELL, py + CELL); }
    if (w.d === 'W') { ctx.moveTo(px, py);        ctx.lineTo(px, py + CELL); }
    if (w.d === 'E') { ctx.moveTo(px + CELL, py); ctx.lineTo(px + CELL, py + CELL); }
    ctx.stroke();
  });

  // Meta y jugador
  ctx.font = '22px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏁', (COLS - 1) * CELL + CELL / 2, (ROWS - 1) * CELL + CELL / 2);
  ctx.fillText('🟡', player.x * CELL + CELL / 2, player.y * CELL + CELL / 2);
}

// Teclado para el laberinto
document.addEventListener('keydown', function (e) {
  if (currentPage !== 4) return;
  var map = { ArrowLeft:[-1,0], ArrowRight:[1,0], ArrowUp:[0,-1], ArrowDown:[0,1] };
  if (map[e.key]) { e.preventDefault(); movePlayer(map[e.key][0], map[e.key][1]); }
});

/* página 5 */
var simonColors = [
  { color: '#ef4444', border: '#dc2626', emoji: '🔴' },
  { color: '#3b82f6', border: '#2563eb', emoji: '🔵' },
  { color: '#22c55e', border: '#16a34a', emoji: '🟢' },
  { color: '#f59e0b', border: '#d97706', emoji: '🟡' },
];
var simonSeq = [], simonInput = [], simonActive = false;

function initSimon() {
  simonSeq = []; simonInput = []; simonActive = false;
  var container = document.getElementById('simon-btns');
  container.innerHTML = '';

  simonColors.forEach(function (c, i) {
    var btn = document.createElement('button');
    btn.className = 'seq-btn';
    btn.id = 'sb' + i;
    btn.style.borderColor = c.border;
    btn.style.color = c.color;
    btn.textContent = c.emoji;
    btn.addEventListener('click', function () { simonPress(i); });
    container.appendChild(btn);
  });

  setTimeout(simonNext, 800);
}

function simonNext() {
  simonSeq.push(Math.floor(Math.random() * 4));
  simonInput = [];
  simonActive = false;
  document.getElementById('simon-msg').textContent =
    '▶ Observa la secuencia... (ronda ' + simonSeq.length + ')';
  playSeq(0);
}

function playSeq(idx) {
  if (idx >= simonSeq.length) {
    simonActive = true;
    document.getElementById('simon-msg').textContent = '¡Ahora tú! Repite la secuencia';
    return;
  }
  var btn = document.getElementById('sb' + simonSeq[idx]);
  setTimeout(function () {
    btn.classList.add('lit');
    setTimeout(function () {
      btn.classList.remove('lit');
      setTimeout(function () { playSeq(idx + 1); }, 250);
    }, 450);
  }, 400);
}

function simonPress(i) {
  if (!simonActive) return;
  var btn = document.getElementById('sb' + i);
  btn.classList.add('lit');
  setTimeout(function () { btn.classList.remove('lit'); }, 200);

  simonInput.push(i);
  var pos = simonInput.length - 1;

  if (simonInput[pos] !== simonSeq[pos]) {
    document.getElementById('simon-msg').textContent = '❌ ¡Fallaste! Intenta de nuevo';
    simonActive = false;
    setTimeout(function () { simonSeq = []; simonNext(); }, 900);
    return;
  }

  if (simonInput.length === simonSeq.length) {
    simonActive = false;
    if (simonSeq.length >= 3) {
      document.getElementById('simon-msg').textContent = '✅ ¡Secuencia correcta! ¡Eres un genio!';
      reveal('frase5', 'btn5');
    } else {
      document.getElementById('simon-msg').textContent = '✅ ¡Bien! Siguiente ronda...';
      setTimeout(simonNext, 700);
    }
  }
}

/* página 6 */
function checkTyping() {
  var val = document.getElementById('type-input').value.toUpperCase().replace(/\s/g, '');
  if (val === 'GRACIAS') {
    var input = document.getElementById('type-input');
    input.style.color = '#2aff87';
    input.style.borderBottomColor = '#2aff87';
    reveal('frase6', 'btn6');
  }
}

/* página final */
function launchConfetti() {
  var colors = ['#2aff87','#7c3aed','#f59e0b','#f472b6','#60a5fa','#ef4444'];
  var container = document.getElementById('confetti-container');

  for (var i = 0; i < 70; i++) {
    var el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left             = Math.random() * 100 + '%';
    el.style.background       = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDuration = (1.5 + Math.random() * 2.5) + 's';
    el.style.animationDelay   = Math.random() * 1.8 + 's';
    el.style.transform        = 'rotate(' + Math.random() * 360 + 'deg)';
    container.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 5000);
  }
}
