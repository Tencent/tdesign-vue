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
    let content: TNodeReturnValue = this.$slots.default;
    if (this.options && this.options.length) {
      content = this.options.map((option: TdBreadcrumbItemProps, index: number) => (
          <BreadcrumbItem
            key={index}
            maxWidth={option.maxWidth}
            disabled={option.disabled}
            href={option.href}
            target={option.target}
            to={option.to}
            router={option.router}
            replace={option.replace}
          >
            {option.default || option.content}
          </BreadcrumbItem>
      ));
    }
    return <div class={name}>{content}</div>;
  },

});
