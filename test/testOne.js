const iconv = require('iconv-lite');


const {
    getDirection,
    getPacketLength,
    getBodyLength,
    getBodyHexArr,
    getBodyHuman,
    getBodyHumanByManual,
    getSendCenterNumberLength,
    getSendCenterNumber,
    getSendTime,
    getSendNumber,
} = require('../lib/get');


const example = require('./example/in');


// const t = example[0];
const t = example[0];

const d = getDirection(t);
console.log('方向', d);

const pL = getPacketLength(t);
console.log('Packet Length', pL);

const bL = getBodyLength(t);
console.log('Body 长度', bL);

const bdHex = getBodyHexArr(t);
console.log('Body Hex Arr', bdHex.map(v => v.toString(16)));


const sendTime = getSendTime(t);
console.log('sendTime', new Date(sendTime).toLocaleString());


const sendCenterNumber = getSendCenterNumber(t);
console.log('sendCenterNumber', sendCenterNumber);


const sendNumber = getSendNumber(t);
console.log('sendNumber', sendNumber);



// const bodyReadHuman = getBodyHuman(bdHex);
// console.log('bodyReadHuman', bodyReadHuman);


// const bodyRead = iconv.decode(Buffer.from([0x0e, 0x55], 'hex'), 'utf16-be');
// console.log('bodyRead', `|${bodyRead}|`);


getBodyHumanByManual(t, [
    [3, 'a'],
    [1, '|'],
    [2, 'u'],
    [2, '|'],
    [2, '|'],
    [2, 'a'],
    [1, '|'],
    [8, 'u'],
    [1, '|'],
    [5, 'a'],
    [2, '|'],
    [6, 'u'],
]);











setTimeout(() => {

}, 1000000);