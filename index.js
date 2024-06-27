import { get } from './trafikverket.js';

//document.querySelector('svg').addEventListener('click', get);

//get();

function appendOrm(element, zoom, x, y) {
    const ormUrl = `https://a.tiles.openrailwaymap.org/standard/${zoom}/${x}/${y}.png`;

    const imgEl = document.createElement('img');
    imgEl.src = ormUrl;

    element.append(imgEl);
}

function draw() {
    tilesEl.innerHTML = '';

    appendOrm(tilesEl, z, x - 2, y - 2);
    appendOrm(tilesEl, z, x - 1, y - 2);
    appendOrm(tilesEl, z, x - 0, y - 2);
    appendOrm(tilesEl, z, x + 1, y - 2);
    appendOrm(tilesEl, z, x - 2, y - 1);
    appendOrm(tilesEl, z, x - 1, y - 1);
    appendOrm(tilesEl, z, x - 0, y - 1);
    appendOrm(tilesEl, z, x + 1, y - 1);
    appendOrm(tilesEl, z, x - 2, y - 0);
    appendOrm(tilesEl, z, x - 1, y - 0);
    appendOrm(tilesEl, z, x - 0, y - 0);
    appendOrm(tilesEl, z, x + 1, y - 0);
    appendOrm(tilesEl, z, x - 2, y + 1);
    appendOrm(tilesEl, z, x - 1, y + 1);
    appendOrm(tilesEl, z, x - 0, y + 1);
    appendOrm(tilesEl, z, x + 1, y + 1);

    document.getElementById('info').innerText = `z: ${z}, x: ${x}, y: ${y},`;
}

function mup() {
    y--;
    draw();
}
function mdown() {
    y++;
    draw();
}
function mleft() {
    x--;
    draw();
}
function mright() {
    x++;
    draw();
}
function zin() {
    z++;
    x *= 2;
    y *= 2;
    draw();
}
function zout() {
    z--;
    x = Math.round(x / 2);
    y = Math.round(y / 2);
    draw();
}

document.getElementById('up').addEventListener('click', mup);
document.getElementById('down').addEventListener('click', mdown);
document.getElementById('left').addEventListener('click', mleft);
document.getElementById('right').addEventListener('click', mright);
document.getElementById('in').addEventListener('click', zin);
document.getElementById('out').addEventListener('click', zout);
document.onkeydown = (e) => {
    switch (e.key) {
        case 'ArrowUp':
            mup();
            break;
        case 'ArrowDown':
            mdown();
            break;
        case 'ArrowLeft':
            mleft();
            break;
        case 'ArrowRight':
            mright();
            break;
        case '+':
            zin();
            break;
        case '-':
            zout();
            break;
        default:
            break;
    }
};

const tilesEl = document.getElementById('tiles');

let [z, x, y] = [4, 9, 5];

draw(tilesEl, z, x, y);
