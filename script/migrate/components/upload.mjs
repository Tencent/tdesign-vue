import { readFileSync, writeFileSync } from 'node:fs';

function migrateDraggerFile() {
  const filePath = 'src/upload/themes/dragger-file.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('setup(props: DraggerProps)')) {
    content = content.replace('setup(props: DraggerProps)', 'setup(props)');
    writeFileSync(filePath, content, 'utf8');
  }
}
function migrateImageCard() {
  const filePath = 'src/upload/themes/image-card.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('setup(props: ImageCardUploadProps)')) {
    content = content.replace('setup(props: ImageCardUploadProps)', 'setup(props)');
    writeFileSync(filePath, content, 'utf8');
  }
}

function migrateMultipleFlowList() {
  const filePath = 'src/upload/themes/multiple-flow-list.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('setup(props: ImageFlowListProps')) {
    content = content.replace('setup(props: ImageFlowListProps', 'setup(props');
    writeFileSync(filePath, content, 'utf8');
  }
}

function migrateNormalFile() {
  const filePath = 'src/upload/themes/normal-file.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('setup(props: NormalFileProps)')) {
    content = content.replace('setup(props: NormalFileProps)', 'setup(props)');
    writeFileSync(filePath, content, 'utf8');
  }
}
export default function migrateUpload() {
  migrateDraggerFile();
  migrateImageCard();
  migrateMultipleFlowList();
  migrateNormalFile();
}
