import {
  defineComponent, computed, inject, Ref, toRefs,
} from '@vue/composition-api';
import props from './collapse-panel-props';
import FakeArrow from '../common-components/fake-arrow';
import { CollapseValue, TdCollapsePanelProps } from './type';
import { usePrefixClass } from '../hooks/useConfig';
import { useTNodeJSX, useContent } from '../hooks/tnode';
import useCollapseAnimation from './useCollapseAnimation';

export default defineComponent({
  name: 'TCollapsePanel',
  props,
  setup(props: TdCollapsePanelProps, { slots }) {
    const { value, disabled } = toRefs(props);
    const componentName = usePrefixClass('collapse-panel');
    const disableClass = usePrefixClass('is-disabled');
    const clickableClass = usePrefixClass('is-clickable');
    const transitionClass = usePrefixClass('slide-down');
    const collapseValue: Ref<CollapseValue> = inject('collapseValue');
    const updateCollapseValue: Function = inject('updateCollapseValue');
    const getUniqId: Function = inject('getUniqId', () => undefined, false);
    const {
      defaultExpandAll,
      disabled: disableAll,
      expandIconPlacement,
      expandOnRowClick,
    } = inject<any>('collapseProps');
    const renderParentTNode: Function = inject('renderParentTNode');
    const innerValue = value.value === undefined ? getUniqId() : value.value;
    if (defaultExpandAll.value) {
      updateCollapseValue(innerValue);
    }
    const isDisabled = computed(() => disabled.value || disableAll.value);
    const isActive = computed(() => collapseValue.value instanceof Array
      ? collapseValue.value.includes(innerValue)
      : collapseValue.value === innerValue);
    const classes = computed(() => [componentName.value, { [disableClass.value]: isDisabled.value }]);
    const panelExpandIcon = computed(() => slots.expandIcon || props.expandIcon);
    const renderTNodeJSX = useTNodeJSX();
    const renderContent = useContent();
    return {
      isDisabled,
      classes,
      isActive,
      updateCollapseValue,
      innerValue,
      expandIconPlacement,
      expandOnRowClick,
      componentName,
      clickableClass,
      transitionClass,
      panelExpandIcon,
      renderParentTNode,
      renderTNodeJSX,
      renderContent,
    };
  },
  methods: {
    renderDefaultIcon() {
      const { componentName } = this;
      return <FakeArrow overlayClassName={`${componentName}__icon--default`} />;
    },
    renderIcon() {
      const {
        panelExpandIcon,
        renderParentTNode,
        componentName,
        expandIconPlacement,
        isActive,
        handleClick,
        renderDefaultIcon,
        renderTNodeJSX,
      } = this;
      const tNodeRender = panelExpandIcon === undefined ? renderParentTNode : renderTNodeJSX;
      return (
        <div
          ref="iconRef"
          class={`${componentName}__icon ${componentName}__icon--${expandIconPlacement} ${
            isActive ? `${componentName}__icon--active` : ''
          }`}
          onClick={handleClick}
        >
          {tNodeRender('expandIcon', renderDefaultIcon())}
        </div>
      );
    },
    renderHeader() {
      const {
        isDisabled, handleClick, renderIcon, renderBlank,
      } = this;
      const cls = [
        `${this.componentName}__header`,
        {
          [this.clickableClass]: this.expandOnRowClick && !isDisabled,
        },
      ];
      return (
        <div class={cls} onClick={handleClick}>
          <div class={`${this.componentName}__header-left`}>{this.expandIconPlacement === 'left' && renderIcon()}</div>
          <div class={`${this.componentName}__header-content`}>{this.renderTNodeJSX('header')}</div>
          {renderBlank()}
          <div class={`${this.componentName}__header-right`}>
            <div class={`${this.componentName}__header-right-content`} onClick={(e: MouseEvent) => e.stopPropagation()}>
              {this.renderTNodeJSX('headerRightContent')}
            </div>
            {this.expandIconPlacement === 'right' && renderIcon()}
          </div>
        </div>
      );
    },
    renderBlank() {
      return <div class={`${this.componentName}__header--blank`}></div>;
    },
    renderBody() {
      return this.destroyOnCollapse ? this.renderBodyDestroyOnCollapse() : this.renderBodyByNormal();
    },
    renderBodyByNormal() {
      return (
        <div v-show={this.isActive} class={`${this.componentName}__body`}>
          <div class={`${this.componentName}__content`}>{this.renderContent('default', 'content')}</div>
        </div>
      );
    },
    renderBodyDestroyOnCollapse() {
      return this.isActive ? (
        <div class={`${this.componentName}__body`}>
          <div class={`${this.componentName}__content`}>{this.renderContent('default', 'content')}</div>
        </div>
      ) : null;
    },
    handleClick(e: MouseEvent) {
      const {
        expandOnRowClick, updateCollapseValue, innerValue, isDisabled,
      } = this;
      const canExpand = expandOnRowClick || e.currentTarget === this.$refs.iconRef;
      if (canExpand && !isDisabled) {
        updateCollapseValue(innerValue);
      }
      e.stopPropagation();
    },
  },
  render() {
    const {
      beforeEnter, enter, afterEnter, beforeLeave, leave, afterLeave,
    } = useCollapseAnimation();
    const { classes } = this;
    return (
      <div class={classes}>
        <div class={`${this.componentName}__wrapper`}>
          {this.renderHeader()}
          <transition
            name={this.transitionClass}
            onBeforeEnter={beforeEnter}
            onEnter={enter}
            onAfterEnter={afterEnter}
            onBeforeLeave={beforeLeave}
            onLeave={leave}
            onAfterLeave={afterLeave}
          >
            {this.renderBody()}
          </transition>
        </div>
      </div>
    );
  },
});
