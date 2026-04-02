'use strict';

// ─── GOLEIRO ──────────────────────────────────────────────────────────────────
const keeper = {
  phase: 0,
  speed: 0.0034,   // velocidade de oscilação em rad/ms

  // retorna posição horizontal normalizada 0..1
  posX() { return (Math.sin(this.phase) + 1) / 2; },

  // retorna o retângulo de colisão do goleiro
  rect(posX) {
    const g  = getGoal();
    const kw = g.w * 0.24, kh = g.h * 0.72;
    return {
      x: g.x + (g.w - kw) * posX,
      y: g.y + g.h * 0.30,
      w: kw, h: kh
    };
  },

  update(dt) { this.phase += dt * this.speed; },

  draw(overridePosX) {
    const px = overridePosX !== undefined ? overridePosX : this.posX();
    const r  = this.rect(px);

    // corpo
    ctx.fillStyle = '#c0392b';
    rrect(r.x, r.y, r.w, r.h, r.w * 0.18);
    ctx.fill();

    // listra da camisa
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    rrect(r.x + r.w * 0.2, r.y + r.h * 0.1, r.w * 0.6, r.h * 0.45, r.w * 0.1);
    ctx.fill();

    // número
    ctx.fillStyle    = 'rgba(255,255,255,0.9)';
    ctx.font         = `bold ${Math.round(r.w * 0.5)}px sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('1', r.x + r.w / 2, r.y + r.h * 0.35);
  }
};
