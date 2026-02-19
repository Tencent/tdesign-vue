import glob from 'glob';
import { readFileSync, writeFileSync } from 'node:fs';

export default function migrateImport() {
  glob.sync('src/**/*.{tsx,vue,ts}', { ignore: ['src/_common'] }).forEach((file) => {
    let content = readFileSync(file, 'utf8');
    let isChange = false;
    if (content.includes('@vue/composition-api')) {
      content = content.replaceAll('@vue/composition-api', 'vue');
      isChange = true;
    }
    if (content.includes("import VueCompositionAPI from 'vue';")) {
      content = content.replaceAll("import VueCompositionAPI from 'vue';", '')
        .replaceAll(', VueCompositionAPI', '');
      isChange = true;
    }
    if (content.includes('// vue27:ts-ignore')) {
      content = content.replaceAll('// vue27:ts-ignore', '// @ts-ignore');
      isChange = true;
    }
    if (isChange) {
      writeFileSync(file, content, 'utf8');
    }
    // console.log(`Processing file: ${file}`);
  });
  glob.sync('site/**/*.vue', { ignore: ['node_modules'] }).forEach((file) => {
    const content = readFileSync(file, 'utf8');
    if (content.includes('@vue/composition-api')) {
      const newContent = content.replaceAll('@vue/composition-api', 'vue');
      writeFileSync(file, newContent, 'utf8');
    }
    // console.log(`Processing file: ${file}`);
  });
}
