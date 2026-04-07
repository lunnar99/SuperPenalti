'use strict';

// ─── CAMPO ────────────────────────────────────────────────────────────────────
// Fundo: imagem do estádio esticada para cobrir o canvas inteiro.
function drawField() {
  if (!imgsOk()) {
    ctx.fillStyle = '#1b5e20';
    ctx.fillRect(0, 0, W(), H());
    return;
  }

  ctx.drawImage(estadioFrames[estadioFrameIndex], 0, 0, W(), H());
}

let estadioFrameIndex = 0;
let estadioTimer = 0;

// ─── TRAVE (imagem sobreposta ao goleiro) ─────────────────────────────────────
// Chamada APÓS keeper.draw() para que a trave fique na frente do goleiro.
function drawGoal() {
  if (!imgsOk()) return;
  ctx.drawImage(imgTrave, 0, 0, W(), H());
}

// ─── BOLA ─────────────────────────────────────────────────────────────────────
// bola.png é um sprite; desenhamos centralizado em (x, y) com diâmetro = r*2.
function drawBall(x, y, r, spin) {
  if (!imgsOk()) return;
  ctx.save();
  if (spin) {
    ctx.translate(x, y);
    ctx.rotate(spin);
    ctx.translate(-x, -y);
  }
  ctx.drawImage(imgBola, x - r, y - r, r * 2, r * 2);
  ctx.restore();
}

// ─── PULSO AO REDOR DA BOLA ───────────────────────────────────────────────────
function drawPulse(x, y, r, gt) {
  const expand = (Math.sin(gt * 0.0045) + 1) * r * 0.22;
  const alpha  =  0.25 + Math.sin(gt * 0.0045) * 0.15;
  ctx.beginPath(); ctx.arc(x, y, r + r * 0.12 + expand, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
  ctx.lineWidth   = Math.max(1.5, W() * 0.007);
  ctx.stroke();
}

// ─── DICA NA PARTE INFERIOR ───────────────────────────────────────────────────
function drawHint(text) {
  ctx.fillStyle    = 'rgba(255,255,255,0.80)';
  ctx.font         = `${Math.round(H() * 0.029)}px sans-serif`;
  ctx.textAlign    = 'center'; ctx.textBaseline = 'bottom';
  ctx.fillText(text, W() / 2, H() * 0.974);
}
