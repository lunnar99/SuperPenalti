'use strict';

// ─── PRÉ-CARREGAMENTO DAS IMAGENS ─────────────────────────────────────────────
const imgTrave   = new Image();
const imgBola    = new Image();
const imgGoleiro = new Image();
const estadioFrames = [new Image(), new Image()];

let _imgsCarregadas = 0;
const _TOTAL_IMGS   = 5; // trave + bola + goleiro + 2 frames

imgGoleiro.onload        = () => _imgsCarregadas++;
imgTrave.onload          = () => _imgsCarregadas++;
imgBola.onload           = () => _imgsCarregadas++;
estadioFrames[0].onload  = () => _imgsCarregadas++;
estadioFrames[1].onload  = () => _imgsCarregadas++;

imgGoleiro.src           = 'imgs/goleiro.png';
imgTrave.src             = 'imgs/trave.png';
imgBola.src              = 'imgs/bola.png';
estadioFrames[0].src     = 'imgs/estadio1.png';
estadioFrames[1].src     = 'imgs/estadio2.png';

// Retorna true quando todas as imagens estiverem prontas
function imgsOk() { return _imgsCarregadas >= _TOTAL_IMGS; }
