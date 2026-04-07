'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// DEBUG DE HITBOX – visualização das áreas de colisão
// ═══════════════════════════════════════════════════════════════════════════════
//
// ► Como ativar/desativar:
//     • Pressione a tecla  H  durante o jogo (toggle)
//     • Ou mude DEBUG_HITBOX para true/false aqui embaixo
//
// ► Como ajustar as hitboxes:
//     Os valores reais de colisão estão em:
//       goleiro.js  → keeper.rect()   (kw, kh, posição vertical)
//       geometria.js → getGoal()      (post = espessura das traves)
//       chute.js    → this.evaluate() (br = raio de colisão da bola)
//     Altere esses valores e veja o efeito aqui em tempo real.
//
// ═══════════════════════════════════════════════════════════════════════════════

// ─── TOGGLE PRINCIPAL ────────────────────────────────────────────────────────
//
//   true  → hitboxes visíveis
//   false → hitboxes ocultas (modo normal de jogo)
//
let DEBUG_HITBOX = false;

// ─── ATALHO DE TECLADO: tecla H ──────────────────────────────────────────────
window.addEventListener('keydown', e => {
  if (e.key === 'h' || e.key === 'H') {
    DEBUG_HITBOX = !DEBUG_HITBOX;
    console.log('[HITBOX DEBUG]', DEBUG_HITBOX ? 'ATIVADO' : 'DESATIVADO');
  }
});

// ─── CORES DE CADA ELEMENTO (fácil de trocar) ────────────────────────────────
const HB_COLOR = {
  bola_visual:  'rgba(255, 255,   0, 0.9)',   // amarelo   – tamanho visual da bola
  bola_colisao: 'rgba(255, 100,   0, 0.9)',   // laranja   – raio efetivo de colisão (60%)
  goleiro:      'rgba(  0, 200, 255, 0.9)',   // ciano     – retângulo do goleiro
  poste_esq:    'rgba(255,  50,  50, 0.9)',   // vermelho  – poste esquerdo
  poste_dir:    'rgba(255,  50,  50, 0.9)',   // vermelho  – poste direito
  travessao:    'rgba(255, 150,  50, 0.9)',   // laranja   – travessão
  gol_abertura: 'rgba( 50, 255,  50, 0.5)',   // verde     – área interna do gol (onde conta gol)
};

// ─── ESPESSURA DO CONTORNO ───────────────────────────────────────────────────
const HB_LINE = 2;   // px – aumente se quiser contornos mais grossos

// ─── FUNÇÃO PRINCIPAL ─────────────────────────────────────────────────────────
// Chame drawHitboxes() uma vez por frame, DEPOIS de desenhar tudo,
// para que as linhas apareçam por cima das imagens.
function drawHitboxes() {
  if (!DEBUG_HITBOX) return;

  ctx.save();
  ctx.lineWidth = HB_LINE;

  _drawGoalHitboxes();
  _drawKeeperHitbox();
  _drawBallHitbox();
  _drawLegend();

  ctx.restore();
}

// ─── HITBOXES DA TRAVE ───────────────────────────────────────────────────────
//
// A trave tem 3 retângulos de colisão (ver chute.js → evaluate):
//   Poste esquerdo:  (g.x,              g.y, g.post, g.h)
//   Poste direito:   (g.x + g.w - g.post, g.y, g.post, g.h)
//   Travessão:       (g.x,              g.y, g.w,    g.post)
//
// Também mostramos a ABERTURA DO GOL (onde um chute conta como gol):
//   x: g.x + g.post  →  g.x + g.w - g.post
//   y: g.y + g.post  →  g.y + g.h
//
function _drawGoalHitboxes() {
  const g = getGoal();  // { x, y, w, h, post }

  // — Abertura (área de gol) —
  ctx.strokeStyle = HB_COLOR.gol_abertura;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(
    g.x + g.post,
    g.y + g.post,
    g.w - g.post * 2,
    g.h - g.post
  );
  ctx.setLineDash([]);

  // — Poste esquerdo —
  ctx.strokeStyle = HB_COLOR.poste_esq;
  ctx.strokeRect(g.x, g.y, g.post, g.h);
  _label('P.ESQ', g.x + g.post / 2, g.y - 6, HB_COLOR.poste_esq);

  // — Poste direito —
  ctx.strokeStyle = HB_COLOR.poste_dir;
  ctx.strokeRect(g.x + g.w - g.post, g.y, g.post, g.h);
  _label('P.DIR', g.x + g.w - g.post / 2, g.y - 6, HB_COLOR.poste_dir);

  // — Travessão —
  ctx.strokeStyle = HB_COLOR.travessao;
  ctx.strokeRect(g.x, g.y, g.w, g.post);
  _label('TRAVESSÃO', g.x + g.w / 2, g.y + g.post + 12, HB_COLOR.travessao);
}

// ─── HITBOX DO GOLEIRO ────────────────────────────────────────────────────────
//
// O retângulo de colisão é calculado em goleiro.js → keeper.rect():
//   largura:  g.w * 0.14   → altere kw para tornar o goleiro mais/menos largo
//   altura:   g.h * 1.02   → altere kh para tornar o goleiro mais/menos alto
//   y:        g.y + g.h * 0.30  → ajusta onde começa verticalmente
//
function _drawKeeperHitbox() {
  // Usa a posição ATUAL do goleiro (ou a congelada durante o chute)
  const posX = (state === ST.KICK || state === ST.RESULT)
    ? kick.kpx
    : keeper.posX();

  const r = keeper.rect(posX);

  ctx.strokeStyle = HB_COLOR.goleiro;
  ctx.strokeRect(r.x, r.y, r.w, r.h);
  _label('GOLEIRO', r.x + r.w / 2, r.y - 6, HB_COLOR.goleiro);
}

// ─── HITBOX DA BOLA ───────────────────────────────────────────────────────────
//
// A bola tem dois círculos:
//   visual   → raio = getBall().r               (como aparece na tela)
//   colisão  → raio = getBall().r * 0.60        (raio efetivo usado no hit test)
//              O 0.60 está em chute.js → const br = getBall().r * 0.60
//
// Durante o chute a posição é (kick.bx, kick.by).
// Antes do chute a bola está parada em getBall().
//
function _drawBallHitbox() {
  const bp = getBall();  // { x, y, r }

  let bx, by;
  if (state === ST.KICK || state === ST.RESULT) {
    bx = kick.bx;
    by = kick.by;
  } else {
    bx = bp.x;
    by = bp.y;
  }

  // — Tamanho visual —
  ctx.strokeStyle = HB_COLOR.bola_visual;
  ctx.beginPath();
  ctx.arc(bx, by, bp.r, 0, Math.PI * 2);
  ctx.stroke();
  _label('BOLA (visual)', bx, by - bp.r - 8, HB_COLOR.bola_visual);

  // — Raio de colisão efetivo (60% do visual) —
  const br = bp.r * 0.60;  // ← mesmo valor do chute.js
  ctx.strokeStyle = HB_COLOR.bola_colisao;
  ctx.beginPath();
  ctx.arc(bx, by, br, 0, Math.PI * 2);
  ctx.stroke();
  _label('BOLA (colisão)', bx, by + br + 14, HB_COLOR.bola_colisao);
}

// ─── LEGENDA NO CANTO ─────────────────────────────────────────────────────────
function _drawLegend() {
  const items = [
    { cor: HB_COLOR.bola_visual,  texto: 'Bola – tamanho visual' },
    { cor: HB_COLOR.bola_colisao, texto: 'Bola – colisão (60%)' },
    { cor: HB_COLOR.goleiro,      texto: 'Goleiro' },
    { cor: HB_COLOR.poste_esq,    texto: 'Postes' },
    { cor: HB_COLOR.travessao,    texto: 'Travessão' },
    { cor: HB_COLOR.gol_abertura, texto: 'Abertura do gol' },
  ];

  const px = W() * 0.015;
  const py = H() * 0.58;
  const rowH = H() * 0.032;
  const boxS = rowH * 0.55;
  const fs   = Math.round(rowH * 0.55);

  // fundo semi-transparente
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(px - 4, py - rowH * 0.6, W() * 0.28, rowH * (items.length + 0.6));

  ctx.font = `bold ${fs}px monospace`;
  ctx.textBaseline = 'middle';

  items.forEach((item, i) => {
    const y = py + i * rowH;
    ctx.fillStyle = item.cor;
    ctx.fillRect(px, y - boxS / 2, boxS, boxS);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(item.texto, px + boxS + 6, y);
  });

  // instrução de toggle
  ctx.font = `${Math.round(fs * 0.85)}px monospace`;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText('[ H ] para ocultar hitboxes', px, py + items.length * rowH + rowH * 0.1);
}

// ─── UTILITÁRIO: label de texto ───────────────────────────────────────────────
function _label(texto, x, y, cor) {
  const fs = Math.max(9, Math.round(W() * 0.013));
  ctx.font         = `bold ${fs}px monospace`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = 'rgba(0,0,0,0.6)';
  ctx.fillText(texto, x + 1, y + 1);   // sombra
  ctx.fillStyle = cor;
  ctx.fillText(texto, x, y);
}
