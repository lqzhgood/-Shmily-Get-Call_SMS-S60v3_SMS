const fs = require('fs');
const BigNumber = require('bignumber.js');

const { verifyNByDateInit } = require('./lib/index');
const tps = require('./lib/tps');
const { printProcess } = require('./utils/index');

const lastProcess = fs.readFileSync("./process.txt", 'utf-8') || 0;
console.log('lastProcess', lastProcess);

const { MAX, STEP } = require('./config');

let N = new BigNumber(lastProcess);


(async () => {
    await w();

    console.log(N.toString());

    console.log('ok');
})();

async function w() {
    while (N.isLessThanOrEqualTo(MAX)) {
        await Promise.all(makePArr(N));
        N = N.plus(STEP);

        printProcess(N, MAX);
    }
}


function makePArr(n) {
    return new Array(STEP).fill().map((v, i) => calculate(n.plus(i)));
}

function calculate(n) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let f = true;
            for (let i = 0; i < tps.length; i++) {
                const tp = tps[i];
                const [exact, diff] = verifyNByDateInit(tp, n);
                if (!exact) {
                    f = exact;
                    break;
                }
            }
            // 找到的值
            if (f) {
                fs.appendFileSync('./result.txt', `${n.toString()}\n`);
            }
            resolve();
        }, 0);
    });
}




// Hex -

setTimeout(() => { }, 10000000);