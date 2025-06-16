import {
  migratePackageJson, migrateViteConfig, migrateVitestConfig, migrateTsconfig, migrateJsxDts, migrateBabelConfig,
} from './config/migrateConfig.mjs';

function run() {
  migratePackageJson();

  migrateViteConfig();
  migrateVitestConfig();
  migrateTsconfig();

  migrateJsxDts();

  migrateBabelConfig();
}

run();
