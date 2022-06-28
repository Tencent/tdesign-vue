import { defineComponent } from '@vue/composition-api';
import { ChevronLeftIcon, RoundIcon, ChevronRightIcon } from 'tdesign-icons-vue';
import props from './jumper-props';
import { usePrefixClass } from '../hooks/useConfig';
import TButton from '../button';

export default defineComponent({
  name: 'TJumper',

  props,

  setup() {
    const COMPONENT_NAME = usePrefixClass('jumper');

    return { COMPONENT_NAME };
  },

  render() {
    const { COMPONENT_NAME } = this;

    return (
      <div class={`${COMPONENT_NAME}-jumper`}>
        <TButton
          title={this.prevTitle}
          variant="text"
          size={this.size}
          shape="square"
          onClick={() => this.onJumperClick?.(-1)}
          icon={() => <ChevronLeftIcon />}
          class={`${COMPONENT_NAME}-jumper__btn`}
        />

        <TButton
          title={this.currentTitle}
          variant="text"
          size={this.size}
          shape="square"
          onClick={() => this.onJumperClick?.(0)}
          icon={() => <RoundIcon />}
          class={`${COMPONENT_NAME}-jumper__btn`}
        />

        <TButton
          title={this.nextTitle}
          variant="text"
          size={this.size}
          shape="square"
          onClick={() => this.onJumperClick?.(1)}
          icon={() => <ChevronRightIcon />}
          class={`${COMPONENT_NAME}-jumper__btn`}
        />
      </div>
    );
  },
});
