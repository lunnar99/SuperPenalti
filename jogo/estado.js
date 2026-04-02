'use strict';

// ─── ESTADO ATUAL DO JOGO ─────────────────────────────────────────────────────
// LOGIN temporariamente desativado → começa direto na direção
let state = ST.DIR;

// ─── DADOS DO JOGADOR ─────────────────────────────────────────────────────────
let playerName  = '';

// ─── PLACAR DA SÉRIE ──────────────────────────────────────────────────────────
let goals       = 0;    // gols marcados
let shots       = 0;    // cobranças já realizadas
let shotResults = [];   // 'goal' | 'miss' por cobrança

// ─── RESULTADO DA SÉRIE ───────────────────────────────────────────────────────
function getSeriesResult() {
  if (goals >= GOALS_TO_WIN)           return 'win';
  if ((shots - goals) >= GOALS_TO_WIN) return 'loss';  // errou demais, impossível ganhar
  if (shots >= MAX_SHOTS)              return goals >= GOALS_TO_WIN ? 'win' : 'loss';
  return null; // série ainda em andamento
}
