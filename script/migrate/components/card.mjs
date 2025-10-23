import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateCard() {
  const filePath = 'src/card/card.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('{this.cover}')) {
    content = content.replace('{this.cover}', '{this.cover as string}');
    writeFileSync(filePath, content, 'utf8');
  }
}
