const fs = require('fs');
const path = require('path');


function getHexStr(num) {
    return num.toString(16).padStart(2, '0');
}

function ArrToHexStr(arr) {
    const sArr = arr.map(v => '0x' + getHexStr(v));
    const s = JSON.stringify(sArr).replace(/"/g, '').replace(/,/g, ', ');
    return s;
}

function getVarLength(length0, length1) {
    const r1 = length0 % 2 == 0 ? length0 / 2 : length0 / 4 + length1 * 64;
    const r2 = length0 % 2 === 0 ? length0 >> 1 : Number((length0 >> 1) >> 1) + Number(length1 << 6);
    if (r1 != r2) console.log('r1,r2', r1 - 1, r2 - 1);
    return r2 - 1;
}

function ArrToAscii(arr) {
    return arr.map(v => String.fromCharCode(v)).join('');
}


function getHexByFile(p) {

    const fBuffer = fs.readFileSync(p);
    const fArr = Array.from(fBuffer);
    return fArr;
}


module.exports = {
    getHexStr,
    getVarLength,
    ArrToHexStr,
    ArrToAscii,
    getHexByFile,
};