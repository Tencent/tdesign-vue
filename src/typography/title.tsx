import { defineComponent, h } from 'vue';
import { usePrefixClass } from '../config-provider/useConfig';
import { useContent } from '../hooks/tnode';
import props from './title-props';
import Ellipsis from './components/ellipsis';

export default defineComponent({
  name: 'TTypographyTitle',
  props,
  setup() {
    const COMPONENT_NAME = usePrefixClass('typography');
    const renderContent = useContent();

    return {
      COMPONENT_NAME,
      renderContent,
    };
  },
  render() {
    const { level: Tag } = this;
    const content = this.renderContent('default', 'content');
    if (this.ellipsis) {
      return (
        <Ellipsis props={this.$props} class={this.COMPONENT_NAME}>
          {h(Tag, [content])}
        </Ellipsis>
      );
    }
    // 合并 $attrs 与 class
    const attrs = this.$attrs || {};
    return h(Tag, { class: this.COMPONENT_NAME, attrs }, [content]);
  },
});
