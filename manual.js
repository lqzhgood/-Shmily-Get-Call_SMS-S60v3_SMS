const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const _ = require('lodash');

const {
    getDirection,
    getPacketLength,
    getBodyLength,
    getBodyHexArr,
    getBodyHuman,
    getBodyHumanByManual,
    getSendCenterNumber,
    getSendTime,
    getSendNumber,
} = require('./lib/get');
const { getHexByFile } = require('./utils/index');
const { smsToMsg } = require('./lib/conversion');

const INPUT_DIR = './inputM';
const M_CONFIG = require('./inputM/config');

const inputFiles = fs.readdirSync(INPUT_DIR);
const files = inputFiles.filter(v => {
    return v !== 'config.js';
});

for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const df = M_CONFIG[f];
    if (df && df.decode && df.decode.slice(-1)[0][1] === 'end') continue;

    const fArr = getHexByFile(path.join(INPUT_DIR, f));
    const sendNumber = getSendNumber(fArr);

    console.log('sendNumber', sendNumber);

    console.log(f);

    const t = getSendTime(fArr);
    console.log(dayjs(t).format('YYYY-MM-DD HH:mm:ss'));

    getBodyHumanByManual(fArr, df ? df.decode : [], true);

    console.log('files', `${i + 1}/${files.length}`);
    break;
}

// 处理完成以后输出
const finish_config = Object.keys(M_CONFIG).filter(v => {
    const obj = M_CONFIG[v];
    if (!obj.decode) return false;
    if (obj.decode.slice(-1)[0][1] !== 'end') return false;
    return true;
});

const smsArr = [];
if (files.length === finish_config.length) {
    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const fArr = getHexByFile(path.join(INPUT_DIR, f));
        const df = M_CONFIG[f];

        if (df.want === false) continue;

        const direction = getDirection(fArr).alias;
        const sendNumber = getSendNumber(fArr);
        const body = getBodyHumanByManual(fArr, df ? df.decode : []);
        const ms = parseInt(getSendTime(fArr), 10);

        console.log(f, direction, sendNumber, new Date(ms).toLocaleString(), body);
        smsArr.push({
            direction,
            sendNumber,
            body,
            ms,
        });
    }
}

const msgArr = smsToMsg(smsArr);
const msgArrSort = _.sortBy(msgArr, 'ms');

console.log('msgArr', msgArrSort.length);

if (!fs.existsSync('./distM')) {
    fs.mkdirSync('./distM');
}

fs.writeFileSync('./distM/sms_s60_msgInfo_manual.json', JSON.stringify(msgArrSort, null, 4));

console.log('ok');

setTimeout(() => {}, 1000000);
