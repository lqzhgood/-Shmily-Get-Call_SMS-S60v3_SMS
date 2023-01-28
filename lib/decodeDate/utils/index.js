const fs = require('fs');


function printProcess(n, max) {
    console.log(`${(n.div(max).toNumber() * 100).toFixed(2)} %`.padStart(10, ' '), n.toString());
    fs.writeFileSync('./process.txt', n.toString());
}

function getHexStr(num) {
    return num.toString(16).padStart(2, '0').toUpperCase();
}

function ArrToHexStr(arr) {
    const sArr = arr.map(v => '0x' + getHexStr(v));
    const s = JSON.stringify(sArr).replace(/"/g, '').replace(/,/g, ', ');
    return s;
}

module.exports = {
    printProcess,
    getHexStr,
    ArrToHexStr,
};