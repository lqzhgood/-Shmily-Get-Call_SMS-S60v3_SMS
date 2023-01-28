const fs = require('fs');
const BigNumber = require('bignumber.js');

const { verifyNByDateInit } = require('./lib/index');
const tps = require('./lib/tps');
const { printProcess } = require('./utils/index');

const lastProcess = fs.readFileSync("./process.txt", 'utf-8') || 0;
console.log('lastProcess', lastProcess);

const { MAX, STEP } = require('./config');


let N = new BigNumber(lastProcess);


while (N.isLessThanOrEqualTo(MAX)) {
    let f = true;
    for (let i = 0; i < tps.length; i++) {
        const tp = tps[i];
        const [exact, diff] = verifyNByDateInit(tp, N);
        if (!exact) {
            f = exact;
            break;
        }
    }

    // 找到的值
    if (f) {
        fs.appendFileSync('./result.txt', `${N.toString()}\n`);
    }

    if (N.mod(STEP).toNumber() === 0) {
        printProcess(N, MAX);
    }

    N = N.plus(1);
}



console.log(N.toString());

console.log('ok');



setTimeout(() => { }, 10000000);