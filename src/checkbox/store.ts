import { CheckboxGroupValue } from './type';

export interface CheckboxStoreData {
  checked: CheckboxGroupValue;
}

type ObserverMap = {
  [key: string]: (val: any) => void;
}

export interface UpdateCheckedData {
  checked: CheckboxStoreData['checked'],
  oldChecked: CheckboxStoreData['checked'],
  isCheckAll: boolean,
}

export interface UpdateDisabledData {
  disabled: boolean;
  maxExceeded: boolean;
}

export type ObserverListenerParams = {
  type: 'checked' | 'disabled';
  parentIsCheckAll: boolean;
  parentChecked: CheckboxStoreData['checked'];
  parentMaxExceeded: boolean;
  parentDisabled: boolean;
}

class CheckboxStore {
  observerMap: ObserverMap = {};
  checked: CheckboxStoreData['checked'];
  isCheckAll: boolean;

  updateChecked({ checked, isCheckAll, oldChecked }: UpdateCheckedData) {
    this.checked = checked;
    this.isCheckAll = isCheckAll;
    const changedChecked = this.getChangedChecked(checked, oldChecked);
    changedChecked.forEach((value) => {
      this.observerMap[value]?.({
        parentChecked: checked,
        parentIsCheckAll: isCheckAll,
        type: 'checked',
      });
    });
  }

  updateDisabled({ disabled, maxExceeded }: UpdateDisabledData) {
    const checkboxList = Object.keys(this.observerMap);
    checkboxList.forEach((checkbox) => {
      this.observerMap[checkbox]?.({
        type: 'disabled',
        parentDisabled: disabled,
        parentMaxExceeded: maxExceeded,
      });
    });
  }

  subscribe(value: string | number, listener: (val: any) => void) {
    this.observerMap[value] = listener;
  }

  getChangedChecked(
    checked: CheckboxStoreData['checked'] = [],
    oldChecked: CheckboxStoreData['checked'] = [],
  ): CheckboxStoreData['checked'] {
    // Map can recognize number and string number. '2' and 2.etc.
    const checkedMap: Map<string | number, boolean> = new Map;
    const oldCheckedMap: Map<string | number, boolean> = new Map;
    const changedValues: CheckboxStoreData['checked'] = [];
    for (let i = 0, len = checked.length; i < len; i++) {
      checkedMap.set(checked[i], true);
    }
    for (let i = 0, len = oldChecked.length; i < len; i++) {
      oldCheckedMap.set(oldChecked[i], true);
    }
    for (let i = 0, len = checked.length; i < len; i++) {
      if (!oldCheckedMap.get(checked[i])) {
        changedValues.push(checked[i]);
      }
    }
    for (let i = 0, len = oldChecked.length; i < len; i++) {
      if (!checkedMap.get(oldChecked[i])) {
        changedValues.push(oldChecked[i]);
      }
    }
    return changedValues;
  }
}

const checkboxStore = (() => new CheckboxStore)();

export default checkboxStore;
