'use strict';

// ─── HUD: BOLINHAS DE PROGRESSO ───────────────────────────────────────────────
// Cada slot: { state: 'empty' | 'goal' | 'miss', anim: 0..1, animSpeed }
const hudBalls = Array.from({ length: MAX_SHOTS }, () => ({
  state:     'empty',
  anim:      0,
  animSpeed: 0
}));

// Dispara a animação de preenchimento de um slot
function hudBallFill(index, result) {
  const slot     = hudBalls[index];
  slot.state     = result;       // 'goal' | 'miss'
  slot.anim      = 0;
  slot.animSpeed = 1 / 420;      // atinge 1 em ~420 ms
}

// Reseta todos os slots para vazio
function resetHudBalls() {
  for (const s of hudBalls) { s.state = 'empty'; s.anim = 0; s.animSpeed = 0; }
}

// ─── DESENHO DO HUD ───────────────────────────────────────────────────────────
function drawHUD(dt) {
  const r      = W() * 0.042;
  const gap    = r * 0.70;
  const totalW = MAX_SHOTS * r * 2 + (MAX_SHOTS - 1) * gap;
  const cx     = W() / 2;
  const cy     = H() * 0.08;

  // pílula de fundo
  const padX = r * 0.8, padY = r * 0.55;
  ctx.fillStyle = 'rgba(0,0,0,0.48)';
  rrect(cx - totalW / 2 - padX, cy - r - padY, totalW + padX * 2, r * 2 + padY * 2, r + padY);
  ctx.fill();

  for (let i = 0; i < MAX_SHOTS; i++) {
    const slot = hudBalls[i];
    const bx   = cx - totalW / 2 + r + i * (r * 2 + gap);
    const by   = cy;

    // avança a animação frame a frame
    if (slot.anim < 1 && slot.state !== 'empty') {
      slot.anim = Math.min(1, slot.anim + dt * slot.animSpeed);
    }

    const t    = slot.anim;
    const te   = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOut
    const popT = Math.sin(t * Math.PI);  // pico no meio da animação
    const scale = slot.state === 'empty' ? 1 : 1 + popT * 0.35;

    ctx.save();
    ctx.translate(bx, by);
    ctx.scale(scale, scale);

    if (slot.state === 'empty') {
      // círculo vazado
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth   = Math.max(2, r * 0.12);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.fill();

    } else {
      const isGoal = slot.state === 'goal';
      const color  = isGoal ? '#2ecc71' : '#e74c3c';
      const glow   = isGoal ? 'rgba(46,204,113,0.55)' : 'rgba(231,76,60,0.55)';

      // anel de brilho que expande e desaparece
      if (t < 0.85) {
        ctx.beginPath(); ctx.arc(0, 0, r * (1.3 + popT * 0.5), 0, Math.PI * 2);
        ctx.strokeStyle = glow;
        ctx.lineWidth   = r * 0.18 * (1 - te);
        ctx.stroke();
      }

      // gradiente radial preenchido
      const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.05, 0, 0, r);
      grad.addColorStop(0, isGoal ? '#a8f0c6' : '#f5a49c');
      grad.addColorStop(1, color);
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // brilho interno
      ctx.beginPath(); ctx.arc(-r * 0.22, -r * 0.26, r * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.30)';
      ctx.fill();

      // ícone ✓ ou ✕ com fade-in
      ctx.fillStyle    = 'rgba(255,255,255,0.92)';
      ctx.font         = `bold ${Math.round(r * 1.05)}px sans-serif`;
      ctx.textAlign    = 'center'; ctx.textBaseline = 'middle';
      ctx.globalAlpha  = te;
      ctx.fillText(isGoal ? '✓' : '✕', 0, r * 0.06);
      ctx.globalAlpha  = 1;
    }

    ctx.restore();
  }
}
