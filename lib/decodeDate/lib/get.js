const _ = require('lodash');
const { S_TIME_FLAG, E_TIME_FLAG, S_TIME_OFFSET, E_TIME_OFFSET, TIME_LENGTH } = require('../lib/const');


function findSTime(arr) {
    const result = [];
    const fLength = S_TIME_FLAG.length;
    arr.forEach((v, i) => {
        const pear = arr.slice(i, i + fLength);
        if (_.isEqual(pear, S_TIME_FLAG)) {
            const t = arr.slice(i + S_TIME_OFFSET - TIME_LENGTH, i + S_TIME_OFFSET);
            result.push(t);
        }
    });

    if (result.length !== 1) console.warn('find time error');
    return result[0];
}

function findSTimePosition(arr) {
    const result = [];
    const fLength = S_TIME_FLAG.length;
    arr.forEach((v, i) => {
        const pear = arr.slice(i, i + fLength);
        if (_.isEqual(pear, S_TIME_FLAG)) {
            result.push(i + S_TIME_OFFSET - TIME_LENGTH);
        }
    });

    if (result.length !== 1) console.warn('find time error');
    return result[0];
}



function findETime(arr) {
    const result = [];
    const fLength = E_TIME_FLAG.length;
    arr.forEach((v, i) => {
        const pear = arr.slice(i, i + fLength);
        if (_.isEqual(pear, E_TIME_FLAG)) {
            const t = arr.slice(i + E_TIME_OFFSET - TIME_LENGTH, i + E_TIME_OFFSET);
            result.push(t);
        }
    });

    if (result.length !== 1) console.warn('find time error');
    return result[0];
}

function findETimePosition(arr) {
    const result = [];
    const fLength = E_TIME_FLAG.length;
    arr.forEach((v, i) => {
        const pear = arr.slice(i, i + fLength);
        if (_.isEqual(pear, E_TIME_FLAG)) {
            result.push(i + E_TIME_OFFSET - TIME_LENGTH);
        }
    });

    if (result.length !== 1) console.warn('find time error');
    return result[0];
}


module.exports = {
    findSTime,
    findETime,
    findSTimePosition,
    findETimePosition,
};