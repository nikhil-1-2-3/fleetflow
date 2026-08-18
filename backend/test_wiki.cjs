const axios = require('axios');
const cheerio = require('cheerio');

async function getWikiImage(pageName) {
    try {
        const url = `https://en.wikipedia.org/wiki/${pageName}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const img = $('table.infobox img').first().attr('src');
        if (img) {
            return `https:${img.replace(/\d+px-/, '800px-')}`; // get higher res
        }
        return null;
    } catch (e) {
        return null;
    }
}

async function test() {
    console.log(await getWikiImage('Tata_Nexon'));
    console.log(await getWikiImage('Mahindra_Thar'));
    console.log(await getWikiImage('Hyundai_Creta'));
}

test();
