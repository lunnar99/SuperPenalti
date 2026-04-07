'use strict';

// ─── FIREBASE ────────────────────────────────────────────────────────────────
const _fbApp = firebase.initializeApp({
  apiKey:            'AIzaSyC_hmWN6vrq2tAIyCEd3ZIjfv_qaxC8Q2s',
  authDomain:        'pixelbj.firebaseapp.com',
  projectId:         'pixelbj',
  storageBucket:     'pixelbj.firebasestorage.app',
  messagingSenderId: '935752469440',
  appId:             '1:935752469440:web:60f38db470ff0df5075625',
  measurementId:     'G-79H26N1073'
});
const _db = firebase.firestore();

function _salvarResultado(resultado) {
  const campo = resultado === 'win' ? 'wins' : 'losses';
  _db.doc('placar/global').set(
    { [campo]: firebase.firestore.FieldValue.increment(1) },
    { merge: true }
  ).catch(() => {});
}

// ─── ESTATÍSTICAS PERSISTIDAS ────────────────────────────────────────────────
const STATS_KEY = 'superpenalti_stats';

let statsWins   = 0;
let statsLosses = 0;

// Busca do Firestore; usa localStorage como cache enquanto carrega
function loadStats() {
  // Exibe cache local imediatamente (evita piscar 0-0)
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      const d   = JSON.parse(raw);
      statsWins   = (d.wins   | 0) || 0;
      statsLosses = (d.losses | 0) || 0;
    }
  } catch (_) {}

  // Busca o valor real do Firestore
  _db.doc('placar/global').get().then(snap => {
    if (snap.exists) {
      const d   = snap.data();
      statsWins   = (d.wins   | 0) || 0;
      statsLosses = (d.losses | 0) || 0;
      // Atualiza cache local com o valor do servidor
      try {
        localStorage.setItem(STATS_KEY, JSON.stringify({ wins: statsWins, losses: statsLosses }));
      } catch (_) {}
    }
  }).catch(() => {}); // fica com o cache se offline
}

function addWin() {
  statsWins++;
  _salvarResultado('win');
}

function addLoss() {
  statsLosses++;
  _salvarResultado('loss');
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

  drawQR();
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

// ─── QR CODE ─────────────────────────────────────────────────────────────────
const _qrImg = new Image();
_qrImg.src = 'estilos/qr code superpenalti.png';

function drawQR() {
  if (!_qrImg.complete || !_qrImg.naturalWidth) return;
  const size = Math.round(W() * 0.13);   // 13% da largura — pequeno e sutil
  const x    = W() / 10 - size / 2;      // centralizado horizontalmente
  const y    = H() - size - H() * 0.02; // 2% de margem inferior
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.drawImage(_qrImg, x, y, size, size);
  ctx.restore();
}

// ─── CARREGA AO INICIAR ───────────────────────────────────────────────────────
loadStats();
