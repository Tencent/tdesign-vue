import {
  defineComponent, computed, nextTick, onMounted, ref, toRefs, watch,
} from '@vue/composition-api';
import isFunction from 'lodash/isFunction';
import { CreateElement } from 'vue';
import {
  scrollToParentVisibleArea, getRelativePosition, getTargetElm, scrollToElm,
} from './utils';
import setStyle from '../_common/js/utils/set-style';
import TransferDom from '../utils/transfer-dom';
import {
  addClass, removeClass, isFixed, getWindowScroll,
} from '../utils/dom';
import useDefaultValue from '../hooks/useDefaultValue';
import { usePrefixClass, useConfig, useCommonClassName } from '../hooks/useConfig';
import { GlobalConfigProvider } from '../config-provider/type';
import Button from '../button';
import Popup, { PopupProps } from '../popup';
import props from './props';
import { TdGuideProps, GuideStep } from './type';
import { GuideCrossProps } from './interface';
import { renderTNodeJSX } from '../utils/render-tnode';

export default defineComponent({
  name: 'TGuide',
  directives: { TransferDom },
  props: { ...props },
  setup(props, context) {
    const COMPONENT_NAME = usePrefixClass('guide');
    const LOCK_CLASS = usePrefixClass('guide--lock');
    const { global } = useConfig('guide');
    const { current } = toRefs(props);
    const { classPrefix } = useCommonClassName();

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
    const currentStepInfo = computed<GuideStep>(() => props.steps?.[innerCurrent.value]);
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
        if (!currentHighlightLayerElm.value) return;
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
      const eventParams = { e, current: innerCurrent.value, total };
      props.onSkip?.(eventParams);
      context.emit('skip', eventParams);
    };

    const handlePrev = (e: MouseEvent) => {
      const total = stepsTotal.value;
      setInnerCurrent(innerCurrent.value - 1, { e, total });
      const eventParams = {
        e,
        prev: innerCurrent.value - 1,
        current: innerCurrent.value,
        total,
      };
      props.onPrevStepClick?.(eventParams);
      context.emit('prev-step-click', eventParams);
    };

    const handleNext = (e: MouseEvent) => {
      const total = stepsTotal.value;
      setInnerCurrent(innerCurrent.value + 1, { e, total });
      const eventParams = {
        e,
        next: innerCurrent.value + 1,
        current: innerCurrent.value,
        total,
      };
      props.onNextStepClick?.(eventParams);
      context.emit('next-step-click', eventParams);
    };

    const handleFinish = (e: MouseEvent) => {
      const total = stepsTotal.value;
      activated.value = false;
      setInnerCurrent(-1, { e, total });
      props.onFinish?.({ e, current: innerCurrent.value, total });
      context.emit('finish', { e, current: innerCurrent.value, total });
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
      classPrefix,
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

  render(h) {
    // TODO directives导致return的类型都丢失
    const { stepsTotal } = this;
    const currentStepInfo = this.currentStepInfo as GuideStep;
    const globalConfig = this.global as GlobalConfigProvider['guide'];
    const getCurrentCrossProps = this.getCurrentCrossProps as Function;
    const renderTooltipTitle = (h: CreateElement) => {
      const currentStepInfo = this.currentStepInfo as GuideStep;
      const functionTitle = isFunction(currentStepInfo.title) ? currentStepInfo.title(h) : undefined;
      const slotTitle = this.$scopedSlots.title ? this.$scopedSlots.title(h) : undefined;
      const title = functionTitle || slotTitle || currentStepInfo.title;
      return title ? <div class={`${this.componentName}__title`}>{title}</div> : null;
    };

    const getHighlightContent = (h: CreateElement) => {
      const params: any = h;
      params.currentStepInfo = this.currentStepInfo as GuideStep;
      const { highlightContent } = this.currentStepInfo as GuideStep;
      // 支持组件
      let node: any = highlightContent;
      // 支持函数
      if (isFunction(highlightContent)) {
        node = highlightContent(params);
      } else if (this.$scopedSlots.highlightContent) {
        // 支持插槽
        node = this.$scopedSlots.highlightContent(params);
      } else if (this.$scopedSlots['highlight-content']) {
        node = this.$scopedSlots['highlight-content'](params);
      } else if (highlightContent) {
        // 支持组件
        node = <node />;
      }
      // 给自定义元素添加类名
      if (node) {
        node.props = node.props || {};
        node.props.class = `${this.componentName}__highlight--mask ${node.props.class || ''}`;
      }
      return node;
    };

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
              class={`${this.componentName}__skip`}
              {...{
                props: {
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
              class={`${this.componentName}__prev`}
              {...{
                props: {
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
              class={`${this.componentName}__next`}
              {...{
                props: {
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
              class={`${this.componentName}__finish`}
              {...{
                props: {
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

    const renderTooltipBody = (h: CreateElement) => {
      const { body: stepBody } = this.currentStepInfo as GuideStep;
      let descBody: any;
      if (isFunction(stepBody)) {
        descBody = stepBody(h);
      } else if (this.$scopedSlots.body) {
        const hParams = h;
        Object.assign(hParams, { currentStepInfo: this.currentStepInfo as GuideStep });
        descBody = this.$scopedSlots.body(hParams);
      } else if (typeof stepBody === 'string') {
        descBody = stepBody;
      } else {
        descBody = <stepBody />;
      }
      return descBody ? <div class={`${this.componentName}__desc`}>{descBody}</div> : null;
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
          {renderTooltipTitle(h)}
          {renderTooltipBody(h)}
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
      const innerHighlightContent = getHighlightContent(h);
      const showHighlightContent = Boolean(innerHighlightContent && this.isPopup);

      return (
        <div
          ref="highlightLayerRef"
          v-transfer-dom="body"
          class={highlightClass.concat(showHighlightContent ? [] : maskClass)}
          style={style}
        >
          {showHighlightContent && innerHighlightContent}
        </div>
      );
    };
    const renderCounter = () => {
      const popupSlotCounter = renderTNodeJSX(this, 'counter', {
        params: { total: this.stepsTotal, current: this.innerCurrent },
      });

      const popupDefaultCounter = (
        <div class={`${this.componentName}__counter`}>
          {popupSlotCounter || `${(this.innerCurrent as number) + 1}/${this.stepsTotal}`}
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
              {renderTooltipTitle(h)}
              {renderTooltipBody(h)}
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
      const contentProps = {
        handlePrev: this.handlePrev,
        handleNext: this.handleNext,
        handleSkip: this.handleSkip,
        handleFinish: this.handleFinish,
        current: this.innerCurrent,
        total: this.stepsTotal,
      };
      const hParams: any = h;
      hParams.currentStepInfo = this.currentStepInfo;
      let renderBody: any;
      if (isFunction(content)) {
        renderBody = () => content(hParams);
      } else if (this.$scopedSlots.content) {
        renderBody = () => this.$scopedSlots.content(hParams);
      } else if (typeof content === 'string') {
        renderBody = content;
      } else if (content) {
        renderBody = () => <content props={contentProps} />;
      } else {
        renderBody = renderPopupContent;
      }

      const classes = [
        `${this.componentName}__reference`,
        `${this.componentName}--${this.currentElmIsFixed ? 'fixed' : 'absolute'}`,
      ];

      const innerClassName: PopupProps['overlayInnerClassName'] = [
        {
          [`${this.classPrefix}-guide__popup--content`]: !!content,
        },
      ];
      return (
        <Popup
          visible={true}
          show-arrow={!content}
          zIndex={this.zIndex}
          placement={currentStepInfo.placement}
          props={currentStepInfo.popupProps}
          content={renderBody}
          overlayClassName={[`${this.componentName}__popup`, currentStepInfo?.stepOverlayClass]}
          overlayInnerClassName={innerClassName.concat(currentStepInfo.popupProps?.overlayInnerClassName)}
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
