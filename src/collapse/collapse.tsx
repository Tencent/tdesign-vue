import {
  defineComponent, toRefs, provide, computed,
} from '@vue/composition-api';
import props from './props';
import { CollapseValue, TdCollapseProps, CollapsePanelValue } from './type';
import useVModel from '../hooks/useVModel';
import { useTNodeJSX } from '../hooks/tnode';
import { usePrefixClass } from '../config-provider';

export default defineComponent({
  name: 'TCollapse',
  props,
  setup(props: TdCollapseProps) {
    const componentName = usePrefixClass('collapse');
    const borderlessClass = usePrefixClass('-border-less');
    const { value, expandMutex, borderless } = toRefs(props);
    const [collapseValue, setCollapseValue] = useVModel(value, props.defaultValue, props.onChange, 'change');
    const updateCollapseValue = (value: CollapsePanelValue) => {
      let newValue: CollapseValue = [].concat(collapseValue.value || []);
      const index = newValue.indexOf(value);
      if (index >= 0) {
        newValue.splice(index, 1);
      } else if (expandMutex.value) {
        newValue = [value];
      } else {
        newValue.push(value);
      }
      setCollapseValue(newValue);
    };
    const classes = computed(() => [
      componentName.value,
      {
        [borderlessClass.value]: !!borderless.value,
      },
    ]);
    const getUniqId = (() => {
      let index = 0;
      return () => (index += 1);
    })();
    provide('collapseValue', collapseValue);
    provide('updateCollapseValue', updateCollapseValue);
    provide('collapseProps', toRefs(props));
    provide('getUniqId', getUniqId);
    return {
      classes,
    };
  },
  render() {
    const renderTNodeJSX = useTNodeJSX();
    const nodes = renderTNodeJSX('default');
    return <div class={this.classes}>{nodes}</div>;
  },
});
