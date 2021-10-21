/**
 * 构建产物测试
 * 1. es 组件模块是否完整
 * 2. lib 组件模块是否完整
 * 3. types 组件数据类型是否完整
 * 4. dist 组件总包是否完整
 */
const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const pkg = require('../../package.json');

const components = [
  'addon', 'alert', 'breadcrumb', 'breadcrumbItem', 'button', 'checkbox', 'dialog', 'divider', 'dropdown',
  'icon', 'input', 'input-group', 'list', 'menu', 'message', 'notification', 'pagination',
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
        reject(new Error('read file error'));
      } else {
        resolve(data.toString());
      }
    });
  });
}

function validateBuildFiles({
  folder, desc, files, fullPath,
}) {
  const innerFiles = files || components;
  const list = innerFiles.map((fileName) => {
    const file = fullPath ? fileName : `${fileName}/index.js`;
    const p = {
      [FOLDER_ES]: path.resolve(__dirname, `../../${folder}/${file}`),
      [FOLDER_LIB]: path.resolve(__dirname, `../../${folder}/${file}`),
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
        console.error(`\nError: ${r.p} is missing\n`);
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

function validatePkg() {
  const expect = {
    main: 'lib/index-lib.js',
    module: 'es/index.js',
    unpkg: 'dist/tdesign.min.js',
    jsdelivr: 'dist/tdesign.min.js',
  };
  Object.keys(expect).forEach((key) => {
    if (pkg[key] !== expect[key]) {
      console.error(`package.json Validates Failed: ${key} expects to be ${expect[key]}, but got ${pkg[key]}`);
      exit(0);
    }
  });
  console.log('构建产物测试：TDesign package.json has passed validates');
}

/**
 * 开始校验
 */

validateBuildFiles({
  folder: FOLDER_ES,
  desc: 'TDesign es modules',
});
validateBuildFiles({
  folder: FOLDER_ES,
  desc: 'TDesign es modules index.js',
  files: ['index.js'],
  fullPath: true,
});

validateBuildFiles({
  folder: FOLDER_LIB,
  desc: 'TDesign lib files',
});
validateBuildFiles({
  folder: FOLDER_LIB,
  desc: 'TDesign lib files index.js',
  files: ['index-lib.js', 'index.js'],
  fullPath: true,
});

validateBuildFiles({
  folder: FOLDER_DIST,
  desc: 'TDesign dist files',
  files: [
    'tdesign.css',
    'tdesign.css.map',
    'tdesign.js',
    'tdesign.js.map',
    'tdesign.min.css',
    'tdesign.min.css.map',
    'tdesign.min.js',
    'tdesign.min.js.map',
  ],
});

// todo: types 文件还未生成
// validateBuildFiles({
//   folder: FOLDER_TYPES,
//   desc: 'TDesign types files',
// });

validatePkg();
