const BigNumber = require('bignumber.js');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
global.BigNumber = BigNumber;
dayjs.extend(customParseFormat);

const { K, _N, DAY_FORMAT } = require('./const');

function hexToNum(arr) {
    const hex = '0x' + arr
        .map(v => v.toString(16).padStart(2, '0'))
        .reverse()
        .join('');
    const num = new BigNumber(Number(hex));
    return num;
}


//  HEX_NUM = T*K + N
// T = s(确定值) + ms(无法获取)
function getN(tp, ms) {
    if (ms === undefined) throw new Error('not input ms');
    const HEX_NUM = hexToNum(tp.a);
    const T = dayjs(tp.t, DAY_FORMAT, true).valueOf() + ms;

    // const N = HEX_NUM - T * K;
    const N = HEX_NUM.minus(T * K);
    return N;
}

/**
 * @name:
 * @description: 通过 未 包含初始化值的对象验证
 * @param {*} tp
 * @param {*} N
 * @return {*} [精确匹配(Boolean),匹配度(与准确值的偏差 秒 的绝对值 )]
 */
function verifyN(tp, N) {
    const HEX_NUM = hexToNum(tp.a);
    // const T = (HEX_NUM - N) / K;
    let T = HEX_NUM.minus(N).div(K).toNumber();
    if (T < 0) return [false];

    T = parseInt(T / 1000, 10);
    const diff = T - tp.s_s;
    return [diff === 0, diff];
}


/**
 * @name:
 * @description: 通过 已经 包含初始化值的对象验证
 * @param {*} tp
 * @param {*} N
 * @return {*} [精确匹配(Boolean),匹配度(与准确值的偏差 秒 的绝对值 )]
 */
function verifyNByDateInit(tp, N) {
    const HEX_NUM = tp.HEX_NUM;
    let T = HEX_NUM.minus(N).div(K).toNumber();
    if (T < 0) return [false];

    T = parseInt(T / 1000, 10);
    const diff = T - tp.s_s;
    return [diff === 0, diff];
}




module.exports = {
    getN,
    verifyN,
    verifyNByDateInit,
    hexToNum,
};