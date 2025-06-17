import { readFileSync, writeFileSync } from 'node:fs';

function migrateThead() {
  const filePath = 'src/table/thead.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('setup(props: TheadProps')) {
    content = content.replace('setup(props: TheadProps', 'setup(props');
    writeFileSync(filePath, content, 'utf8');
  }
}
function migrateTbody() {
  const filePath = 'src/table/tbody.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('setup(props: TableBodyProps')) {
    content = content.replace('setup(props: TableBodyProps', 'setup(props');
    writeFileSync(filePath, content, 'utf8');
  }
}
function migrateTfoot() {
  const filePath = 'src/table/tfoot.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('setup(props: TFootProps')) {
    content = content.replace('setup(props: TFootProps', 'setup(props');
    writeFileSync(filePath, content, 'utf8');
  }
}
function migrateTr() {
  const filePath = 'src/table/tr.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('setup(props: TrProps')) {
    content = content.replace('setup(props: TrProps', 'setup(props');
    writeFileSync(filePath, content, 'utf8');
  }
}
export default function migrateTable() {
  migrateThead();
  migrateTbody();
  migrateTfoot();
  migrateTr();
}
