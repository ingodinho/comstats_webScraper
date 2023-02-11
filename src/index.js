import axios from 'axios';
import {JSDOM} from 'jsdom';
import {clubEndpoints} from "./data/club-endpoints.js";
import {saveFile} from "./helper/fileserver.js";

const baseUrl = 'https://stats.comunio.de/squad/';

const getPlayerStatsPerClub = async (clubEndpoint, clubName) => {
    const {data} = await axios.get(baseUrl + clubEndpoint);
    const dom = new JSDOM(data);
    const player = dom.window.document.querySelectorAll('#teamTable tr');
    const playerArray = Array.from(player);

    const playerData = playerArray.map((player, index) => {

        if (index === playerArray.length - 1) {
            return null;
        }

        const playerInfo = player.querySelectorAll('td');
        const playerInfoArray = Array.from(playerInfo);

        const playerInfoObject = {
            name: playerInfoArray[1]?.textContent.trim(),
            club: clubName,
            points: playerInfoArray[3]?.textContent,
            matches: playerInfoArray[4]?.textContent,
            pointsPerMatch: playerInfoArray[5]?.textContent,
            price: playerInfoArray[9]?.textContent,
            date: new Date().toDateString()
        };

        if(playerInfoObject.name === undefined) {
            return null;
        }
        return playerInfoObject;
    });
    return playerData.filter((player) => player !== null);
}

const allClubData = (await Promise.all(clubEndpoints.map(async (clubEndpoint) => {
    return await getPlayerStatsPerClub(clubEndpoint.endpoint, clubEndpoint.name);
}))).flatMap((club) => club);

const savedData = await saveFile(JSON.stringify(allClubData, null, 2), './src/data/players.json');
