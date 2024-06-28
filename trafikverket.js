const key = '30a5b65bd4df4f788c83ac78f46dd5d8';
const url = 'https://api.trafikinfo.trafikverket.se/v2/data.json';

export const getTrains = async () => {
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
            lat: Number(pos[1]),
            lon: Number(pos[0]),
            time: new Date(t.TimeStamp),
        };
    });

    return final;
};
