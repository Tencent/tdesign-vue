import {
  defineComponent, computed, inject, Ref, toRefs,
} from '@vue/composition-api';
import props from './collapse-panel-props';
import FakeArrow from '../common-components/fake-arrow';
import { CollapseValue, TdCollapsePanelProps } from './type';
import { usePrefixClass } from '../hooks/useConfig';
import useCollapseAnimation from './useCollapseAnimation';
import { renderTNodeJSX } from '../utils/render-tnode';

export default defineComponent({
  name: 'TCollapsePanel',
  props,
  setup(props: TdCollapsePanelProps) {
    const { value, disabled, expandIcon } = toRefs(props);
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
      expandIcon: expandIconAll,
    } = inject('collapseProps');
    const innerValue = value.value || getUniqId();
    const showExpandIcon = computed(() => (expandIcon.value === undefined ? expandIconAll.value : expandIcon.value));
    if (defaultExpandAll.value) {
      updateCollapseValue(innerValue);
    }
    const isDisabled = computed(() => disabled.value || disableAll.value);
    const isActive = computed(() => collapseValue.value instanceof Array
      ? collapseValue.value.includes(innerValue)
      : collapseValue.value === innerValue);
    const classes = computed(() => [componentName.value, { [disableClass.value]: isDisabled.value }]);

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
      showExpandIcon,
    };
  },
  methods: {
    renderIcon(direction: string) {
      return (
        <FakeArrow
          name="arrow"
          isActive={this.isActive}
          overlayClassName={`${this.componentName}__icon ${this.componentName}__icon--${direction}`}
        />
      );
    },
    renderHeader() {
      const {
        showExpandIcon, isDisabled, handleClick, renderIcon, renderBlank,
      } = this;
      const cls = [
        `${this.componentName}__header`,
        {
          [this.clickableClass]: this.expandOnRowClick && !isDisabled,
        },
      ];
      return (
        <div ref={'headRef'} class={cls} onClick={handleClick}>
          {showExpandIcon && this.expandIconPlacement === 'left' ? renderIcon(this.expandIconPlacement) : null}
          {renderTNodeJSX(this, 'header')}
          {renderBlank()}
          {renderTNodeJSX(this, 'headerRightContent')}
          {showExpandIcon && this.expandIconPlacement === 'right' ? renderIcon(this.expandIconPlacement) : null}
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
          <div class={`${this.componentName}__content`}>{renderTNodeJSX(this, 'default')}</div>
        </div>
      );
    },
    renderBodyDestroyOnCollapse() {
      return this.isActive ? (
        <div class={`${this.componentName}__body`}>
          <div class={`${this.componentName}__content`}>{renderTNodeJSX(this, 'default')}</div>
        </div>
      ) : null;
    },
    handleClick(e: MouseEvent) {
      const canExpand = (this.expandOnRowClick && e.target === this.$refs.headRef)
        || (e.target as Element).getAttribute('name') === 'arrow';
      if (canExpand && !this.isDisabled) {
        this.updateCollapseValue(this.innerValue);
      }
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
