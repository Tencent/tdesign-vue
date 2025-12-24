import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateTree() {
  let content = readFileSync('src/tree/adapt.ts', 'utf8');
  content = content.replace('VueCompositionAPI,', '').replace(', VueCompositionAPI', '');
  writeFileSync('src/tree/adapt.ts', content, 'utf8');
}
