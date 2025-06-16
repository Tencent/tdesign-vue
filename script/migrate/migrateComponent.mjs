import migrateImport from './components/migrateImport.mjs';
import migrateSingleFile from './components/migrateSingleFile.mjs';

function run() {
  migrateSingleFile();
  migrateImport();
}

run();
