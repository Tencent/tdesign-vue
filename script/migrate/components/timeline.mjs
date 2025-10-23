import { readFileSync, writeFileSync } from 'node:fs';

function migrateTimeline() {
  const filePath = 'src/timeline/timeline.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('const instance = getCurrentInstance();')) {
    content = content.replace('const instance = getCurrentInstance();', 'const instance = getCurrentInstance().proxy;');
    content = content.replaceAll('instance.slots', 'instance.$slots');
    writeFileSync(filePath, content, 'utf8');
  }
}

function migrateTimelineItem() {
  const filePath = 'src/timeline/timeline-item.tsx';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('const instance = getCurrentInstance();')) {
    content = content.replace('const instance = getCurrentInstance();', 'const instance = getCurrentInstance().proxy;');
    content = content.replaceAll('instance.parent.slots', 'instance.$parent.$slots');
    writeFileSync(filePath, content, 'utf8');
  }
}

export default function () {
  migrateTimeline();
  migrateTimelineItem();
}
