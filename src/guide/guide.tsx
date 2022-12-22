import {
  defineComponent, computed, nextTick, onMounted, ref, toRefs, watch,
} from '@vue/composition-api';

import {
  scrollToParentVisibleArea, getRelativePosition, getTargetElm, scrollToElm,
} from './utils';

import setStyle from '../_common/js/utils/set-style';
import TransferDom from '../utils/transfer-dom';

import {
  addClass, removeClass, isFixed, getWindowScroll,
} from '../utils/dom';

import useDefaultValue from '../hooks/useDefaultValue';
import { useTNodeJSX } from '../hooks/tnode';
import { usePrefixClass, useConfig } from '../hooks/useConfig';
import { GlobalConfigProvider } from '../config-provider/type';
import Button from '../button';
import Popup from '../popup';

import props from './props';
import { TdGuideProps, GuideCrossProps, TdGuideStepProps } from './type';

export default defineComponent({
  name: 'TGuide',
  directives: { TransferDom },
  props: { ...props },
  setup(props) {
    const COMPONENT_NAME = usePrefixClass('guide');
    const LOCK_CLASS = usePrefixClass('guide--lock');
    const { global } = useConfig('guide');
    const { current } = toRefs(props);

    const [innerCurrent, setInnerCurrent] = useDefaultValue(
      current,
      props.defaultCurrent,
      props.onChange,
      'current',
      'change',
    );
    // 覆盖层，用于覆盖所有元素
    const overlayLayerRef = ref<HTMLElement>();
    // 高亮层，用于高亮元素
    const highlightLayerRef = ref<HTMLElement>();
    // 提示层，用于高亮元素
    const referenceLayerRef = ref<HTMLElement>();
    // 当前高亮的元素
    const currentHighlightLayerElm = ref<HTMLElement>();
    // dialog wrapper ref
    const dialogWrapperRef = ref<HTMLElement>();
    // dialog ref
    const dialogTooltipRef = ref<HTMLElement>();
    // 是否开始展示
    const activated = ref<boolean>(false);
    // 步骤总数
    const stepsTotal = computed(() => props.steps.length);
    // 当前步骤的信息
    const currentStepInfo = computed(() => props.steps?.[innerCurrent.value]);
    // 当前是否为 popup
    const isPopup = computed(() => getCurrentCrossProps('mode') === 'popup');
    // 当前元素位置状态
    const currentElmIsFixed = computed(() => isFixed(currentHighlightLayerElm.value || document.body));
    // 获取当前步骤的属性值 用户当前步骤设置 > 用户组件设置的
    const getCurrentCrossProps = <Key extends keyof GuideCrossProps>(propsName: Key) => currentStepInfo.value[propsName] ?? props[propsName];

    // 设置高亮层的位置
    const setHighlightLayerPosition = (highlighLayer: HTMLElement) => {
      let { top, left } = getRelativePosition(currentHighlightLayerElm.value);
      let { width, height } = currentHighlightLayerElm.value.getBoundingClientRect();
      const highlightPadding = getCurrentCrossProps('highlightPadding');

      if (isPopup.value) {
        width += highlightPadding * 2;
        height += highlightPadding * 2;
        top -= highlightPadding;
        left -= highlightPadding;
      } else {
        const { scrollTop, scrollLeft } = getWindowScroll();
        top += scrollTop;
        left += scrollLeft;
      }
      setStyle(highlighLayer, {
        width: `${width}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`,
      });
    };

    const showPopupGuide = () => {
      nextTick(() => {
        currentHighlightLayerElm.value = getTargetElm(currentStepInfo.value.element);
        scrollToParentVisibleArea(currentHighlightLayerElm.value);
        setHighlightLayerPosition(highlightLayerRef.value);
        setHighlightLayerPosition(referenceLayerRef.value);
        scrollToElm(currentHighlightLayerElm.value);
      });
    };

    const destroyTooltipElm = () => {
      referenceLayerRef.value?.parentNode.removeChild(referenceLayerRef.value);
    };

    const showDialogGuide = () => {
      nextTick(() => {
        currentHighlightLayerElm.value = dialogTooltipRef.value;
        scrollToParentVisibleArea(currentHighlightLayerElm.value);
        setHighlightLayerPosition(highlightLayerRef.value);
        scrollToElm(currentHighlightLayerElm.value);
      });
    };

    const destroyDialogTooltipElm = () => {
      dialogTooltipRef.value?.parentNode.removeChild(dialogTooltipRef.value);
      dialogWrapperRef.value?.parentNode.removeChild(dialogWrapperRef.value);
    };

    const showGuide = () => {
      if (isPopup.value) {
        destroyDialogTooltipElm();
        showPopupGuide();
      } else {
        destroyTooltipElm();
        showDialogGuide();
      }
    };

    const destroyGuide = () => {
      destroyTooltipElm();
      destroyDialogTooltipElm();
      highlightLayerRef.value?.parentNode.removeChild(highlightLayerRef.value);
      overlayLayerRef.value?.parentNode.removeChild(overlayLayerRef.value);
      removeClass(document.body, LOCK_CLASS.value);
    };

    const handleSkip = (e: MouseEvent) => {
      const total = stepsTotal.value;
      activated.value = false;
      setInnerCurrent(-1, { e, total });
      props.onSkip?.({ e, current: innerCurrent.value, total });
    };

    const handlePrev = (e: MouseEvent) => {
      const total = stepsTotal.value;
      setInnerCurrent(innerCurrent.value - 1, { e, total });
      props.onPrevStepClick?.({
        e,
        prev: innerCurrent.value - 1,
        current: innerCurrent.value,
        total,
      });
    };

    const handleNext = (e: MouseEvent) => {
      const total = stepsTotal.value;
      setInnerCurrent(innerCurrent.value + 1, { e, total });
      props.onNextStepClick?.({
        e,
        next: innerCurrent.value + 1,
        current: innerCurrent.value,
        total,
      });
    };

    const handleFinish = (e: MouseEvent) => {
      const total = stepsTotal.value;
      activated.value = false;
      setInnerCurrent(-1, { e, total });
      props.onFinish?.({ e, current: innerCurrent.value, total });
    };

    const initGuide = () => {
      if (innerCurrent.value >= 0 && innerCurrent.value < props.steps?.length) {
        if (!activated.value) {
          activated.value = true;
          addClass(document.body, LOCK_CLASS.value);
        }
        showGuide();
      }
    };

    watch(innerCurrent, (val) => {
      if (val >= 0 && val < props.steps?.length) {
        initGuide();
      } else {
        activated.value = false;
        destroyGuide();
      }
    });

    onMounted(() => {
      initGuide();
    });

    return {
      componentName: COMPONENT_NAME,
      innerCurrent,
      isPopup,
      currentElmIsFixed,
      currentStepInfo,
      stepsTotal,
      handlePrev,
      handleNext,
      handleSkip,
      handleFinish,
      getCurrentCrossProps,
      global,
      highlightLayerRef,
      overlayLayerRef,
      referenceLayerRef,
      currentHighlightLayerElm,
      dialogWrapperRef,
      dialogTooltipRef,
      activated,
    };
  },
  render() {
    // TODO directives导致return的类型都丢失
    const { stepsTotal } = this;
    const currentStepInfo = this.currentStepInfo as TdGuideStepProps;
    const globalConfig = this.global as GlobalConfigProvider['guide'];
    const getCurrentCrossProps = this.getCurrentCrossProps as Function;
    const renderOverlayLayer = () => (
      <div
        ref="overlayLayerRef"
        v-transfer-dom="body"
        class={`${this.componentName}__overlay`}
        style={{ zIndex: this.zIndex - 2 }}
      />
    );

    const renderAction = (mode: TdGuideProps['mode']) => {
      const isLast = this.innerCurrent === (stepsTotal as number) - 1;
      const isFirst = this.innerCurrent === 0;
      const buttonSize = mode === 'popup' ? 'small' : 'medium';

      return (
        <div class={`${this.componentName}__action`}>
          {!this.hideSkip && !isLast && (
            <Button
              {...{
                props: {
                  class: `${this.componentName}__skip`,
                  theme: 'default',
                  size: buttonSize,
                  variant: 'base',
                  onClick: this.handleSkip,
                  ...(getCurrentCrossProps('skipButtonProps') ?? globalConfig.skipButtonProps),
                },
              }}
            />
          )}
          {!this.hidePrev && !isFirst && (
            <Button
              {...{
                props: {
                  class: `${this.componentName}__prev`,
                  theme: 'primary',
                  size: buttonSize,
                  variant: 'base',
                  onClick: this.handlePrev,
                  ...(getCurrentCrossProps('prevButtonProps') ?? globalConfig.prevButtonProps),
                },
              }}
            />
          )}
          {!isLast && (
            <Button
              {...{
                props: {
                  class: `${this.componentName}__next`,
                  theme: 'primary',
                  size: buttonSize,
                  variant: 'base',
                  onClick: this.handleNext,
                  ...(getCurrentCrossProps('nextButtonProps') ?? globalConfig.nextButtonProps),
                },
              }}
            />
          )}
          {isLast && (
            <Button
              {...{
                props: {
                  class: `${this.componentName}__finish`,
                  theme: 'primary',
                  size: buttonSize,
                  variant: 'base',
                  onClick: this.handleFinish,
                  ...((this.finishButtonProps as object) ?? globalConfig.finishButtonProps),
                },
              }}
            />
          )}
        </div>
      );
    };

    const renderTooltipTitle = () => {
      const title = <div class={`${this.componentName}__title`}>{currentStepInfo.title}</div>;

      return title;
    };

    const renderTooltipDesc = () => {
      const { body: descBody } = currentStepInfo;
      const desc = (
        <div class={`${this.componentName}__desc`}>{typeof descBody === 'string' ? descBody : <descBody />}</div>
      );

      return desc;
    };

    const renderPopupContent = () => {
      const footerClasses = [`${this.componentName}__footer`, `${this.componentName}__footer--popup`];
      const action = (
        <div class={footerClasses}>
          {renderCounter()}
          {renderAction('popup')}
        </div>
      );

      return (
        <div class={`${this.componentName}__tooltip`}>
          {renderTooltipTitle()}
          {renderTooltipDesc()}
          {action}
        </div>
      );
    };

    const renderHighlightLayer = () => {
      const style = { zIndex: this.zIndex - 1 };
      const highlightClass = [
        `${this.componentName}__highlight`,
        `${this.componentName}__highlight--${this.isPopup ? 'popup' : 'dialog'}`,
        `${this.componentName}--${this.currentElmIsFixed && this.isPopup ? 'fixed' : 'absolute'}`,
      ];
      const showOverlay = getCurrentCrossProps('showOverlay');
      const maskClass = [`${this.componentName}__highlight--${showOverlay ? 'mask' : 'nomask'}`];
      const { highlightContent } = currentStepInfo;
      const showHighlightContent = highlightContent && this.isPopup;

      return (
        <div
          ref="highlightLayerRef"
          v-transfer-dom="body"
          class={highlightClass.concat(showHighlightContent ? highlightClass : maskClass)}
          style={style}
        >
          {showHighlightContent && <highlightContent class={highlightClass.concat(maskClass)} style={style} />}
        </div>
      );
    };
    const renderCounter = () => {
      const renderTNodeJSX = useTNodeJSX();

      const popupSlotCounter = renderTNodeJSX('counter', {
        params: { total: this.stepsTotal, current: this.innerCurrent },
      });

      const popupDefaultCounter = (
        <div class={`${this.componentName}__counter`}>
          {popupSlotCounter || (
            <span>
              {(this.innerCurrent as number) + 1}/{this.stepsTotal}
            </span>
          )}
        </div>
      );
      return !this.hideCounter ? popupDefaultCounter : null;
    };
    const renderDialogGuide = () => {
      const style = { zIndex: this.zIndex };
      const wrapperClasses = [
        `${this.componentName}__wrapper`,
        { [`${this.componentName}__wrapper--center`]: currentStepInfo.placement === 'center' },
      ];
      const dialogClasses = [
        `${this.componentName}__reference`,
        `${this.componentName}--absolute`,
        `${this.componentName}__dialog`,
        {
          [`${this.componentName}__dialog--nomask`]: !getCurrentCrossProps('showOverlay'),
          [currentStepInfo.stepOverlayClass]: !!currentStepInfo.stepOverlayClass,
        },
      ];
      const footerClasses = [`${this.componentName}__footer`, `${this.componentName}__footer--popup`];
      return (
        <div>
          <div ref="dialogWrapperRef" v-transfer-dom="body" class={wrapperClasses} style={style}>
            <div ref="dialogTooltipRef" class={dialogClasses}>
              {renderTooltipTitle()}
              {renderTooltipDesc()}
              <div class={footerClasses}>
                {renderCounter()}
                {renderAction('dialog')}
              </div>
            </div>
          </div>
        </div>
      );
    };
    const renderPopupGuide = () => {
      const { content } = currentStepInfo;
      let renderBody: JSX.Element;
      if (content) {
        const contentProps = {
          handlePrev: this.handlePrev,
          handleNext: this.handleNext,
          handleSkip: this.handleSkip,
          handleFinish: this.handleFinish,
          current: this.innerCurrent,
          total: this.stepsTotal,
        };
        renderBody = <content {...{ props: { ...contentProps } }} />;
      } else {
        renderBody = renderPopupContent();
      }

      const classes = [
        `${this.componentName}__reference`,
        `${this.componentName}--${this.currentElmIsFixed ? 'fixed' : 'absolute'}`,
      ];
      return (
        <Popup
          visible={true}
          show-arrow={!content}
          content={() => renderBody}
          zIndex={this.zIndex}
          overlayClassName={currentStepInfo?.stepOverlayClass}
          overlayInnerClassName={{ [`${this.componentName}__popup--content`]: !!content }}
          placement={currentStepInfo.placement}
        >
          <div ref="referenceLayerRef" v-transfer-dom="body" class={classes} />
        </Popup>
      );
    };

    return this.activated ? (
      <div>
        {renderOverlayLayer()}
        {renderHighlightLayer()}
        {this.isPopup ? renderPopupGuide() : renderDialogGuide()}
      </div>
    ) : null;
  },
});
