const axios = require('axios');
const cheerio = require('cheerio');

async function searchBingImages(query) {
    try {
        const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const images = [];

        $('a.iusc').each((i, el) => {
            const m = $(el).attr('m');
            if (m) {
                try {
                    const mData = JSON.parse(m);
                    if (mData.murl && mData.murl.match(/\.(jpeg|jpg|png)/i)) {
                        images.push(mData.murl);
                    }
                } catch (e) {}
            }
        });

        return images;
    } catch (error) {
        console.error('Error fetching Bing images:', error.message);
        return [];
    }
}

async function test() {
    const imgs = await searchBingImages('skoda octavia car exterior front');
    console.log(imgs.slice(0, 3));
}

test();
