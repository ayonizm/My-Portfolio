const https = require('https');

// Try contest history
const url = 'https://kenkoooo.com/atcoder/atcoder-api/v3/user/contest_history?user=ayonizm';

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            console.log('--- Contest History ---');
            console.log(data.substring(0, 500)); // Print first 500 chars to avoid spam
            const json = JSON.parse(data);
            if (Array.isArray(json) && json.length > 0) {
                const last = json[json.length - 1];
                console.log('Last Contest:', last);
                console.log('Current Rating:', last.NewRating);
            } else {
                console.log('No history found or error');
            }
        } catch (e) { console.error(e); }
    });
});
