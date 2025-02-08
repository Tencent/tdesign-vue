import {
  computed, defineComponent, toRefs, h,
} from '@vue/composition-api';
import { isFunction } from 'lodash-es';
import { usePrefixClass } from '../hooks/useConfig';
import props from './check-tag-group-props';
import CheckTag from './check-tag';
import useVModel from '../hooks/useVModel';
import {
  CheckTagGroupOption, CheckTagGroupValue, TdCheckTagProps, TdCheckTagGroupProps,
} from './type';

export default defineComponent({
  name: 'TCheckTagGroup',

  props,

  setup(props: TdCheckTagGroupProps, context) {
    const { value } = toRefs(props);
    const componentName = usePrefixClass('check-tag-group');
    const checkTagGroupClasses = computed(() => [componentName.value]);

    const [innerValue, setInnerValue] = useVModel(value, props.defaultValue, props.onChange);

    const onCheckTagChange: TdCheckTagProps['onChange'] = (checked, ctx) => {
      const { value } = ctx;
      if (checked) {
        if (props.multiple) {
          setInnerValue(innerValue.value.concat(value), { e: ctx.e, type: 'check', value });
        } else {
          setInnerValue([value], { e: ctx.e, type: 'check', value });
        }
      } else {
        let newValue: CheckTagGroupValue = [];
        if (props.multiple) {
          newValue = innerValue.value.filter((t) => t !== value);
        }
        setInnerValue(newValue, { e: ctx.e, type: 'uncheck', value });
      }
    };

    const getTagContent = (option: CheckTagGroupOption) => {
      if (context.slots.option) return context.slots.option(option);
      if (context.slots.label) return context.slots.label(option);
      if (option.label) {
        return isFunction(option.label) ? option.label(h) : option.label;
      }
      if (option.content && isFunction(option.content)) return option.content(h);
      if (option.default && isFunction(option.default)) return option.default(h);
      return option.value;
    };

    return {
      innerValue,
      checkTagGroupClasses,
      onCheckTagChange,
      getTagContent,
    };
  },

  render() {
    return (
      <div class={this.checkTagGroupClasses}>
        {(this.options || []).map((option) => (
          <CheckTag
            key={option.value}
            value={option.value}
            checkedProps={this.checkedProps}
            uncheckedProps={this.uncheckedProps}
            checked={this.innerValue.includes(option.value)}
            onChange={this.onCheckTagChange}
            disabled={option.disabled}
            size={option.size}
            data-value={option.value}
          >
            {this.getTagContent(option)}
          </CheckTag>
        ))}
      </div>
    );
  },
});
