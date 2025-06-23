import { readFileSync, writeFileSync } from 'node:fs';

function migrateUseSingle() {
  const filePath = 'src/select-input/useSingle.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('const instance = getCurrentInstance();')) {
    content = content.replace('const instance = getCurrentInstance();', 'const instance = getCurrentInstance().proxy;');
    content = content.replaceAll('instance.emit', 'instance.$emit');
    writeFileSync(filePath, content, 'utf8');
  }
}
function migrateUseOverlayInnerStyle() {
  const filePath = 'src/select-input/useOverlayInnerStyle.ts';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('const instance = getCurrentInstance();')) {
    content = content.replace('const instance = getCurrentInstance();', 'const instance = getCurrentInstance().proxy;');
    content = content.replaceAll('instance.emit', 'instance.$emit');
    writeFileSync(filePath, content, 'utf8');
  }
}
function migrateSelectInput() {
  const filePath = 'src/select-input/select-input.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('setup(props: TdSelectInputProps')) {
    content = content.replace('setup(props: TdSelectInputProps', 'setup(props');
    writeFileSync(filePath, content, 'utf8');
  }
}

export default function () {
  migrateSelectInput();
  migrateUseSingle();
  migrateUseOverlayInnerStyle();
}
