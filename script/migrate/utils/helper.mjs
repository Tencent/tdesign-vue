import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateHelper() {
  let content = readFileSync('src/utils/helper.ts', 'utf8');
  if (!content.includes("import { CSSProperties } from 'vue/types/jsx';")) {
    content = `import { CSSProperties } from 'vue/types/jsx';\n${content}`;
    content = content.replace(
      'export function setTransform(value: string): object',
      'export function setTransform(value: string): CSSProperties',
    );
    writeFileSync('src/utils/helper.ts', content, 'utf8');
  }
}
