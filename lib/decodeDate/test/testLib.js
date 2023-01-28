const { getN, verifyN, verifyNByDateInit } = require('../lib/index');
const tps = require('../lib/tps');


for (let i = 0; i < tps.length; i++) {
    const tp = tps[i];
    const N = getN(tp, 0);
    const [v1] = verifyN(tp, N);
    const [v2] = verifyNByDateInit(tp, N);

    let diff = true;
    if (i >= 1) {
        diff = tp.HEX_NUM.isGreaterThan(tps[i - 1].HEX_NUM);
    }
    console.log(i, v1, v2, diff);
}
