import Vue, { VueConstructor, VNode } from 'vue';
import { renderContent } from '../utils/render-tnode';
import props from './props';
import Radio from './radio';
import { RadioGroupInstance } from './instance';

export interface RadioButtonInstance extends Vue {
  radioGroup: RadioGroupInstance;
}

export default (Vue as VueConstructor<RadioButtonInstance>).extend({
  name: 'TRadioButton',
  inheritAttrs: false,
  props: { ...props },

  components: {
    Radio,
  },

  provide() {
    return {
      radioButton: this,
    };
  },

  inject: {
    radioGroup: { default: undefined },
  },

  render(): VNode {
    const { $props, $listeners, radioGroup } = this;

    const radioProps = {
      props: {
        ...$props,
      },
      on: $listeners,
    };

    if (radioGroup) {
      radioProps.props.checked = $props.value === radioGroup.value;
      radioProps.props.disabled = $props.disabled === undefined ? radioGroup.disabled : $props.disabled;
      radioProps.props.name = radioGroup.name;
    }

    return <Radio {...radioProps}>{renderContent(this, 'default', 'label')}</Radio>;
  },
});
