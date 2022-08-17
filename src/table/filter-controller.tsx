import { defineComponent, PropType, ref } from '@vue/composition-api';
import { CreateElement } from 'vue';
import { FilterIcon } from 'tdesign-icons-vue';
import isEmpty from 'lodash/isEmpty';
import lowerFirst from 'lodash/lowerFirst';
import Popup from '../popup';
import { CheckboxGroup } from '../checkbox';
import { RadioGroup } from '../radio';
import Input from '../input';
import TButton from '../button';
import { useTNodeDefault } from '../hooks/tnode';
import { PrimaryTableCol, FilterValue } from './type';
import { useConfig } from '../config-provider/useConfig';
import log from '../_common/js/log';

type Params = Parameters<CreateElement>;
type FirstParams = Params[0];
type SecondParams = Params[1] | Params[2];

export interface TableFilterControllerProps {
  tFilterValue: FilterValue;
  innerFilterValue: FilterValue;
  tableFilterClasses: {
    filterable: string;
    popup: string;
    icon: string;
    popupContent: string;
    result: string;
    inner: string;
    bottomButtons: string;
    contentInner: string;
    iconWrap: string;
  };
  isFocusClass: string;
  column: PrimaryTableCol;
  primaryTableElement: HTMLDivElement;
}

export default defineComponent({
  name: 'TableFilterController',

  props: {
    column: Object as PropType<TableFilterControllerProps['column']>,
    tFilterValue: Object as PropType<TableFilterControllerProps['tFilterValue']>,
    innerFilterValue: Object as PropType<TableFilterControllerProps['innerFilterValue']>,
    tableFilterClasses: Object as PropType<TableFilterControllerProps['tableFilterClasses']>,
    isFocusClass: String,
    primaryTableElement: {},
  },

  // eslint-disable-next-line
  setup(props: TableFilterControllerProps, { emit }) {
    const triggerElementRef = ref<HTMLDivElement>(null);
    const renderTNode = useTNodeDefault();
    const { t, global } = useConfig('table');
    const filterPopupVisible = ref(false);

    const onFilterPopupVisibleChange = (visible: boolean) => {
      filterPopupVisible.value = visible;
      emit('visible-change', visible);
    };

    return {
      t,
      global,
      filterPopupVisible,
      triggerElementRef,
      renderTNode,
      onFilterPopupVisibleChange,
    };
  },

  render(h) {
    const getFilterContent = (h: CreateElement, column: PrimaryTableCol) => {
      const types = ['single', 'multiple', 'input'];
      if (column.type && !types.includes(column.filter.type)) {
        log.error('Table', `filter.type must be the following: ${JSON.stringify(types)}`);
        return;
      }
      if (!column.filter.type && !column.filter.component) {
        log.error('Table', 'both filter.type and filter.component can not be empty.');
        return;
      }
      const component = {
        single: RadioGroup,
        multiple: CheckboxGroup,
        input: Input,
      }[column.filter.type] || column.filter.component;
      if (!component && !column.filter.component) return;
      const filterComponentProps: { [key: string]: any } = {
        options: ['single', 'multiple'].includes(column.filter.type) ? column.filter?.list : undefined,
        ...(column.filter?.props || {}),
        value: this.innerFilterValue?.[column.colKey],
      };
      // 这个代码必须放在这里，没事儿别改
      if (column.filter.type === 'single') {
        filterComponentProps.onChange = (val: any) => {
          this.$emit('inner-filter-change', val, column);
        };
      }
      // 这个代码必须放在这里，没事儿别改
      const on = {
        change: (val: any) => {
          this.$emit('inner-filter-change', val, column);
        },
      };
      // 允许自定义触发确认搜索的事件
      if (column.filter.confirmEvents) {
        column.filter.confirmEvents.forEach((event) => {
          const pureEvent = lowerFirst(event.replace('on', ''));
          on[pureEvent] = () => {
            this.$emit('confirm', column);
            this.filterPopupVisible = false;
          };
        });
      }
      const wrapperListeners: { click?: Function } = {};
      if (column.filter.showConfirmAndReset) {
        wrapperListeners.click = (e: MouseEvent) => e.stopPropagation();
      }

      const renderComponent = () => {
        if (!component) return null;
        const isVueComponent = component.install && component.component;
        if (typeof component === 'function' && !isVueComponent) {
          return component((v: FirstParams, b: SecondParams) => {
            const tProps = typeof b === 'object' && 'attrs' in b ? b.attrs : {};
            return h(v, {
              props: { ...filterComponentProps, ...tProps },
              on,
            });
          });
        }
        return (
          <component
            value={this.innerFilterValue?.[column.colKey]}
            props={{ ...filterComponentProps }}
            on={{ ...on }}
          ></component>
        );
      };

      return (
        <div class={this.tableFilterClasses.contentInner} on={wrapperListeners}>
          {renderComponent()}
        </div>
      );
    };

    // eslint-disable-next-line
    const getBottomButtons = (h: CreateElement, column: PrimaryTableCol) => {
      if (!column.filter.showConfirmAndReset) return;
      return (
        <div class={this.tableFilterClasses.bottomButtons}>
          <TButton
            theme="default"
            size="small"
            onClick={() => {
              this.$emit('reset', column);
              this.filterPopupVisible = false;
            }}
          >
            {this.global.resetText}
          </TButton>
          <TButton
            theme="primary"
            size="small"
            onClick={() => {
              this.$emit('confirm', column);
              this.filterPopupVisible = false;
            }}
          >
            {this.global.confirmText}
          </TButton>
        </div>
      );
    };

    const { column } = this;
    if (!column.filter || (column.filter && !Object.keys(column.filter).length)) return null;
    const defaultFilterIcon = this.t(this.global.filterIcon) || <FilterIcon />;
    return (
      <Popup
        attach={this.primaryTableElement ? () => this.primaryTableElement : undefined}
        visible={this.filterPopupVisible}
        destroyOnClose
        trigger="click"
        placement="bottom"
        showArrow
        overlayClassName={this.tableFilterClasses.popup}
        on={{
          'visible-change': (val: boolean) => this.onFilterPopupVisibleChange(val),
        }}
        class={[this.tableFilterClasses.icon, { [this.isFocusClass]: !isEmpty(this.tFilterValue?.[column.colKey]) }]}
        content={() => (
          <div class={this.tableFilterClasses.popupContent}>
            {getFilterContent(h, column)}
            {getBottomButtons(h, column)}
          </div>
        )}
      >
        <div ref="triggerElementRef">{this.renderTNode('filterIcon', defaultFilterIcon)}</div>
      </Popup>
    );
  },
});
