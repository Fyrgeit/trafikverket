import { getTrains } from './trafikverket.js';

const trains = await getTrains();

function appendOrm(element, zoom, x, y) {
    let url = `https://a.tiles.openrailwaymap.org/standard/${zoom}/${x}/${y}.png`;
    if (x < 0 || y < 0 || x >= 2 ** zoom || y >= 2 ** zoom) {
        url =
            'https://styles.redditmedia.com/t5_5aqxuf/styles/profileIcon_pw3jbm2lb5y71.jpg?width=256&height=256&frame=1&auto=webp&crop=256:256,smart&s=809a74185d3c029ba0afc0a3ea4b07018fba1fa6';
    }

    const imgEl = document.createElement('img');
    imgEl.src = url;

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

    drawTrains(trains);
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

function coords2pos(coords) {
    return {
        y:
            -(
                Math.log(Math.tan((coords.lat / 90 + 1) * (Math.PI / 4))) *
                (180 / Math.PI)
            ) /
                (90 * 4) +
            0.5,
        x: coords.lon / 360 + 0.5,
    };
}

function pos2localPos(pos) {
    return {
        x: pos.x * 2 ** (z - 2) - (x - 2) / 4,
        y: pos.y * 2 ** (z - 2) - (y - 2) / 4,
    };
}

function drawPointer(lat, lon) {
    const screenHeight = document.body.offsetHeight;

    const pos = pos2localPos(coords2pos({ lat: lat, lon: lon }));

    if (pos.x < 0 || pos.x >= 1 || pos.y < 0 || pos.y >= 1) return;

    const el = document.createElement('div');
    el.classList.add('pointer');
    el.setAttribute(
        'style',
        `left: ${Math.round(screenHeight * pos.x) - 5}px;
        top: ${Math.round(screenHeight * pos.y) - 5}px;`
    );

    document.getElementById('pointers').append(el);
}

function drawTrains(trains) {
    document.getElementById('pointers').innerHTML = '';

    trains.forEach((train) => {
        drawPointer(train.lat, train.lon);
    });
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

let [z, x, y] = [6, 35, 19];

const tilesEl = document.getElementById('tiles');
draw(tilesEl, z, x, y);
