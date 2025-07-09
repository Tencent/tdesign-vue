import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

function migrateSrcIndexTs() {
  execSync('git restore src/index.ts');
  let content = readFileSync('src/index.ts', 'utf8');
  content = content.replace("import VueCompositionAPI from '@vue/composition-api';", '');

  // 替换 VueCompositionAPI 安装代码
  content = content.replace(/\s*if \(Vue\._installedPlugins\.indexOf\(VueCompositionAPI\) === -1\) \{\s*Vue\.use\(VueCompositionAPI\);\s*\}/g, '');

  writeFileSync('src/index.ts', content, 'utf8');
}

export default function migrateSingleFile() {
  migrateSrcIndexTs();
}
