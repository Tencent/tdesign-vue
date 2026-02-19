import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateDropdown() {
  const filePath = 'src/dropdown/dropdown-item.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('ref={this.itemRef}')) {
    content = content.replace(
      'ref={this.itemRef}',
      'ref="itemRef"',
    );
    writeFileSync(filePath, content, 'utf8');
  }
}
