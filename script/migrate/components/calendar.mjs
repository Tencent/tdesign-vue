import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateCalendar() {
  const filePath = 'src/calendar/calendar-cell.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (!content.includes("import { CSSProperties } from 'vue/types/jsx';")) {
    content = `import { CSSProperties } from 'vue/types/jsx';\n${content}`;
    content = content.replace('{cellContentOuterDomStyle}', '{cellContentOuterDomStyle as CSSProperties}');
    writeFileSync(filePath, content, 'utf8');
  }
}
