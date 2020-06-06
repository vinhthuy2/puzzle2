import * as Game from './game.js';
const widthELement = document.querySelector('#horizontal');
const heightElement = document.querySelector('#vertical');
let width = parseInt(widthELement.value);
let height = parseInt(heightElement.value);
widthELement.addEventListener('input', onWidthChangedHanlder);
heightElement.addEventListener('input', onHeightChangedHanlder);

const root = document.documentElement;
const panelElement = document.querySelector('.panel');
let gridSize = [width, height];

root.style.setProperty('--panel-w-segs', gridSize[0]);
root.style.setProperty('--panel-h-segs', gridSize[1]);

Game.gameInit(panelElement, gridSize);

function onWidthChangedHanlder(e) {
    width = parseInt(e.target.value);
    root.style.setProperty('--panel-w-segs', width);
    Game.gameInit(panelElement, [width, height]);
}

function onHeightChangedHanlder(e) {
    height = parseInt(e.target.value);
    root.style.setProperty('--panel-h-segs', height);
    Game.gameInit(panelElement, [width, height]);
}
