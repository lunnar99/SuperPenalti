'use strict';

// ─── ESTATÍSTICAS PERSISTIDAS ────────────────────────────────────────────────
const STATS_KEY = 'superpenalti_stats';

let statsWins   = 0;
let statsLosses = 0;

function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      const d     = JSON.parse(raw);
      statsWins   = (d.wins   | 0) || 0;
      statsLosses = (d.losses | 0) || 0;
    }
  } catch (_) {}
}

function saveStats() {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify({ wins: statsWins, losses: statsLosses }));
  } catch (_) {}
}

function addWin() {
  statsWins++;
  saveStats();
}

function addLoss() {
  statsLosses++;
  saveStats();
}

// ─── DESENHA PLACAR NO CANVAS ────────────────────────────────────────────────
function drawStats() {
  const fs = Math.max(11, Math.round(W() * 0.032));
  ctx.save();
  ctx.font          = `700 ${fs}px sans-serif`;
  ctx.textBaseline  = 'top';
  ctx.textAlign     = 'left';
  ctx.shadowColor   = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur    = 8;
  ctx.globalAlpha   = 0.72;

  const x = W() * 0.03;
  const y = H() * 0.018;

  const winsStr   = String(statsWins);
  const sepStr    = ' - ';
  const lossesStr = String(statsLosses);

  let cursor = x;

  ctx.fillStyle = '#2ecc71';
  ctx.fillText(winsStr, cursor, y);
  cursor += ctx.measureText(winsStr).width;

  ctx.fillStyle = 'rgba(255,255,255,0.80)';
  ctx.fillText(sepStr, cursor, y);
  cursor += ctx.measureText(sepStr).width;

  ctx.fillStyle = '#e74c3c';
  ctx.fillText(lossesStr, cursor, y);

  ctx.restore();
}

// ─── CONTROLE DE INATIVIDADE ─────────────────────────────────────────────────
let gameInProgress   = false;
let lastActivityTime = Date.now();

// Chamado ao primeiro toque que inicia uma série
function markGameStarted() {
  gameInProgress   = true;
  lastActivityTime = Date.now();
}

// Chamado quando a série termina (vitória / derrota / reset)
function markGameEnded() {
  gameInProgress = false;
}

// Atualiza o timer de atividade a cada toque na tela
function onActivity() {
  lastActivityTime = Date.now();
}

// Verifica inatividade a cada 10 s; restarting se > 60 s sem atividade
setInterval(() => {
  if (gameInProgress && Date.now() - lastActivityTime > 60_000) {
    markGameEnded();
    resetGame();
  }
}, 10_000);

// ─── CARREGA AO INICIAR ───────────────────────────────────────────────────────
loadStats();
