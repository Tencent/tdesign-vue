import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateUseVModel() {
  const filePath = 'src/hooks/useVModel.ts';
  let content = readFileSync(filePath, 'utf-8');
  if (content.includes('const { emit, vnode } = getCurrentInstance();')) {
    content = content.replace(
      'const { emit, vnode } = getCurrentInstance();',
      `const instance = getCurrentInstance().proxy;
  const emit = instance.$emit;
  const vnode = instance.$vnode;`,
    );
    writeFileSync(filePath, content, 'utf-8');
  }
}
