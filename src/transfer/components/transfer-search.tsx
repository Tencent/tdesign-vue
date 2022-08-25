import { PropType, VNode } from 'vue';
import { SearchIcon as TdSearchIcon } from 'tdesign-icons-vue';
import { SearchOption } from '../interface';
import TInput from '../../input';

import mixins from '../../utils/mixins';
import { getGlobalIconMixins } from '../../config-provider/config-receiver';

export default mixins(getGlobalIconMixins()).extend({
  name: 'TTransferSearch',
  model: {
    prop: 'searchValue',
    event: 'change',
  },
  props: {
    searchValue: {
      type: String,
      default: '',
    },
    search: {
      type: [Boolean, Object] as PropType<SearchOption>,
    },
    placeholder: String,
    classPrefix: String,
  },
  render(): VNode {
    const { SearchIcon } = this.useGlobalIcon({ SearchIcon: TdSearchIcon });
    4;
    const {
      searchValue, search, placeholder, classPrefix,
    } = this;
    const inputProps = typeof search === 'object'
      ? search
      : {
        clearable: true,
      };
    const handleChange = (value: string, changeCtx: any) => {
      this.$emit('change', value);
      this.$emit('search', {
        value,
        trigger: 'input',
        e: changeCtx.e,
      });
    };
    const handleEnter = (value: string, changeCtx: any) => {
      this.$emit('search', {
        value,
        trigger: 'input',
        e: changeCtx.e,
      });
    };
    return (
      <div class={`${classPrefix}-transfer__search-wrapper`}>
        <TInput
          props={{ ...inputProps }}
          value={searchValue}
          onChange={handleChange}
          on-enter={handleEnter}
          placeholder={placeholder}
        >
          <SearchIcon slot="suffix-icon" />
        </TInput>
      </div>
    );
  },
});
