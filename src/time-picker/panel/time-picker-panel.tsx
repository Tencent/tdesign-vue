import {
  defineComponent, computed, ref, onMounted, nextTick, watch,
} from '@vue/composition-api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { DEFAULT_STEPS, DEFAULT_FORMAT } from '../../_common/js/time-picker/const';
import { panelProps } from './props';
import SinglePanel from './single-panel';
import TButton from '../../button/button';
import { useConfig, usePrefixClass } from '../../hooks/useConfig';

dayjs.extend(customParseFormat);

export default defineComponent({
  name: 'TimePickerPanel',
  props: {
    ...panelProps(),
    handleConfirmClick: Function,
    onChange: Function,
    disableTime: Function,
  },
  setup(props, ctx) {
    const panelClassName = usePrefixClass('time-picker__panel');
    const triggerScroll = ref(false);
    const { global } = useConfig('timePicker');
    const showNowTimeBtn = computed(() => !!props.steps.filter((v) => v > 1).length);

    const defaultValue = computed(() => {
      const isStepsSet = showNowTimeBtn.value;
      if (props.value) {
        return dayjs(props.value, props.format);
      }
      if (isStepsSet) {
        return dayjs().hour(0).minute(0).second(0);
      }
      return dayjs();
    });

    const panelColUpdate = () => {
      nextTick(() => {
        triggerScroll.value = true;
      });
    };

    const resetTriggerScroll = () => {
      triggerScroll.value = false;
    };

    const handleChange = (v: string) => {
      props.onChange?.(v);
      ctx.emit('change', v);
    };
    // 渲染后执行update 使面板滚动至当前时间位置
    onMounted(() => {
      panelColUpdate();
    });

    watch(
      () => props.isShowPanel,
      () => {
        panelColUpdate();
      },
    );

    return {
      showNowTimeBtn,
      panelClassName,
      triggerScroll,
      resetTriggerScroll,
      defaultValue,
      global,
      handleChange,
    };
  },

  render() {
    return (
      <div class={this.panelClassName}>
        <div class={`${this.panelClassName}-section-body`}>
          <SinglePanel
            {...{
              props: {
                value: this.value,
                onChange: this.handleChange,
                format: this.format || DEFAULT_FORMAT,
                steps: this.steps || DEFAULT_STEPS,
                triggerScroll: this.triggerScroll,
                disableTime: this.disableTime,
                resetTriggerScroll: this.resetTriggerScroll,
              },
            }}
          />
        </div>
        {this.isFooterDisplay ? (
          <div class={`${this.panelClassName}-section-footer`}>
            <TButton
              theme="primary"
              variant="base"
              onClick={() => this.handleConfirmClick(this.defaultValue)}
              size="small"
            >
              {this.global.confirm}
            </TButton>
            {!this.showNowTimeBtn ? (
              <TButton
                theme="primary"
                variant="text"
                size="small"
                onClick={() => this.onChange(dayjs().format(this.format))}
              >
                {this.global.now}
              </TButton>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
});
