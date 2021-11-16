const fs = require('fs');
const path = require('path');

// npm 发布有时会丢失 typings 文件，发布前再次确认一遍
function checkTypeFileExist() {
  const esTypePath = path.resolve(__dirname, '../es/index.d.ts');
  const libTypePath = path.resolve(__dirname, '../lib/index.d.ts');
  const esmTypePath = path.resolve(__dirname, '../esm/index.d.ts');
  const cjsTypePath = path.resolve(__dirname, '../cjs/index.d.ts');

  const otherTypeFiles = [libTypePath, esmTypePath, cjsTypePath];

  if (fs.existsSync(esTypePath)) {
    console.log('\x1B[32m', `已生成 ${esTypePath} 文件!`);
  } else {
    console.error(`未找到 ${esTypePath} 文件，正在同步其他构建目录 type 文件...`);

    // eslint-disable-next-line no-restricted-syntax
    for (const typeFile of otherTypeFiles) {
      if (fs.existsSync(typeFile)) {
        console.log('\x1B[32m', `正在同步 ${typeFile} 文件至 ${esTypePath}...`);

        fs.copyFileSync(typeFile, esTypePath);

        console.log('\x1B[32m', '同步完成!');
        return false;
      }
    }
  }
}

checkTypeFileExist();
