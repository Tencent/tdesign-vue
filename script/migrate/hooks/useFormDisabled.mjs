import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateUseFormDisabled() {
  const filePath = 'src/hooks/useFormDisabled.ts';
  let content = readFileSync(filePath, 'utf-8');
  if (content.includes('const currentInstance = getCurrentInstance();')) {
    content = content.replace(
      'getCurrentInstance()',
      'getCurrentInstance().proxy',
    ).replaceAll('parent', '$parent').replace('$parent.proxy', '$parent')
      .replace('parent.props', 'parent.$props');
    content = content.replaceAll('instance.props', 'instance.$props');
    writeFileSync(filePath, content, 'utf-8');
  }
}
