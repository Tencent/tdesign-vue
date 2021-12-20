import Vue, { PropType, VNode } from 'vue';
import { SearchIcon as TIconSearch } from 'tdesign-icons-vue';
import { prefix } from '../../config';
import { SearchOption } from '../interface';
import TInput from '../../input';

const name = `${prefix}-transfer-search`;

export default Vue.extend({
  name,
  functional: true,
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
  },
  render(_, context): VNode {
    const { searchValue, search, placeholder } = context.props;
    const inputProps = typeof search === 'object' ? search : {
      clearable: true,
    };
    const handleChange = function (value: string, changeCtx: any) {
      context.listeners.change && (context.listeners.change as Function)(value);
      context.listeners.search && (context.listeners.search as Function)({
        value,
        trigger: 'input',
        e: changeCtx.e,
      });
    };
    const handleEnter = function (value: string, changeCtx: any) {
      context.listeners.search && (context.listeners.search as Function)({
        value,
        trigger: 'input',
        e: changeCtx.e,
      });
    };
    return (
      <div class="t-transfer-list-search-wrapper" >
        <TInput
          props={{ ...inputProps }}
          value={searchValue}
          onChange={handleChange}
          on-enter={handleEnter}
          placeholder={placeholder}
        >
          <TIconSearch slot="suffix-icon" />
        </TInput>
      </div>
    );
  },
});
