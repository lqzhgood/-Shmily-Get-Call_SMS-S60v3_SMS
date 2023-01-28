const fs = require('fs');
const path = require('path');

const bf = fs.readFileSync(path.join(process.cwd(), './test/example/0010456b'));
const bfArr = Array.from(bf);
const bfArrHex = bfArr.map(v => `0x${v.toString(16)}`);

fs.writeFileSync('./bfArrHex.json', JSON.stringify(bfArrHex));
