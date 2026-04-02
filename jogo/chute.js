'use strict';

// ─── ANIMAÇÃO E FÍSICA DO CHUTE ───────────────────────────────────────────────
const kick = {
  elapsed: 0, dur: 850,
  sx: 0, sy: 0,   // posição inicial (ball spot)
  tx: 0, ty: 0,   // destino no gol
  arc: 0,         // altura do arco
  kpx: 0,         // posição do goleiro congelada no momento do chute
  bx: 0, by: 0,   // posição atual da bola durante a animação
  spin: 0,        // rotação acumulada
  weak: false,    // chute fraco (não chega ao gol)
  result: null,   // 'goal' | 'save' | 'miss' | 'trave'

  start() {
    const bp = getBall();
    const g  = getGoal();
    this.elapsed = 0; this.result = null; this.spin = 0;
    this.sx = bp.x; this.sy = bp.y;
    this.bx = bp.x; this.by = bp.y;

    const dv = dirSel.value;   // -1..+1
    const pv = powSel.value;   // 0..1

    // Horizontal: projeta a direção da seta no plano do travessão
    const spread        = Math.PI * 0.40;
    const angleFromVert = dv * spread;
    const ballToGoalDist = bp.y - (g.y + g.post * 0.5);
    this.tx = bp.x + Math.tan(angleFromVert) * ballToGoalDist;

    // Vertical: pv=0 → chão, pv=0.78 → travessão, pv>0.78 → acima da trave
    const crossbarInnerY = g.y + g.post;
    const groundY        = g.y + g.h * 0.90;
    if (pv <= 0.78) {
      this.ty = groundY - (pv / 0.78) * (groundY - crossbarInnerY);
    } else {
      const t  = (pv - 0.78) / 0.22;
      this.ty  = crossbarInnerY - t * g.h * 0.70;
    }

    this.arc = H() * (0.04 + pv * 0.18);

    // Chute fraco: para antes de chegar ao gol
    if (pv < 0.18) {
      const weakRatio = pv / 0.18;
      const stopY     = getBall().y - (getBall().y - groundY) * weakRatio * 0.55;
      this.tx  = this.sx + (this.tx - this.sx) * weakRatio * 0.6;
      this.ty  = stopY;
      this.arc = H() * 0.01;
      this.dur = 1400 + (1 - weakRatio) * 800;
      this.weak = true;
    } else {
      this.dur  = 850;
      this.weak = false;
    }

    this.kpx = keeper.posX();   // congela posição do goleiro
  },

  update(dt) {
    this.elapsed += dt;
    const p = Math.min(this.elapsed / this.dur, 1);
    const e = easeInOut(p);
    this.bx   = this.sx + (this.tx - this.sx) * e;
    this.by   = this.sy + (this.ty - this.sy) * e - Math.sin(p * Math.PI) * this.arc;
    this.spin += dt * (this.weak ? 0.004 : 0.013);
    if (p >= 1 && !this.result) this.evaluate();
  },

  evaluate() {
    const g  = getGoal();
    const kr = keeper.rect(this.kpx);
    shots++;

    if (this.weak) {
      this.result = 'miss';
      shotResults.push('miss');
      hudBallFill(shots - 1, 'miss');
      return;
    }

    // Raio de colisão efetivo (60% do visual, compensa falta de perspectiva)
    const br = getBall().r * 0.60;
    const cx = this.tx, cy = this.ty;

    // Teste círculo vs AABB
    function hit(rx, ry, rw, rh) {
      const nx = Math.max(rx, Math.min(cx, rx + rw));
      const ny = Math.max(ry, Math.min(cy, ry + rh));
      return (cx - nx) * (cx - nx) + (cy - ny) * (cy - ny) < br * br;
    }

    // Rejeição rápida: bola deve estar perto do gol
    const nearFrame = cx + br > g.x && cx - br < g.x + g.w &&
                      cy + br > g.y && cy - br < g.y + g.h;
    if (!nearFrame) {
      this.result = 'miss'; shotResults.push('miss'); hudBallFill(shots - 1, 'miss'); return;
    }

    // Trave (verificada antes do gol: toque no poste vence o centro dentro)
    const hitLeftPost  = hit(g.x,                g.y, g.post, g.h);
    const hitRightPost = hit(g.x + g.w - g.post, g.y, g.post, g.h);
    const hitCrossbar  = hit(g.x,                g.y, g.w,    g.post);
    if (hitLeftPost || hitRightPost || hitCrossbar) {
      this.result = 'trave'; shotResults.push('miss'); hudBallFill(shots - 1, 'miss'); return;
    }

    // Centro da bola deve estar dentro da abertura
    const inGoal = cx > g.x + g.post && cx < g.x + g.w - g.post &&
                   cy > g.y + g.post && cy < g.y + g.h;
    if (!inGoal) {
      this.result = 'miss'; shotResults.push('miss'); hudBallFill(shots - 1, 'miss'); return;
    }

    // Defesa do goleiro
    const saved = hit(kr.x, kr.y, kr.w, kr.h);
    if (saved) {
      this.result = 'save'; shotResults.push('miss'); hudBallFill(shots - 1, 'miss');
    } else {
      this.result = 'goal'; goals++; shotResults.push('goal'); hudBallFill(shots - 1, 'goal');
    }
  }
};
