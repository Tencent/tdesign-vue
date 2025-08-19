import migrateImport from './components/migrateImport.mjs';
import migrateSingleFile from './components/migrateSingleFile.mjs';
import migrateAnchor from './components/anchor.mjs';
import migrateAutoComplete from './components/auto-complete.mjs';
import migrateCalendar from './components/calendar.mjs';
import migrateCard from './components/card.mjs';
import migrateDropdown from './components/dropdown.mjs';
import migrateTree from './components/tree.mjs';
import migrateTreeSelect from './components/tree-select.mjs';
import migrateHelper from './utils/helper.mjs';
import migrateRenderTNode from './utils/render-tnode.mjs';
import migrateHooks from './hooks/index.mjs';
import migrateUpload from './components/upload.mjs';
import migrateTable from './components/table.mjs';
import migrateTimeline from './components/timeline.mjs';
import migrateSelect from './components/select.mjs';
import migrateRangeInput from './components/range-input.mjs';
import migrateSelectInput from './components/select-input.mjs';
import migrateWatermark from './components/watermark.mjs';

function run() {
  migrateSingleFile();
  migrateImport();
  migrateAnchor();
  migrateAutoComplete();
  migrateCalendar();
  migrateDropdown();
  migrateCard();
  migrateUpload();
  migrateSelect();
  migrateSelectInput();
  migrateTable();
  migrateTimeline();
  migrateTree();
  migrateTreeSelect();
  migrateRangeInput();
  migrateWatermark();

  migrateHelper();
  migrateRenderTNode();

  migrateHooks();
}

run();
