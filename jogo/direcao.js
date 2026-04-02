'use strict';

// ─── SELETOR DE DIREÇÃO ───────────────────────────────────────────────────────
// A seta oscila da esquerda para a direita enquanto o jogador não confirma.
const dirSel = {
  phase:  0,
  locked: false,
  value:  0,     // -1 (esquerda) .. +1 (direita)

  reset()    { this.phase = 0; this.locked = false; this.value = 0; },
  get()      { return this.locked ? this.value : Math.sin(this.phase); },
  update(dt) { if (!this.locked) this.phase += dt * 0.0021; },
  confirm()  { this.locked = true; this.value = Math.sin(this.phase); },

  draw() {
    const bp    = getBall();
    const val   = this.get();
    const spread = Math.PI * 0.40;
    const a     = val * spread - Math.PI / 2;
    const len   = bp.r * 2.5;
    const ex    = bp.x + Math.cos(a) * len;
    const ey    = bp.y + Math.sin(a) * len;
    const lw    = Math.max(3, W() * 0.013);
    const headL = Math.max(10, W() * 0.04);
    const color = this.locked ? '#2ecc71' : '#e74c3c';
    const hw    = Math.PI / 5;

    // sombra
    ctx.lineWidth    = lw + 2; ctx.lineCap = 'round';
    ctx.strokeStyle  = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.moveTo(bp.x + 2, bp.y + 2); ctx.lineTo(ex + 2, ey + 2); ctx.stroke();

    // haste
    ctx.lineWidth   = lw;
    ctx.strokeStyle = color;
    ctx.beginPath(); ctx.moveTo(bp.x, bp.y); ctx.lineTo(ex, ey); ctx.stroke();

    // ponta da seta
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - headL * Math.cos(a - hw), ey - headL * Math.sin(a - hw));
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - headL * Math.cos(a + hw), ey - headL * Math.sin(a + hw));
    ctx.stroke();
  }
};
