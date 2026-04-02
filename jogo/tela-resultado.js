'use strict';

// ─── TELA DE RESULTADO DE CADA COBRANÇA ───────────────────────────────────────
// Exibe "GOL!", "FORA!", "TRAVE!", "DEFENDIDO!" brevemente após cada chute.
const resultScreen = {
  elapsed: 0,
  dur:     2200,   // duração total em ms

  reset()    { this.elapsed = 0; },

  update(dt) {
    this.elapsed += dt;
    if (this.elapsed >= this.dur && state === ST.RESULT) {
      const r = getSeriesResult();
      if (r) {
        state = ST.GAMEOVER;
        showEndScreen(r);
      } else {
        resetRound();
      }
    }
  },

  draw() {
    const MAP = {
      goal:  { text: 'GOL!',       color: '#f1c40f' },
      save:  { text: 'DEFENDIDO!', color: '#e74c3c' },
      miss:  { text: kick.weak ? 'FRACO...' : 'FORA!', color: kick.weak ? '#7f8c8d' : '#e67e22' },
      trave: { text: 'TRAVE!',     color: '#95a5a6' }
    };
    const cfg  = MAP[kick.result] || { text: '', color: '#fff' };
    const fIn  = 280, fOut = 450;
    const t    = this.elapsed;
    let alpha  = 1;
    if (t < fIn)                   alpha = t / fIn;
    else if (t > this.dur - fOut)  alpha = Math.max(0, (this.dur - t) / fOut);

    ctx.save();
    ctx.globalAlpha   = Math.max(0, alpha);
    ctx.fillStyle     = cfg.color;
    ctx.textAlign     = 'center';
    ctx.textBaseline  = 'middle';
    const fs = Math.round(W() * 0.155);
    ctx.font          = `900 ${fs}px sans-serif`;
    ctx.shadowColor   = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur    = 22;
    ctx.shadowOffsetY = 4;
    ctx.fillText(cfg.text, W() / 2, H() * 0.50);
    ctx.restore();
  }
};
