const BigNumber = require('bignumber.js');


module.exports = {
    K: 1000, // 经验值
    _N: new BigNumber(62168256000000000), // 这个经测试应该是对的
    DAY_FORMAT: 'YYYY/MM/DD HH:mm:ss',

    // 0xE1,0x00 是时间的一部分 估计是 年那一部分 20xx年基本不会变 所以也引入作为标识符
    S_TIME_FLAG: [0xE1, 0x00, 0x00], //0x91, 0x38
    // 根据 找到 S_TIME_FLAG 的位置进行的偏移量, 例如 0XE1,0X00 也是时间范围内
    // 那么偏移量就是 -2
    S_TIME_OFFSET: 2,
    E_TIME_FLAG: [0xE1, 0x00, 0x20, 0x00, 0x00],
    E_TIME_OFFSET: 2,
    TIME_LENGTH: 8,
};