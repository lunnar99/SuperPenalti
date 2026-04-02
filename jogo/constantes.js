'use strict';

// ─── CANVAS & CONTEXTO ────────────────────────────────────────────────────────
const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');

// ─── RESPONSIVIDADE ───────────────────────────────────────────────────────────
function resize() {
  const ratio = 9 / 16;
  let w = window.innerWidth, h = window.innerHeight;
  if (w / h > ratio) { w = h * ratio; } else { h = w / ratio; }
  canvas.width  = Math.floor(w);
  canvas.height = Math.floor(h);
}
resize();
window.addEventListener('resize', resize);

const W = () => canvas.width;
const H = () => canvas.height;

// ─── ESTADOS DO JOGO ──────────────────────────────────────────────────────────
const ST = {
  LOGIN:    -1,
  DIR:       0,   // escolhendo direção
  POWER:     1,   // escolhendo força
  KICK:      2,   // bola em movimento
  RESULT:    3,   // mostrando resultado (gol/fora/trave)
  GAMEOVER:  4    // série encerrada
};

// ─── REGRAS DA SÉRIE ──────────────────────────────────────────────────────────
const MAX_SHOTS    = 5;
const GOALS_TO_WIN = 3;
