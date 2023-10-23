import {
  defineComponent, computed, toRefs, SetupContext,
} from 'vue';
import props from './check-tag-props';
import { usePrefixClass, useCommonClassName } from '../hooks/useConfig';
import useVModel from '../hooks/useVModel';
import Tag from './tag';
import { TdCheckTagProps, TdTagProps } from './type';
import { ENTER_REG, SPACE_REG } from '../_common/js/common';
import { renderContent } from '../hooks';

export default defineComponent({
  name: 'TCheckTag',

  props,

  model: {
    prop: 'checked',
    event: 'change',
  },

  setup(props: TdCheckTagProps, context: SetupContext) {
    const componentName = usePrefixClass('tag');
    const { SIZE } = useCommonClassName();

    const { checked } = toRefs(props);
    const [innerChecked, setInnerChecked] = useVModel(
      checked,
      props.defaultChecked,
      props.onChange,
      'change',
      'checked',
    );

    const tagClass = computed(() => [
      `${componentName.value}`,
      `${componentName.value}--check`,
      SIZE.value[props.size],
      {
        [`${componentName.value}--checked`]: innerChecked.value,
        [`${componentName.value}--disabled`]: props.disabled,
      },
    ]);

    const checkTagProps = computed(() => {
      const checkedProps: TdTagProps = { theme: 'primary', ...props.checkedProps };
      const uncheckedProps: TdTagProps = { ...props.uncheckedProps };
      return innerChecked.value ? checkedProps : uncheckedProps;
    });

    const handleClick = ({ e }: { e: MouseEvent }) => {
      if (!props.disabled) {
        props.onClick?.({ e });
        context.emit('click', { e });
        setInnerChecked(!innerChecked.value, { e, value: props.value });
      }
    };

    const keyboardEventListener = (e: KeyboardEvent) => {
      const code = e.code || e.key?.trim();
      const isCheckedCode = SPACE_REG.test(code) || ENTER_REG.test(code);
      if (isCheckedCode) {
        e.preventDefault();
        setInnerChecked(!innerChecked.value, { e, value: props.value });
      }
    };

    const onCheckboxFocus = (e: FocusEvent) => {
      e.currentTarget.addEventListener('keydown', keyboardEventListener);
    };

    const onCheckboxBlur = (e: FocusEvent) => {
      e.currentTarget.removeEventListener('keydown', keyboardEventListener);
    };

    return {
      tagClass,
      checkTagProps,
      onCheckboxFocus,
      onCheckboxBlur,
      handleClick,
    };
  },

  render() {
    const tagContent = renderContent(this, 'default', 'content');
    return (
      <Tag
        class={this.tagClass}
        disabled={this.disabled}
        tabindex={this.disabled ? undefined : '0'}
        onFocus={this.onCheckboxFocus}
        onBlur={this.onCheckboxBlur}
        props={this.checkTagProps}
        onClick={this.handleClick}
      >
        {tagContent}
      </Tag>
    );
  },
});
