import {
  defineComponent, computed, toRefs, ref,
} from '@vue/composition-api';
import { StarFilledIcon } from 'tdesign-icons-vue';
import useVModel from '../hooks/useVModel';
import props from './props';
import { useConfig } from '../hooks/useConfig';
import Tooltip from '../tooltip/index';
import { renderTNodeJSXDefault } from '../utils/render-tnode';

export default defineComponent({
  name: 'TRate',

  props: { ...props },

  setup(props) {
    const activeColor = Array.isArray(props.color) ? props.color[0] : props.color;
    const defaultColor = Array.isArray(props.color) ? props.color[1] : 'var(--td-bg-color-component)';

    const { value: inputValue } = toRefs(props);
    const [starValue, setStarValue] = useVModel(inputValue, props.defaultValue, props.onChange, 'change');

    const hoverValue = ref(undefined);
    const rootRef = ref<HTMLTableElement>();
    const { classPrefix } = useConfig('classPrefix');

    const displayValue = computed(() => Number(hoverValue.value || starValue.value));
    const displayText = computed(() => props.texts.length === 0 ? ['极差', '失望', '一般', '满意', '惊喜'] : props.texts);

    const getStarValue = (event: MouseEvent, index: number) => {
      if (props.allowHalf) {
        const { left } = rootRef.value?.getBoundingClientRect?.();
        const firstStar = rootRef.value.firstChild.nextSibling as HTMLElement;
        const { width } = firstStar?.getBoundingClientRect?.();
        const { clientX } = event;
        const starMiddle = width * (index - 0.5) + props.gap * (index - 1);

        if (clientX - left >= starMiddle) return index;
        if (clientX - left < starMiddle) return index - 0.5;
      }

      return index;
    };

    const mouseEnterHandler = (event: MouseEvent, index: number) => {
      if (props.disabled) return;
      hoverValue.value = getStarValue(event, index);
    };

    const mouseLeaveHandler = () => {
      if (props.disabled) return;
      hoverValue.value = undefined;
    };

    const clickHandler = (event: MouseEvent, index: number) => {
      if (props.disabled) return;
      setStarValue(getStarValue(event, index));
    };

    const getStarCls = (index: number) => {
      if (props.allowHalf && index + 0.5 === displayValue.value) return `${classPrefix.value}-rate__item--half`;
      if (index >= displayValue.value) return '';
      if (index < displayValue.value) return `${classPrefix.value}-rate__item--full`;
    };

    const activeIconStyle = computed(() => ({
      fontSize: props.size,
      color: activeColor,
    }));

    const inactiveIconStyle = computed(() => ({
      fontSize: props.size,
      color: defaultColor,
    }));
    return {
      classPrefix,
      mouseLeaveHandler,
      getStarCls,
      clickHandler,
      mouseEnterHandler,
      activeColor,
      defaultColor,
      displayText,
      displayValue,
      rootRef,
      activeIconStyle,
      inactiveIconStyle,
    };
  },
  methods: {
    renderRateIcon() {
      return renderTNodeJSXDefault(this, 'icon', <StarFilledIcon />);
    },
  },
  render() {
    const {
      classPrefix, mouseLeaveHandler, getStarCls, clickHandler, mouseEnterHandler, displayText, displayValue,
    } = this;

    return (
      <div class={`${classPrefix}-rate`} onMouseleave={mouseLeaveHandler}>
        <ul class={`${classPrefix}-rate__list`} style={{ gap: `${this.gap}px` }} ref="rootRef">
          {[...Array(Number(this.count))].map((_, index) => (
            <li
              key={index}
              class={[`${classPrefix}-rate__item`, getStarCls(index)]}
              onClick={(event: MouseEvent) => clickHandler(event, index + 1)}
              onMousemove={(event: MouseEvent) => mouseEnterHandler(event, index + 1)}
            >
              {this.showText ? (
                <Tooltip key={index} content={displayText[displayValue - 1]}>
                  <div class={`${classPrefix}-rate__star-top`} style={{ ...this.activeIconStyle }}>
                    {this.renderRateIcon()}
                  </div>
                  <div
                    class={`${classPrefix}-rate__star-bottom`}
                    style={{
                      ...this.inactiveIconStyle,
                    }}
                  >
                    {this.renderRateIcon()}
                  </div>
                </Tooltip>
              ) : (
                <div>
                  <div
                    class={`${classPrefix}-rate__star-top`}
                    style={{
                      ...this.activeIconStyle,
                    }}
                  >
                    {this.renderRateIcon()}
                  </div>
                  <div
                    class={`${classPrefix}-rate__star-bottom`}
                    style={{
                      ...this.inactiveIconStyle,
                    }}
                  >
                    {this.renderRateIcon()}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        {this.showText && <div class={`${classPrefix}-rate__text`}>{displayText[displayValue - 1]}</div>}
      </div>
    );
  },
});
