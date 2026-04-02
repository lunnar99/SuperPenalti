'use strict';

// ─── CAMPO ────────────────────────────────────────────────────────────────────
function drawField() {
  const w = W(), h = H();
  const horizon = h * 0.39;

  // Céu
  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, '#0d47a1');
  sky.addColorStop(1, '#1976d2');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizon);

  // Nuvens sutis
  function cloud(cx, cy, r) {
    ctx.fillStyle = 'rgba(255,255,255,0.13)';
    ctx.beginPath(); ctx.arc(cx,          cy, r,       0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + r * .8, cy, r * .72, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx - r * .7, cy, r * .60, 0, Math.PI * 2); ctx.fill();
  }
  cloud(w * 0.18, h * 0.11, w * 0.058);
  cloud(w * 0.75, h * 0.09, w * 0.048);

  // Gramado
  const grass = ctx.createLinearGradient(0, horizon, 0, h);
  grass.addColorStop(0, '#388e3c');
  grass.addColorStop(1, '#1b5e20');
  ctx.fillStyle = grass;
  ctx.fillRect(0, horizon, w, h - horizon);

  // Listras do gramado
  const stripes = 6;
  for (let i = 0; i < stripes; i++) {
    if (i % 2 === 0) continue;
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(0, horizon + i * (h - horizon) / stripes, w, (h - horizon) / stripes);
  }

  // Área do penalty
  const g   = getGoal();
  const pbW = g.w * 1.30, pbH = h * 0.25;
  const pbX = (w - pbW) / 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth   = Math.max(2, w * 0.006);
  ctx.strokeRect(pbX, horizon, pbW, pbH);

  // Pequena área
  const gaW = g.w * 1.04, gaH = h * 0.12;
  const gaX = (w - gaW) / 2;
  ctx.strokeRect(gaX, horizon, gaW, gaH);

  // Marca do penalty
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.79, w * 0.016, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.70)';
  ctx.fill();
}

// ─── TRAVE E REDE ─────────────────────────────────────────────────────────────
function drawGoal() {
  const g = getGoal();

  // Fundo da rede
  ctx.fillStyle = 'rgba(238,238,238,0.94)';
  ctx.fillRect(g.x + g.post, g.y + g.post, g.w - g.post * 2, g.h - g.post);

  // Grade da rede
  const x0 = g.x + g.post, x1 = g.x + g.w - g.post;
  const y0 = g.y + g.post, y1 = g.y + g.h;
  ctx.strokeStyle = 'rgba(160,160,160,0.45)'; ctx.lineWidth = 1;
  for (let i = 1; i < 10; i++) {
    const nx = x0 + (x1 - x0) * i / 10;
    ctx.beginPath(); ctx.moveTo(nx, y0); ctx.lineTo(nx, y1); ctx.stroke();
  }
  for (let i = 1; i <= 5; i++) {
    const ny = y0 + (y1 - y0) * i / 5;
    ctx.beginPath(); ctx.moveTo(x0, ny); ctx.lineTo(x1, ny); ctx.stroke();
  }

  // Postes com sombra 3D
  ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 7; ctx.shadowOffsetX = 3;
  ctx.fillStyle = '#eceff1';
  ctx.fillRect(g.x,                g.y, g.post, g.h);  // poste esquerdo
  ctx.fillRect(g.x + g.w - g.post, g.y, g.post, g.h);  // poste direito
  ctx.fillRect(g.x,                g.y, g.w,    g.post); // travessão
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0;

  // Brilho dos postes
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(g.x + 1,                g.y + 1, g.post * 0.4, g.h - 2);
  ctx.fillRect(g.x + g.w - g.post + 1, g.y + 1, g.post * 0.4, g.h - 2);
}

// ─── BOLA ─────────────────────────────────────────────────────────────────────
function drawBall(x, y, r, spin) {
  ctx.save();
  ctx.translate(x, y);
  if (spin) ctx.rotate(spin);

  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 6;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = '#fff'; ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  ctx.strokeStyle = '#ccc'; ctx.lineWidth = Math.max(1, r * 0.06);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();

  // pentágono central
  const pr = r * 0.285;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    i === 0 ? ctx.moveTo(Math.cos(a) * pr, Math.sin(a) * pr)
            : ctx.lineTo(Math.cos(a) * pr, Math.sin(a) * pr);
  }
  ctx.closePath(); ctx.fillStyle = '#1a1a1a'; ctx.fill();

  // manchas hexagonais ao redor
  ctx.fillStyle = '#1a1a1a';
  for (let i = 0; i < 5; i++) {
    const a  = (i / 5) * Math.PI * 2 - Math.PI * 0.5 + Math.PI / 5;
    const hx = Math.cos(a) * r * 0.60, hy = Math.sin(a) * r * 0.60;
    const hr = r * 0.195;
    ctx.beginPath();
    for (let j = 0; j < 6; j++) {
      const ja = (j / 6) * Math.PI * 2;
      j === 0 ? ctx.moveTo(hx + Math.cos(ja) * hr, hy + Math.sin(ja) * hr)
              : ctx.lineTo(hx + Math.cos(ja) * hr, hy + Math.sin(ja) * hr);
    }
    ctx.closePath(); ctx.fill();
  }

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
