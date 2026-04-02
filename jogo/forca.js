'use strict';

// ─── SELETOR DE FORÇA ─────────────────────────────────────────────────────────
// Barra que oscila entre 0 (fraco) e 1 (máximo) enquanto o jogador não confirma.
const powSel = {
  phase:  0,
  locked: false,
  value:  0,   // 0..1

  reset()    { this.phase = 0; this.locked = false; this.value = 0; },
  get()      { return this.locked ? this.value : (Math.sin(this.phase) + 1) / 2; },
  update(dt) { if (!this.locked) this.phase += dt * 0.0030; },
  confirm()  { this.locked = true; this.value = (Math.sin(this.phase) + 1) / 2; },

  draw() {
    const bp = getBall();
    const p  = this.get();
    const bW = bp.r * 4.0, bH = H() * 0.024;
    const bx = bp.x - bW / 2;
    const by = bp.y + bp.r + H() * 0.030;

    // rótulo
    ctx.fillStyle    = 'rgba(255,255,255,0.92)';
    ctx.font         = `bold ${Math.round(H() * 0.027)}px sans-serif`;
    ctx.textAlign    = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText('FORÇA', bp.x, by - 6);

    // sombra da trilha
    ctx.fillStyle = 'rgba(0,0,0,0.50)';
    rrect(bx - 3, by - 3, bW + 6, bH + 6, bH / 2 + 3);
    ctx.fill();

    // preenchimento colorido
    if (p > 0.01) {
      const hue = 118 - p * 118;   // verde (118) → vermelho (0)
      ctx.fillStyle = `hsl(${hue}, 88%, 52%)`;
      rrect(bx, by, bW * p, bH, bH / 2);
      ctx.fill();
    }

    // borda
    ctx.strokeStyle = 'rgba(255,255,255,0.80)'; ctx.lineWidth = 1.5;
    rrect(bx, by, bW, bH, bH / 2);
    ctx.stroke();
  }
};
