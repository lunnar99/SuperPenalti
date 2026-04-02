'use strict';

// ─── DIMENSÕES DO GOL ─────────────────────────────────────────────────────────
function getGoal() {
  const w = W(), h = H();
  const gw   = w * 0.72, gh = h * 0.21;
  const post = Math.max(6, w * 0.026);
  return { x: (w - gw) / 2, y: h * 0.18, w: gw, h: gh, post };
}

// ─── POSIÇÃO E RAIO DA BOLA ───────────────────────────────────────────────────
function getBall() {
  return { x: W() * 0.5, y: H() * 0.79, r: W() * 0.064 };
}

// ─── RETÂNGULO ARREDONDADO ────────────────────────────────────────────────────
function rrect(x, y, w, h, r) {
  r = Math.min(r, Math.min(w, h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
}

// ─── INTERPOLAÇÃO SUAVE ───────────────────────────────────────────────────────
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
