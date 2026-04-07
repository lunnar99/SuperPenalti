'use strict';

// ─── GOLEIRO ──────────────────────────────────────────────────────────────────
const keeper = {
  phase: 0,
  speed: 0.0024,   // velocidade de oscilação em rad/ms

  // retorna posição horizontal normalizada 0..1
  posX() { return (Math.sin(this.phase) + 1) / 2; },

  // retorna o retângulo de colisão do goleiro
  rect(posX) {
    const g  = getGoal();
    const kw = g.w * 0.24, kh = g.h * 0.75;
    return {
      x: g.x + (g.w - kw) * posX,
      y: g.y + g.h * 0.34,
      w: kw, h: kh
    };
  },

  update(dt) { this.phase += dt * this.speed; },

  draw(overridePosX) {
    const px = overridePosX !== undefined ? overridePosX : this.posX();
    const r  = this.rect(px);

    if (!imgsOk()) {
      // fallback de forma enquanto imagens carregam
      ctx.fillStyle = '#c0392b';
      rrect(r.x, r.y, r.w, r.h, r.w * 0.18);
      ctx.fill();
      return;
    }

    // goleiro.png é um sprite; escalamos pela altura do rect preservando proporção.
    ctx.save();
    const aspect = imgGoleiro.naturalWidth / imgGoleiro.naturalHeight;
    const dh = r.h;
    const dw = dh * aspect;
    ctx.drawImage(imgGoleiro, r.x + (r.w - dw) / 2, r.y, dw, dh);
    ctx.restore();
  }
};
