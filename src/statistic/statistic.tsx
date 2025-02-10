import {
  defineComponent, computed, ref, onMounted, watch, toRefs,
} from 'vue';
import {
  ArrowTriangleDownFilledIcon as TDArrowTriangleDownFilledIcon,
  ArrowTriangleUpFilledIcon as TDArrowTriangleUpFilledIcon,
} from 'tdesign-icons-vue';
import { isFunction, isNumber } from 'lodash-es';
import props from './props';
import { renderTNodeJSX } from '../utils/render-tnode';
import { usePrefixClass } from '../hooks/useConfig';
import { useGlobalIcon } from '../hooks/useGlobalIcon';

import Skeleton from '../skeleton';
import Tween from '../_common/js/statistic/tween';
import { COLOR_MAP } from '../_common/js/statistic/utils';

export default defineComponent({
  name: 'Statistic',

  props,

  setup(props) {
    const classPrefix = usePrefixClass('statistic');
    const {
      value, decimalPlaces, separator, color,
    } = toRefs(props);

    const innerValue = ref(props.animation?.valueFrom ?? props.value);
    const tween = ref(null);

    const numberValue = computed(() => (isNumber(props.value) ? props.value : 0));
    const valueStyle = computed(() => ({ color: COLOR_MAP[color.value] || color.value }));
    const innerDecimalPlaces = computed(
      () => decimalPlaces.value ?? numberValue.value.toString().split('.')[1]?.length ?? 0,
    );

    const start = (from: number = props.animation?.valueFrom ?? 0, to: number = numberValue.value) => {
      if (from !== to) {
        tween.value = new Tween({
          from: {
            value: from,
          },
          to: {
            value: to,
          },
          duration: props.animation.duration,
          onUpdate: (keys) => {
            innerValue.value = Number(keys.value.toFixed(innerDecimalPlaces.value));
          },
          onFinish: () => {
            innerValue.value = to;
          },
        });
        (tween.value as any)?.start();
      }
    };

    const formatValue = computed(() => {
      let _value: number | undefined | string = innerValue.value;

      if (isFunction(props.format)) {
        return props.format(_value);
      }
      const options = {
        minimumFractionDigits: decimalPlaces.value || 0,
        maximumFractionDigits: decimalPlaces.value || 20,
        useGrouping: !!separator,
      };
      // replace的替换的方案仅能应对大部分地区
      _value = _value.toLocaleString(undefined, options).replace(/,|，/g, separator.value);

      return _value;
    });

    onMounted(() => props.animation && props.animationStart && start());

    watch(
      () => props.animationStart,
      (value) => {
        if (props.animation && value && !tween.value) {
          start();
        }
      },
    );
    watch(value, (value) => {
      if (tween.value) {
        (tween.value as any)?.stop();
        tween.value = null;
      }
      innerValue.value = value;
      if (props.animationStart && props.animation) {
        start();
      }
    });
    return {
      start,
      classPrefix,
      formatValue,
      valueStyle,
    };
  },
  render() {
    const {
      classPrefix, formatValue, valueStyle, loading, trendPlacement, trend,
    } = this;
    const { ArrowTriangleUpFilledIcon } = useGlobalIcon({ ArrowTriangleUpFilledIcon: TDArrowTriangleUpFilledIcon });
    const { ArrowTriangleDownFilledIcon } = useGlobalIcon({
      ArrowTriangleDownFilledIcon: TDArrowTriangleDownFilledIcon,
    });

    const trendIcons = {
      increase: <ArrowTriangleUpFilledIcon />,
      decrease: <ArrowTriangleDownFilledIcon />,
    };
    const trendIcon = trend ? trendIcons[trend] : null;

    const prefix = renderTNodeJSX(this, 'prefix') || (trendIcon && trendPlacement !== 'right' ? trendIcon : null);
    const suffix = renderTNodeJSX(this, 'suffix') || (trendIcon && trendPlacement === 'right' ? trendIcon : null);
    const title = renderTNodeJSX(this, 'title');
    const unit = renderTNodeJSX(this, 'unit');
    const extra = renderTNodeJSX(this, 'extra');

    return (
      <div class={classPrefix}>
        {title && <div class={`${classPrefix}-title`}>{title}</div>}
        <Skeleton animation="gradient" theme="text" loading={!!loading}>
          <div class={`${classPrefix}-content`} style={valueStyle}>
            {prefix && <span class={`${classPrefix}-content-prefix`}>{prefix}</span>}
            <span class={`${classPrefix}-content-value`}>{formatValue}</span>
            {unit && <span class={`${classPrefix}-content-unit`}>{unit}</span>}
            {suffix && <span class={`${classPrefix}-content-suffix`}>{suffix}</span>}
          </div>
        </Skeleton>
        {extra && <div class={`${classPrefix}-extra`}>{extra}</div>}
      </div>
    );
  },
});
