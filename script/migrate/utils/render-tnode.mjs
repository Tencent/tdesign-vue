import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateRenderTNode() {
  let content = readFileSync('src/utils/render-tnode.ts', 'utf8');
  if (content.includes('ComponentRenderProxy')) {
    content = content.replaceAll(
      'ComponentRenderProxy',
      'CreateComponentPublicInstance',
    );
    writeFileSync('src/utils/render-tnode.ts', content, 'utf8');
  }
}
