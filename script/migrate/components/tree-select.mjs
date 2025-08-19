import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateTreeSelect() {
  let content = readFileSync('src/tree-select/tree-select.tsx', 'utf8');
  if (content.includes('...this.treeProps')) {
    content = content.replace('...this.treeProps', '...(this.treeProps as TreeProps)').replace("import Tree from '../tree';", "import Tree, { TreeProps } from '../tree';");
  }
  if (content.includes('...this.selectInputProps')) {
    content = content.replace('...this.selectInputProps', '...(this.selectInputProps as SelectInputProps)').replace("import SelectInput from '../select-input';", "import SelectInput, { SelectInputProps } from '../select-input';");
  }
  writeFileSync('src/tree-select/tree-select.tsx', content, 'utf8');
}
