import { computed, defineComponent } from '@vue/composition-api';
import { usePrefixClass } from '../hooks/useConfig';

export default defineComponent({
  name: 'HighlightOption',

  props: {
    /** 联想词 */
    content: String,
    /** 搜索词 */
    keyword: String,
  },

  setup(props) {
    const classPrefix = usePrefixClass();
    const words = computed<{ list: string[]; keyword?: string }>(() => {
      const { content, keyword } = props;
      if (!content) return { list: [] };
      if (typeof content !== 'string' || !keyword) return { list: [content] };
      const regExp = new RegExp(keyword, 'i');
      const splitKeyword = content.match(regExp)?.[0];
      return {
        list: content.split(splitKeyword),
        keyword: splitKeyword,
      };
    });
    return { words, classPrefix };
  },

  render() {
    const { list, keyword } = this.words;
    return (
      <div class={`${this.classPrefix}-select-option__highlight-item`}>
        {list.map((item, index) => {
          if (!index) return item;
          return [
            <b class={`${this.classPrefix}-is-highlight`} key={item + keyword}>
              {keyword}
            </b>,
            item,
          ];
        })}
      </div>
    );
  },
});
