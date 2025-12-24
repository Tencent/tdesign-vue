import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateAnchor() {
  let content = readFileSync('src/anchor/anchor.tsx', 'utf8');
  if (!content.includes("import { CSSProperties } from 'vue/types/jsx';")) {
    content = `import { CSSProperties } from 'vue/types/jsx';\n${content}`;
    content = content.replace('{activeLineStyle}', '{activeLineStyle as CSSProperties}');
    writeFileSync('src/anchor/anchor.tsx', content, 'utf8');
  }
}
