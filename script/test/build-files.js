const fs = require('fs');
const path = require('path');
const { exit } = require('process');

const components = [
  'addon', 'alert', 'breadcrumb', 'breadcrumbItem', 'button', 'checkbox', 'dialog', 'divider', 'dropdown', 'icon', 'input', 'input-group', 'list', 'menu', 'message', 'notification', 'pagination',
  'popconfirm', 'popup', 'radio', 'select', 'step', 'steps', 'switch', 'table', 'tabs', 'tag', 'upload',
];

const FOLDER_ES = 'es';
const FOLDER_LIB = 'lib';
const FOLDER_DIST = 'dist';
const FOLDER_TYPES = 'types';

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(false);
      } else {
        resolve(data.toString());
      }
    });
  });
}

function validateBuildFiles({ folder, desc, files }) {
  const innerFiles = files || components;
  const list = innerFiles.map((fileName) => {
    const p = {
      [FOLDER_ES]: path.resolve(__dirname, `../../${folder}/${fileName}/index.js`),
      [FOLDER_LIB]: path.resolve(__dirname, `../../${folder}/${fileName}/index.js`),
      [FOLDER_DIST]: path.resolve(__dirname, `../../${folder}/${fileName}`),
      [FOLDER_TYPES]: path.resolve(__dirname, `../../${folder}/${fileName}/${fileName}.d.ts`),
    }[folder];
    return new Promise((resolve) => {
      readFile(p)
        .then(
          (data) => {
            resolve({ data, p });
          },
          (r) => {
            resolve({ data: r, p });
          },
        );
    });
  });
  Promise.all(list).then((all) => {
    let result = true;
    all.forEach((r) => {
      if (!r.data) {
        console.error(`Error: ${r.p} is missing`);
        result = false;
      }
    });
    if (result) {
      console.info(`\n构建产物测试：${desc} have passed validates.\n`);
    } else {
      exit(1115);
    }
  });
}

validateBuildFiles({
  folder: FOLDER_ES,
  desc: 'TDesign es modules',
});

validateBuildFiles({
  folder: FOLDER_LIB,
  desc: 'TDesign lib diles',
});

validateBuildFiles({
  folder: FOLDER_DIST,
  desc: 'TDesign dist diles',
  files: ['tdesign.css', 'tdesign.css.map', 'tdesign.js', 'tdesign.js.map', 'tdesign.min.css', 'tdesign.min.css.map', 'tdesign.min.js', 'tdesign.min.js.map'],
});

// todo: types files
validateBuildFiles({
  folder: FOLDER_TYPES,
  desc: 'TDesign types files',
});
