const { findSTimePosition, findETimePosition } = require('./decodeDate/index');

const MSG_CE_FLAG = [0xe0, 0x20]; // 中(utf16-be)英(ascii) 编码切换标志

const MSG_HEADER = [0x68, 0x3c, 0x00, 0x10];

const POSITION_DIRECTION = 16;

const POSITION_PACKET_LENGTH = 21;

const OFFSET_SMS_LENGTH = 36;

function POSITION_SMS_LENGTH_FN(packet) {
    const offset_length = packet[POSITION_PACKET_LENGTH] % 2 === 0 ? 1 : 2;
    return POSITION_PACKET_LENGTH + offset_length + OFFSET_SMS_LENGTH;
}

function POSITION_BODY_FN(packet) {
    const pSmsL = POSITION_SMS_LENGTH_FN(packet);
    const pBody = pSmsL + (packet[pSmsL] % 2 === 0 ? 1 : 2);
    return pBody;
}

function POSITION_SEND_TIME_FN(packet) {
    const index = findSTimePosition(packet);
    return index;
}

const LENGTH_TIME = 8;

const OFFSET_SEND_CENTER_NUMBER = 2; // [0x00, 0x91, 0x38] 0x38是长度
const LENGTH_SEND_CENTER_NUMBER = 1; // [0x38]是长度
function POSITION_SEND_CENTER_NUMBER_LENGTH_FN(packet) {
    const i = POSITION_SEND_TIME_FN(packet);
    return i + LENGTH_TIME + OFFSET_SEND_CENTER_NUMBER;
}

// 位置 短信中心号码
function POSITION_SEND_CENTER_NUMBER_FN(packet) {
    const index = POSITION_SEND_CENTER_NUMBER_LENGTH_FN(packet);
    return index + LENGTH_SEND_CENTER_NUMBER;
}

function LENGTH_SEND_CENTER_NUMBER_FN(packet) {
    const p = POSITION_SEND_CENTER_NUMBER_LENGTH_FN(packet);
    return packet[p] / 4;
}

// 位置 短信接收人号码长度
const OFFSET_SEND_NUMBER = 2; // [0x04, 0x91, 0x38] 0x38是长度
const LENGTH_SEND_NUMBER = 1; // [0x38]
function POSITION_SEND_NUMBER_LENGTH_FN(packet) {
    const i = POSITION_SEND_CENTER_NUMBER_FN(packet);
    return i + LENGTH_SEND_CENTER_NUMBER_FN(packet) + OFFSET_SEND_NUMBER;
}

function POSITION_SEND_NUMBER_FN(packet) {
    const i = POSITION_SEND_NUMBER_LENGTH_FN(packet);
    return i + LENGTH_SEND_NUMBER;
}

function LENGTH_SEND_NUMBER_FN(packet) {
    const p = POSITION_SEND_NUMBER_LENGTH_FN(packet);
    return packet[p] / 4;
}

// const OFFSET_SEND_NUMBER = 1; // [0x04,0x91]
// function POSITION_SEND_NUMBER_FN(packet) {
//     const index = POSITION_SEND_CENTER_NUMBER_FN(packet);
//     return index + OFFSET_SEND_NUMBER;
// }

// const OFFSET_RECEIPT_TIME = 2;
// function POSITION_RECEIPT_TIME_FN(packet) {
//     const index = findETimePosition(packet);
//     return index;
// }

module.exports = {
    MSG_CE_FLAG,

    POSITION_PACKET_LENGTH,

    POSITION_DIRECTION,
    POSITION_SMS_LENGTH_FN,
    POSITION_BODY_FN,

    POSITION_SEND_TIME_FN,
    POSITION_SEND_CENTER_NUMBER_LENGTH_FN,
    POSITION_SEND_CENTER_NUMBER_FN,

    LENGTH_SEND_CENTER_NUMBER_FN,
    POSITION_SEND_NUMBER_LENGTH_FN,
    POSITION_SEND_NUMBER_FN,
    LENGTH_SEND_NUMBER_FN,

    // POSITION_SEND_NUMBER_FN,
    // POSITION_RECEIPT_TIME_FN,
};
