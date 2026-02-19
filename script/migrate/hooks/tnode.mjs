import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateTNode() {
  const filePath = 'src/hooks/tnode.ts';
  let content = readFileSync(filePath, 'utf-8');
  if (!content.includes('getCurrentInstance().proxy')) {
    content = content.replace('getCurrentInstance()', 'getCurrentInstance().proxy')
      .replace('const { slots } = instance.setupContext;', 'const slots = instance.$scopedSlots;')
      .replaceAll('instance.props', 'instance.$props');
    writeFileSync(filePath, content, 'utf-8');
  }
}
