import {
  migratePackageJson, migrateViteConfig, migrateVitestConfig, migrateTsconfig, migrateJsxDts, migrateBabelConfig,
} from './migrateConfig.mjs';
import migrateImport from './migrateImport.mjs';
import migrateSingleFile from './migrateSingleFile.mjs';

function run() {
  migratePackageJson();

  migrateViteConfig();
  migrateVitestConfig();
  migrateTsconfig();

  migrateJsxDts();

  migrateBabelConfig();

  migrateSingleFile();
  migrateImport();
}

run();
