import Vue from 'vue';
import { prefix } from '../config';
import props from './props';
import BreadcrumbItem from './breadcrumb-item';
import { TdBreadcrumbItemProps } from './type';
import { TNodeReturnValue } from '../common';

const name = `${prefix}-breadcrumb`;

export default Vue.extend({
  name: 'TBreadcrumb',
  props: {
    ...props,
  },
  components: {
    BreadcrumbItem,
  },
  provide() {
    return {
      tBreadcrumb: this,
    };
  },

  render() {
    const content: TNodeReturnValue = this.options && this.options.length
      ? this.options.map((option: TdBreadcrumbItemProps, index: number) => (
            <BreadcrumbItem key={index} {...option}>
              {option.default || option.content}
            </BreadcrumbItem>
      ))
      : this.$slots.default;
    return <div class={name}>{content}</div>;
  },
});
