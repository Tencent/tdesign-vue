import glob from 'glob';
import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateImport() {
  glob.sync('src/**/*.{tsx,vue,ts}', { ignore: ['src/_common'] }).forEach((file) => {
    const content = readFileSync(file, 'utf8');
    if (content.includes('@vue/composition-api')) {
      const newContent = content.replaceAll('@vue/composition-api', 'vue');
      writeFileSync(file, newContent, 'utf8');
    }
    console.log(`Processing file: ${file}`);
  });
  glob.sync('site/**/*.vue', { ignore: ['node_modules'] }).forEach((file) => {
    const content = readFileSync(file, 'utf8');
    if (content.includes('@vue/composition-api')) {
      const newContent = content.replaceAll('@vue/composition-api', 'vue');
      writeFileSync(file, newContent, 'utf8');
    }
    console.log(`Processing file: ${file}`);
  });
}
