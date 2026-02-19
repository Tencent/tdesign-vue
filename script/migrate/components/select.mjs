import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateSelect() {
  const filePath = 'src/select/select.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('const instance = getCurrentInstance();')) {
    content = content.replace('const instance = getCurrentInstance();', 'const instance = getCurrentInstance().proxy;');
    content = content.replaceAll('instance.emit', 'instance.$emit');
    writeFileSync(filePath, content, 'utf8');
  }
}
