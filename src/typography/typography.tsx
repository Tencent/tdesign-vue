import { defineComponent } from '@vue/composition-api';
import { useTNodeJSX } from '../hooks/tnode';
import Text from './text';

export default defineComponent({
  name: 'TTypography',
  setup() {
    const renderTNodeJSX = useTNodeJSX();
    return {
      renderTNodeJSX,
    };
  },
  render() {
    return <Text>{this.renderTNodeJSX('default')}</Text>;
  },
});
