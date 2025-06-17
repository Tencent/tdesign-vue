import migrateImport from './components/migrateImport.mjs';
import migrateSingleFile from './components/migrateSingleFile.mjs';
import migrateAnchor from './components/anchor.mjs';
import migrateAutoComplete from './components/auto-complete.mjs';
import migrateCalendar from './components/calendar.mjs';
import migrateCard from './components/card.mjs';
import migrateDropdown from './components/dropdown.mjs';
import migrateTree from './components/tree.mjs';
import migrateHelper from './utils/helper.mjs';
import migrateRenderTNode from './utils/render-tnode.mjs';
import migrateHooks from './hooks/index.mjs';
import migrateUpload from './components/upload.mjs';

function run() {
  migrateSingleFile();
  migrateImport();
  migrateAnchor();
  migrateAutoComplete();
  migrateCalendar();
  migrateDropdown();
  migrateCard();
  migrateUpload();
  migrateTree();

  migrateHelper();
  migrateRenderTNode();

  migrateHooks();
}

run();
