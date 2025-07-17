import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateAutoComplete() {
  const filePath = 'src/auto-complete/auto-complete.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('...this.popupProps,')) {
    content = content.replace('...this.popupProps,', '...(this.popupProps as PopupProps),');
    writeFileSync(filePath, content, 'utf8');
  }
}
