import { readFileSync, writeFileSync } from 'node:fs';

function migrateHooks() {
  const filePath = 'src/watermark/hooks.ts';
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('export type MaybeElement = HTMLElement | SVGElement')) {
    content = content.replace(
      'export type MaybeElement = HTMLElement | SVGElement',
      'export type MaybeElement = Element | HTMLElement | SVGElement',
    ).replace('UnRefElementReturn<T>', 'any');
    writeFileSync(filePath, content, 'utf8');
  }
}

export default function migrateWatermark() {
  migrateHooks();
}
