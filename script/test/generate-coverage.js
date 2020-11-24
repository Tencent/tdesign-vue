const fs = require('fs');
const utils = require('../utils');

var DomParser = require('dom-parser');
var parser = new DomParser();
var result = {};
fs.readFile(utils.resolveCwd('test/unit/coverage/index.html'), 'utf8', function(err, html){
  if (err) {
    console.log('please execute npm run test:coverage frist!', err)
    return
  }
  if (!err){
    var dom = parser.parseFromString(html);
    var tds = dom.getElementsByTagName('td')

    let key = '';
    let value = '';

    Array.from(tds).forEach((item, index) => {

      let col = index % 10;

      if (col === 0) {
        key = item.getAttribute('data-value').split('src/')[1];
      } else if ( col === 8 ) {
        value = item.getAttribute('data-value') + '%';
      } else if ( col === 9 ) {
        result[key] = value;
      }
    });

    const finalRes = `module.exports = ${JSON.stringify(result)}`
    fs.writeFileSync(utils.resolveCwd('site/config/test-coverage.js'), finalRes)
    console.log('successful re-generate coverage')
  }
})