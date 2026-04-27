import { defineComponent } from 'vue';
import { usePrefixClass } from '../config-provider/useConfig';
import { useContent } from '../hooks/tnode';
import props from './paragraph-props';
import Ellipsis from './components/ellipsis';

export default defineComponent({
  name: 'TTypographyParagraph',
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
    const content = this.renderContent('default', 'content');
    // @ts-ignore
    return this.ellipsis ? (
      <Ellipsis props={this.$props} class={this.COMPONENT_NAME}>
        {content}
      </Ellipsis>
    ) : (
      <p class={this.COMPONENT_NAME}>{content}</p>
    );
  },
});
