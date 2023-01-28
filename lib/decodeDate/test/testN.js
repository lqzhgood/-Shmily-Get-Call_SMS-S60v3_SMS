const dayjs = require('dayjs');
const BigNumber = require('bignumber.js');

const { verifyNByDateInit } = require('../lib/index');
const { DAY_FORMAT } = require('../lib/const');
const tps = require('../lib/tps');





const N = new BigNumber(62168256000000000);


for (let i = 0; i < tps.length; i++) {
    const tp = tps[i];
    const [exact, diff] = verifyNByDateInit(tp, N);
    if (tp.type === 's') {
        // console.log(i, tp.type, exact, diff);
        console.log(`${tp.HEX_NUM.toNumber()} ${tp.s_s * 1000} ${N}`);
    }
}