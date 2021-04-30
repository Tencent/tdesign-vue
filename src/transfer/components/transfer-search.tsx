
import Vue, { PropType, VNode } from 'vue';
import { prefix } from '../../config';
import { SearchOption } from '../type/transfer';

const name = `${prefix}-transfer-search`;
const searchPlaceholder = '请输入';


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
  },
  render(_, context): VNode {
    const { searchValue, search } = context.props;
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
        <t-input
          props={{ ...inputProps }}
          value={searchValue}
          onChange={handleChange}
          on-enter={handleEnter}
          placeholder={searchPlaceholder}
        >
          <t-icon name="search" slot="suffix-icon"></t-icon>
        </t-input>
      </div>
    );
  },
});
