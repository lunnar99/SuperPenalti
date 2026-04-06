'use strict';

// ─── LOOP PRINCIPAL ───────────────────────────────────────────────────────────
let last = 0, gt = 0;

function loop(ts) {
  const dt = Math.min(ts - last, 50);
  last = ts; gt += dt;

  ctx.clearRect(0, 0, W(), H());

  drawField();
  drawGoal();

  if (state === ST.GAMEOVER) {
    keeper.update(dt);
    keeper.draw();
    drawConfetti(dt);

  } else if (state === ST.DIR) {
    keeper.update(dt);
    keeper.draw();
    const bp = getBall();
    drawPulse(bp.x, bp.y, bp.r, gt);
    drawBall(bp.x, bp.y, bp.r);
    dirSel.update(dt);
    dirSel.draw();
    drawHint('Toque para escolher a direção');
    drawHUD(dt);

  } else if (state === ST.POWER) {
    keeper.update(dt);
    keeper.draw();
    const bp = getBall();
    drawPulse(bp.x, bp.y, bp.r, gt);
    drawBall(bp.x, bp.y, bp.r);
    dirSel.draw();
    powSel.update(dt);
    powSel.draw();
    drawHint('Toque para definir a força');
    drawHUD(dt);

  } else if (state === ST.KICK) {
    keeper.draw(kick.kpx);
    kick.update(dt);
    drawBall(kick.bx, kick.by, getBall().r, kick.spin);
    if (kick.elapsed >= kick.dur && kick.result) {
      state = ST.RESULT;
      resultScreen.reset();
    }
    drawHUD(dt);

  } else if (state === ST.RESULT) {
    keeper.draw(kick.kpx);
    drawBall(kick.bx, kick.by, getBall().r);
    resultScreen.update(dt);
    resultScreen.draw();
    drawHUD(dt);
  }

  drawStats();

  requestAnimationFrame(loop);
}

// ─── ENTRADA DO JOGADOR ───────────────────────────────────────────────────────
canvas.addEventListener('pointerdown', e => {
  e.preventDefault();
  onActivity();
  if (state === ST.GAMEOVER) return;
  if      (state === ST.DIR)   { dirSel.confirm(); powSel.reset(); state = ST.POWER; markGameStarted(); }
  else if (state === ST.POWER) { powSel.confirm(); kick.start();   state = ST.KICK;  }
}, { passive: false });

// ─── INICIA O JOGO ────────────────────────────────────────────────────────────
requestAnimationFrame(loop);
