import { computed, defineComponent, PropType } from '@vue/composition-api';
import { ChevronDownIcon } from 'tdesign-icons-vue';
import useClassName from './hooks/useClassName';
import { SortType } from './type';
import Tooltip from '../tooltip';

// TODO: GLOBLE_CONFIG
const tooltips = {
  asc: '点击升序',
  desc: '点击降序',
  undefined: '点击取消排序',
};

type SortTypeEnums = Array<'desc' | 'asc'>;

export default defineComponent({
  props: {
    sortType: {
      type: String as PropType<SortType>,
      default: 'all',
    },
    sortOrder: {
      type: String,
      default: (): string => '',
    },
    nextSortOrder: {
      type: String,
      required: false,
    },
  },

  setup(props, context) {
    const { tableSortClasses } = useClassName();

    const allowSortTypes = computed<SortTypeEnums>(() => props.sortType === 'all' ? ['asc', 'desc'] : [props.sortType]);

    const onClick = (e: MouseEvent) => {
      context.emit('click', e);
    };

    return {
      tableSortClasses,
      allowSortTypes,
      onClick,
    };
  },

  methods: {
    getSortIcon(direction: string, activeClass: string) {
      // TODO: GLOBLE_CONFIG
      const icon = <ChevronDownIcon />;
      const styles = {
        transform: direction === 'asc' ? 'rotate(-180deg)' : undefined,
      };
      const sortClassName = [
        activeClass,
        this.tableSortClasses.sortIcon,
        this.tableSortClasses.iconDirection[direction],
      ];
      return (
        <span style={styles} class={sortClassName}>
          {icon}
        </span>
      );
    },
  },

  render() {
    const { tableSortClasses } = this;
    const classes = [tableSortClasses.trigger, { [tableSortClasses.doubleIcon]: this.allowSortTypes.length > 1 }];
    const tips = tooltips[this.nextSortOrder];
    const sortButton = this.allowSortTypes.map((direction: string) => {
      const activeClass = direction === this.sortOrder ? tableSortClasses.iconActive : tableSortClasses.iconDefault;
      return this.getSortIcon(direction, activeClass);
    });
    return (
      <div class={classes} onClick={this.onClick}>
        {tips ? (
          <Tooltip content={tips} showArrow={false}>
            {sortButton}
          </Tooltip>
        ) : (
          sortButton
        )}
      </div>
    );
  },
});
