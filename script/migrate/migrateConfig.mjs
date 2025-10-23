import {
  migratePackageJson, migrateViteConfig, migrateVitestConfig, migrateTsconfig, migrateJsxDts, migrateBabelConfig,
  migrateCssDTs,
} from './config/migrateConfig.mjs';

function run() {
  migratePackageJson();

  migrateViteConfig();
  migrateVitestConfig();
  migrateTsconfig();

  migrateJsxDts();
  migrateCssDTs();
  migrateBabelConfig();
}

run();
