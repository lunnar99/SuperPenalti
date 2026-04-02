'use strict';

// ─── CONFETE (canvas sobreposto com z-index máximo) ───────────────────────────
let confettiParticles = [];

const CONFETTI_COLORS = [
  '#f1c40f', '#e74c3c', '#2ecc71', '#3498db',
  '#9b59b6', '#e67e22', '#1abc9c', '#fff'
];

const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx    = confettiCanvas.getContext('2d');

function resizeConfettiCanvas() {
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfettiCanvas();
window.addEventListener('resize', resizeConfettiCanvas);

// ─── INICIALIZA PARTÍCULAS ────────────────────────────────────────────────────
function spawnConfetti() {
  confettiParticles = [];
  for (let i = 0; i < 140; i++) {
    confettiParticles.push({
      x:     Math.random() * confettiCanvas.width,
      y:    -Math.random() * confettiCanvas.height * 0.4,
      vx:    (Math.random() - 0.5) * confettiCanvas.width  * 0.012,
      vy:    confettiCanvas.height * (0.003 + Math.random() * 0.007),
      rot:   Math.random() * Math.PI * 2,
      rotV:  (Math.random() - 0.5) * 0.18,
      w:     confettiCanvas.width * (0.012 + Math.random() * 0.016),
      h:     confettiCanvas.width * (0.005 + Math.random() * 0.007),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      alive: true
    });
  }
}

// ─── ATUALIZA E DESENHA ───────────────────────────────────────────────────────
function drawConfetti(dt) {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  for (const p of confettiParticles) {
    if (!p.alive) continue;
    p.x   += p.vx;
    p.y   += p.vy;
    p.rot += p.rotV;
    p.vy  *= 1.003;   // leve aceleração gravitacional
    if (p.y > confettiCanvas.height + 20) p.alive = false;

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);
    confettiCtx.fillStyle   = p.color;
    confettiCtx.globalAlpha = 0.92;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  }
  confettiCtx.globalAlpha = 1;
}
