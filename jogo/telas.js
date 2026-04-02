'use strict';

// ─── TELA FINAL (vitória / derrota) ──────────────────────────────────────────
function showEndScreen(result) {
  const titleEl = document.getElementById('end-title');
  const scoreEl = document.getElementById('end-score');
  const dotsEl  = document.getElementById('end-dots');

  titleEl.className   = 'end-title ' + result;
  titleEl.textContent = result === 'win' ? 'VOCÊ GANHOU! 🏆' : 'VOCÊ PERDEU! 😢';
  if (result === 'win') spawnConfetti();

  scoreEl.textContent = `${goals} gol${goals !== 1 ? 's' : ''} em ${shots} cobrança${shots !== 1 ? 's' : ''}`;

  dotsEl.innerHTML = '';
  for (let i = 0; i < MAX_SHOTS; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (shotResults[i] ? ' ' + shotResults[i] : '');
    dotsEl.appendChild(d);
  }

  document.getElementById('overlay-end').style.display = 'flex';
}

// ─── REINICIA APENAS A RODADA (dentro da série) ───────────────────────────────
function resetRound() {
  state = ST.DIR;
  dirSel.reset();
  powSel.reset();
}

// ─── REINICIA PARTIDA COMPLETA ────────────────────────────────────────────────
function resetGame() {
  goals = 0; shots = 0; shotResults = [];
  confettiParticles = [];
  resetHudBalls();
  dirSel.reset(); powSel.reset();
  document.getElementById('overlay-end').style.display = 'none';
  // LOGIN desativado temporariamente:
  // document.getElementById('overlay-login').style.display = 'flex';
  // state = ST.LOGIN;
  state = ST.DIR;
}

// ─── EVENTO: BOTÃO JOGAR NOVAMENTE ────────────────────────────────────────────
document.getElementById('btn-restart').addEventListener('click', resetGame);

// ─── LOGIN INPUTS (TEMPORARIAMENTE DESATIVADO) ────────────────────────────────
/*
const inpName = document.getElementById('inp-name');
const inpCPF  = document.getElementById('inp-cpf');
const errName = document.getElementById('err-name');
const errCPF  = document.getElementById('err-cpf');

inpName.addEventListener('input', () => {
  inpName.value = inpName.value.replace(/[0-9]/g, '');
  errName.classList.remove('show');
});

inpCPF.addEventListener('input', () => {
  let v = inpCPF.value.replace(/\D/g, '').substring(0, 11);
  if      (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, '$1.$2');
  inpCPF.value = v;
  errCPF.classList.remove('show');
});

document.getElementById('btn-start').addEventListener('click', () => {
  const name = inpName.value.trim();
  const cpf  = inpCPF.value.replace(/\D/g, '');
  let ok = true;
  if (!name)               { errName.classList.add('show'); ok = false; }
  if (cpf.length !== 11)   { errCPF.classList.add('show');  ok = false; }
  if (!ok) return;

  playerName  = name;
  goals       = 0;
  shots       = 0;
  shotResults = [];
  dirSel.reset();
  powSel.reset();
  document.getElementById('overlay-login').style.display = 'none';
  state = ST.DIR;
});
*/
