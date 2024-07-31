import { defineComponent, inject, PropType } from '@vue/composition-api';

import { LayoutEnum } from '../common';
import { usePrefixClass, useCommonClassName } from '../hooks/useConfig';

import descriptionsKey from './const';
import { ItemsType, TdDescriptionItem } from './interface';
import { renderVNodeTNode, itemTypeIsProps } from './utils';
import { TdDescriptionsProps } from './type';

export default defineComponent({
  name: 'TDescriptionsBody',
  props: {
    rows: Array as PropType<TdDescriptionItem[][]>,
    itemType: String as PropType<ItemsType>,
  },
  setup() {
    const descriptionsProps = inject<TdDescriptionsProps>(descriptionsKey);
    const COMPONENT_NAME = usePrefixClass('descriptions');
    const { SIZE } = useCommonClassName();

    return {
      descriptionsProps,
      COMPONENT_NAME,
      SIZE,
    };
  },
  render() {
    const props = this.$props;

    const label = (node: TdDescriptionItem, layout: LayoutEnum = 'horizontal') => {
      const labelClass = [`${this.COMPONENT_NAME}__label`];

      let label = null;
      let span = null;
      if (itemTypeIsProps(props.itemType, node)) {
        label = node.label;
        span = node.span;
      } else {
        label = renderVNodeTNode(node, 'label');
        const propsData: Record<string, any> = node.componentOptions.propsData || {};
        span = propsData.span;
      }
      const labelSpan = layout === 'horizontal' ? 1 : span;

      return (
        <td colspan={labelSpan} class={labelClass} {...{ style: this.descriptionsProps.labelStyle }}>
          {label}
          {this.descriptionsProps.colon && ':'}
        </td>
      );
    };

    const content = (node: TdDescriptionItem, layout: LayoutEnum = 'horizontal') => {
      const contentClass = [`${this.COMPONENT_NAME}__content`];

      let content = null;
      let span = null;
      if (itemTypeIsProps(props.itemType, node)) {
        content = node.content;
        span = node.span;
      } else {
        content = renderVNodeTNode(node, 'content', 'default');
        const propsData: Record<string, any> = node.componentOptions.propsData || {};
        span = propsData.span;
      }
      const contentSpan = span > 1 && layout === 'horizontal' ? span * 2 - 1 : span;

      return (
        <td colspan={contentSpan} class={contentClass} {...{ style: this.descriptionsProps.contentStyle }}>
          {content}
        </td>
      );
    };

    // 总共有四种布局
    // Layout horizontal vertical
    // itemLayout horizontal vertical

    const hh = (row: TdDescriptionItem[]) => <tr>{row.map((node) => [label(node), content(node)])}</tr>;

    const hv = (row: TdDescriptionItem[]) => [
      <tr>{row.map((node) => label(node, 'vertical'))}</tr>,
      <tr>{row.map((node) => content(node, 'vertical'))}</tr>,
    ];

    const vh = (row: TdDescriptionItem[]) => row.map((node) => (
        <tr>
          {label(node)}
          {content(node)}
        </tr>
    ));

    const vv = (row: TdDescriptionItem[]) => row.map((node) => [<tr>{label(node)}</tr>, <tr>{content(node)}</tr>]);

    const renderRow = (row: TdDescriptionItem[]) => {
      if (this.descriptionsProps.layout === 'horizontal') {
        if (this.descriptionsProps.itemLayout === 'horizontal') {
          return hh(row);
        }
        return hv(row);
      }
      if (this.descriptionsProps.itemLayout === 'horizontal') {
        return vh(row);
      }
      return vv(row);
    };

    const tableClass = [
      `${this.COMPONENT_NAME}__body`,
      this.SIZE[this.descriptionsProps.size],
      { [`${this.COMPONENT_NAME}__body--border`]: this.descriptionsProps.bordered },
    ];

    return (
      <table class={tableClass}>
        <tbody>{props.rows.map((row) => renderRow(row))}</tbody>
      </table>
    );
  },
});
