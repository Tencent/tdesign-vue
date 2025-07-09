import migrateTNode from './tnode.mjs';
import migrateUseDefaultValue from './useDefaultValue.mjs';
import migrateUseFormDisabled from './useFormDisabled.mjs';
import migrateUseVModel from './useVModel.mjs';

export default function migrateHooks() {
  migrateTNode();
  migrateUseDefaultValue();
  migrateUseFormDisabled();
  migrateUseVModel();
}
