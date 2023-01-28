const { hexToNum } = require('./lib/index');
const { _N, K } = require('./lib/const');
const { findSTime, findETime, findSTimePosition, findETimePosition } = require('./lib/get');


// T = ( HEX - N ) /K
function getTime(arr) {
    const HEX = hexToNum(arr);
    const T = HEX.minus(_N).div(K).toNumber();
    // console.log('T', new Date(T).toLocaleString());
    return T;
}




module.exports = { getTime, findSTime, findETime, findSTimePosition, findETimePosition };