const fs = require('fs');
const path = require('path');
const { findSTime, findETime } = require('../lib/get');
const { ArrToHexStr } = require('../utils/index');

const bf = fs.readFileSync(path.join(process.cwd(),
    './test/example/',
    '001049B3',
));
const bfArr = Array.from(bf);


getTime(bfArr);

function getTime(arr) {
    const s = { type: 's', a: ArrToHexStr(findSTime(arr)) };
    const e = { type: 'e', a: ArrToHexStr(findETime(arr)) };
    console.log(JSON.stringify([s, e], null, 4));
}
