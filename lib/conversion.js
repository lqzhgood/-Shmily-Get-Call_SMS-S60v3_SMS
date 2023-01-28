const dayjs = require('dayjs');
const config = require('../config');

// direction,
//     sendNumber,
//     body,
//     ms,

exports.smsToMsg = function (arr) {
    return arr.map(v => {
        const direction = v.direction == 'out' ? 'go' : 'come';

        const send = {};
        const receive = {};
        if (direction === 'go') {
            send.sender = config.rightNum;
            send.senderName = config.rightName;

            receive.receiver = v.sendNumber;
            receive.receiverName = config.leftName;
        }

        if (direction === 'come') {
            send.sender = v.sendNumber;
            send.senderName = config.leftName;

            receive.receiver = config.rightNum;
            receive.receiverName = config.rightName;
        }

        const msg = {
            source: 'SMS',
            device: config.device,
            type: '短信',

            direction,

            ...send,
            ...receive,

            day: dayjs(v.ms).format('YYYY-MM-DD'),
            time: dayjs(v.ms).format('HH:mm:ss'),
            ms: v.ms,
            content: v.body,
            html: v.body,

            $Dev: {
                numberIsTrue: true,
            },
        };

        return msg;
    });
};
