import sweden from './sweden.js';

const key = '30a5b65bd4df4f788c83ac78f46dd5d8';
const url = 'https://api.trafikinfo.trafikverket.se/v2/data.json';

export const get = async () => {
    const svg = document.querySelector('svg');

    svg.innerHTML = '';

    //Draw borders
    sweden.forEach((landmass) => {
        const c = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'polygon'
        );

        c.setAttribute(
            'points',
            landmass[0].map((l) => l[0] + ', ' + (-l[1] + 100)).join(' ')
        );

        c.classList.add('border');

        svg.append(c);
    });

    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'text/xml',
        },
        body: `<REQUEST>
        <LOGIN authenticationkey="${key}"/>
        <QUERY objecttype="TrainPosition" namespace="järnväg.trafikinfo" schemaversion="1.1" limit="1000">
        <FILTER>
        <GT name="TimeStamp" value="$dateadd(-0.00:05:00)" />
        </FILTER>
        </QUERY>
        </REQUEST>`,
    });

    const data = await response.json();
    const trains = data.RESPONSE.RESULT[0].TrainPosition;

    const final = trains.map((t) => {
        let pos = t.Position.WGS84.slice(7, -1).split(' ');

        return {
            number: t.Train.OperationalTrainNumber,
            lat: Number(pos[0]),
            lon: Number(pos[1]),
            time: new Date(t.TimeStamp),
        };
    });

    final.forEach((t) => {
        const c = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'circle'
        );

        c.setAttribute('cx', t.lat + 'px');
        c.setAttribute('cy', -t.lon + 100 + 'px');
        c.setAttribute('r', '0.1px');
        c.classList.add('train');

        svg.append(c);
    });
};
