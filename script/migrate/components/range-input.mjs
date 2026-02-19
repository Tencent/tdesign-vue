import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateRangeInput() {
  const filePath = 'src/range-input/range-input.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('const instance = getCurrentInstance();')) {
    content = content.replace('const instance = getCurrentInstance();', 'const instance = getCurrentInstance().proxy;');
    content = content.replaceAll('instance.emit', 'instance.$emit');
    writeFileSync(filePath, content, 'utf8');
  }
}
