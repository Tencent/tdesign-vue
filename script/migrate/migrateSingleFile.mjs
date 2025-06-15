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

function migrateSrcTreeAdaptTs(){
  execSync('git restore src/tree/adapt.ts');
  let content = readFileSync('src/tree/adapt.ts', 'utf8');
  content = content.replace('VueCompositionAPI,','').replace(", VueCompositionAPI", '');
  writeFileSync('src/tree/adapt.ts', content, 'utf8');
  
}

function migrateSrcAnchorAnchorTsx(){
  let content = readFileSync('src/anchor/anchor.tsx', 'utf8');
  if (content.includes("import { CSSProperties } from 'vue/types/jsx';")) {
    return; // 已经存在，不需要重复添加
  }
  content= "import { CSSProperties } from 'vue/types/jsx';\n"+content;
  content=content.replace("{activeLineStyle}", "{activeLineStyle as CSSProperties}");
  writeFileSync('src/anchor/anchor.tsx', content, 'utf8');
}

function migrateSrcCalendarCalendarCellTsx(){
  let content = readFileSync('src/calendar/calendar-cell.tsx', 'utf8');
  if (content.includes("import { CSSProperties } from 'vue/types/jsx';")) {
    return; // 已经存在，不需要重复添加
  }
  content= "import { CSSProperties } from 'vue/types/jsx';\n"+content;
  content=content.replace("{cellContentOuterDomStyle}", "{cellContentOuterDomStyle as CSSProperties}");
  writeFileSync('src/calendar/calendar-cell.tsx', content, 'utf8');
}

export default function migrateSingleFile() {
  migrateSrcIndexTs();
  migrateSrcTreeAdaptTs();
  migrateSrcAnchorAnchorTsx();
  migrateSrcCalendarCalendarCellTsx();
}
