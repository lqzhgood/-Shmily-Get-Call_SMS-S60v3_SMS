const iconv = require('iconv-lite');
const _ = require('lodash');
const { getHexStr, getVarLength, ArrToHexStr, ArrToAscii } = require('../utils/index');

const {
    MSG_CE_FLAG,
    POSITION_DIRECTION,
    POSITION_PACKET_LENGTH,
    POSITION_SMS_LENGTH_FN,
    POSITION_BODY_FN,
    POSITION_SEND_CENTER_NUMBER_LENGTH_FN,
    POSITION_RECEIPT_TIME_FN,
    POSITION_SEND_CENTER_NUMBER_FN,
    POSITION_SEND_NUMBER_LENGTH_FN,
    LENGTH_SEND_CENTER_NUMBER_FN,
    POSITION_SEND_NUMBER_FN,
    LENGTH_SEND_NUMBER_FN,
} = require('./const');


const {
    DIRECTION_TYPE,
} = require('./type');

const { getTime,
    findSTime,
    findETime,
} = require('./decodeDate/index');


function getDirection(packet) {
    return DIRECTION_TYPE[`hex_${getHexStr(packet[POSITION_DIRECTION])}`];
}

/**
 * @name: 获取包的长度
 * @description:
 * @param {*} packet
 * @return {*}
 */
function getPacketLength(packet) {
    const length0 = packet[POSITION_PACKET_LENGTH];
    const length1 = packet[POSITION_PACKET_LENGTH + 1];
    const length = getVarLength(length0, length1);
    return length;
}


/**
 * @name: 获取内容的长度
 * @description: 这个长度是指字的多少，例如 【中A】 ，内容的长度是2，字节长度是3
 * @param {*} packet
 * @return {*}
 */
function getBodyLength(packet) {
    const pSmsL = POSITION_SMS_LENGTH_FN(packet);
    const length0 = packet[pSmsL];
    const length1 = packet[pSmsL + 1];
    const length = getVarLength(length0, length1);
    return length;
}

/**
 * @name:
 * @description: 不准, 没有统一的 FLAG_BODY_END
 * @param {*}
 * @return {*}
 */
// [0x20, 0x29, 0x34, 0x18]
const FLAG_BODY_END = [0x0E, 0X20, 0X29];
function getBodyEnd(packet, s = 0) {
    const pear = packet.slice(s);
    const is = pear.reduce((pre, cV, cI) => {
        if (_.isEqual(pear.slice(cI, cI + 3), FLAG_BODY_END)) pre.push(cI);
        return pre;
    }, []);
    if (is.length !== 1) {
        console.log('is', is);
        throw new Error('多个body结尾标识符');
    }
    return is[0] + s;
}

/**
 * @name:
 * @description: 只是大致范围
 * @param {*} packet
 * @return {*}
 */
function getBodyHexArr(packet) {
    const s = POSITION_BODY_FN(packet);
    const l = getBodyLength(packet);
    // const e = getBodyEnd(packet, s);
    // if (e - s < l) throw new Error('结束POSITION 小于 BODY长度');
    // console.log(packet.slice(s, s + e).map(v => v.toString(16)));
    return packet.slice(s, s + 2 * l + 20);
}

function getBodyHuman(bodyHexArr) {
    let body = '';
    let decodeType = 'utf16-be';
    while (bodyHexArr.length > 0) {
        const decodeFlag = [bodyHexArr[0], bodyHexArr[1]];
        if (_.isEqual(MSG_CE_FLAG, decodeFlag)) {
            decodeType = 'ascii';
        }
        const cutLength = decodeType === 'utf16-be' ? 2 : 1;
        const pear = bodyHexArr.splice(0, cutLength);
        body += iconv.decode(Buffer.from(pear, 'hex'), decodeType);
        // 校验，如果是 UTF16 检查结尾是不是完整的2个字符
        console.log('pear.length', body, pear.length);
        if (decodeType === 'utf16-be' && pear.length !== 2) {
            console.log('bodyHexArr', bodyHexArr);
            throw new Error('body is incomplete');
        }
    }
    return body;
}


function getBodyHumanByManual(packet, decodeArr = [], clg = false) {
    const bodyHexArr = getBodyHexArr(packet);
    const bodyLength = getBodyLength(packet);
    let body = '';
    let count = 0;
    let symbionCount = 0; //疑似符号
    for (let i = 0; i < decodeArr.length; i++) {
        const [length, sortDecodeType] = decodeArr[i];
        if (sortDecodeType === 'end') return body;

        // length
        switch (sortDecodeType) {
            case 'a':
                count += length;
                break;
            case 'u':
                count += length / 2;
                break;
            case '|':
                symbionCount += length > 1 ? length - 1 : 0;
                break;
        }


        const pear = bodyHexArr.splice(0, length);
        if (clg) console.log('pear', sortDecodeType, ArrToHexStr(pear));
        if (sortDecodeType === '|') {
            body += ' ';
            continue;
        }

        const decodeType = mapDecodeType(sortDecodeType);
        body += iconv.decode(Buffer.from(pear, 'hex'), decodeType);
    }
    if (clg) console.log('\n');
    if (clg) console.log('body', body);
    if (clg) console.log('\n');
    if (clg) console.log(iconv.decode(Buffer.from(bodyHexArr, 'hex'), 'utf16-be'));
    if (clg) console.log(iconv.decode(Buffer.from(bodyHexArr), 'utf-8'));
    if (clg) console.log('\n');
    if (clg) console.log('bodyHexArr', ArrToHexStr(bodyHexArr));
    if (clg) console.log(`${count} / ${count + symbionCount} / ${bodyLength}  `);
    return body;
}


function getSendTime(packet) {
    return getTime(findSTime(packet));
}



function getSendCenterNumber(packet) {
    const p = POSITION_SEND_CENTER_NUMBER_FN(packet);
    const l = LENGTH_SEND_CENTER_NUMBER_FN(packet);
    const pear = packet.slice(p, p + l);
    return iconv.decode(Buffer.from(pear, 'hex'), 'ascii');
}


function getSendNumber(packet) {
    const p = POSITION_SEND_NUMBER_FN(packet);
    const l = LENGTH_SEND_NUMBER_FN(packet);
    const pear = packet.slice(p, p + l);
    return iconv.decode(Buffer.from(pear, 'hex'), 'ascii');
}



function mapDecodeType(s) {
    switch (s) {
        case 'a':
            return 'ascii';
        case 'u':
            return 'utf16-be';
        default:
            throw new Error(`unknown sort type ${s}`);
    }
}



module.exports = {
    getDirection,
    getPacketLength,
    getBodyLength,
    getBodyHexArr,
    getBodyHuman,
    getBodyHumanByManual,
    getSendTime,
    getSendCenterNumber,
    getSendNumber,
};