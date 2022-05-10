import Vue, { VueConstructor } from 'vue';
import DropdownItem from './dropdown-item';
import { prefix } from '../config';
import { TNodeReturnValue } from '../common';
import { DropdownOption } from './type';
import { renderTNodeJSX } from '../utils/render-tnode';
import { pxCompat } from '../utils/helper';

const name = `${prefix}-dropdown__menu`;
export interface DropdownMenuInstance extends Vue {
  dropdown: {
    options: DropdownOption[];
    maxHeight: number;
    minColumnWidth: number;
    maxColumnWidth: number;
  };
}

export default (Vue as VueConstructor<DropdownMenuInstance>).extend({
  name: 'TDropdownMenu',
  inject: {
    dropdown: {
      default: undefined,
    },
  },
  data() {
    return {
      path: '', // 当前选中路径，形如{/id1/id2/id3}
    };
  },
  methods: {
    isActive(item: DropdownOption, pathPrefix: string, excludeSelf = true): boolean {
      const itemPath = `${pathPrefix}/${item.value}`;
      if (excludeSelf && this.path === itemPath) {
        return false;
      }
      return this.path.indexOf(itemPath) === 0;
    },
    handleHoverItem(path: string) {
      this.path = path;
    },
    handleItemClick(data: DropdownOption, context: { e: MouseEvent }, idx: number) {
      this.dropdown.options[idx].onClick?.(data, context);
    },
    renderMenuColumn(children: Array<DropdownOption>, showSubmenu: boolean, pathPrefix: string): TNodeReturnValue {
      const menuClass = [`${name}-column`, 'narrow-scrollbar', { submenu__visible: showSubmenu }];
      const { maxHeight, maxColumnWidth, minColumnWidth } = this.dropdown;
      return (
        <div
          class={menuClass}
          style={{
            maxHeight: `${maxHeight}px`,
            maxWidth: pxCompat(maxColumnWidth),
            minWidth: pxCompat(minColumnWidth),
          }}
        >
          {children.map((item, idx) => (
            <DropdownItem
              key={idx}
              disabled={item.disabled}
              active={this.isActive(item, pathPrefix) || item.active}
              value={item.value}
              content={item.content}
              divider={item.divider}
              hasChildren={item.children && item.children.length > 0}
              path={`${pathPrefix}/${item.value}`}
              onClick={(data: DropdownOption, context: { e: MouseEvent }) => this.handleItemClick(data, context, idx)}
              onHover={this.handleHoverItem}
            />
          ))}
        </div>
      );
    },
  },

  render() {
    const columns: TNodeReturnValue[] = [];
    let menuItems = this.dropdown.options as DropdownOption[];
    let pathPrefix = '';
    if (this.$scopedSlots.default) {
      return (
        <div class={name}>
          <div
            class={[`${name}-column`, 'narrow-scrollbar']}
            style={{
              maxHeight: `${this.dropdown.maxHeight}px`,
              maxWidth: `${this.dropdown.maxColumnWidth}px`,
              minWidth: `${this.dropdown.minColumnWidth}px`,
            }}
          >
            {renderTNodeJSX(this, 'default')}
          </div>
        </div>
      );
    }
    // 根据path渲染
    while (menuItems && menuItems.length) {
      // eslint-disable-next-line
      const activeItem = menuItems.find((item) => this.isActive(item, pathPrefix, false));

      columns.push(this.renderMenuColumn(menuItems, !!activeItem, pathPrefix));

      if (activeItem) {
        pathPrefix = `${pathPrefix}/${activeItem.value}`;
        menuItems = activeItem.children || [];
      } else {
        menuItems = [];
      }
    }
    return <div class={name}>{columns}</div>;
  },
});
