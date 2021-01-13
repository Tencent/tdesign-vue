const fs = require('fs');
const utils = require('../utils');

const DomParser = require('dom-parser');
const parser = new DomParser();
const result = {};
fs.readFile(utils.resolveCwd('test/unit/coverage/index.html'), 'utf8', (err, html) => {
  if (err) {
    console.log('please execute npm run test:coverage frist!', err);
    return;
  }
  if (!err) {
    const dom = parser.parseFromString(html);
    const tds = dom.getElementsByTagName('td');

    let key = '';
    let value = '';

    Array.from(tds).forEach((item, index) => {
      const col = index % 10;

      if (col === 0) {
        const [, name] = item.getAttribute('data-value').split('src/');
        key = name;
      } else if (col === 8) {
        value = `${item.getAttribute('data-value')}%`;
      } else if (col === 9) {
        result[key] = value;
      }
    });

    // 特殊case处理
    result.inputnumber = result['input-number'];

    const finalRes = `module.exports = ${JSON.stringify(result, null, 2)}`;
    fs.writeFileSync(utils.resolveCwd('site/config/test-coverage.js'), finalRes);
    console.log('successful re-generate coverage');
  }
});
