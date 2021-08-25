import Vue from 'vue';
import DropdownItem from './dropdown-item';
import bus from './bus';
import { prefix } from '../config';
import { TNodeReturnValue } from '../common';
import { DropdownOption } from './type';

const name = `${prefix}-dropdown__menu`;

export default Vue.extend({
  name,
  props: {
    busId: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: (): [] => [],
    },
    maxHeight: {
      type: Number,
      default: 300,
    },
    maxColumnWidth: {
      type: Number,
      default: 100,
    },
    minColumnWidth: {
      type: Number,
      default: 10,
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
    renderMenuColumn(children: Array<DropdownOption>, showSubmenu: boolean, pathPrefix: string): TNodeReturnValue {
      const menuClass = [`${name}__column`, 'narrow-scrollbar', { submenu__visible: showSubmenu }];
      return (
        <div class={menuClass} style={{
          maxHeight: `${this.maxHeight}px`,
        }}>
          {
            children.map(((item) => (
              <DropdownItem
                busId={this.busId}
                disabled={item.disabled}
                active={this.isActive(item, pathPrefix) || item.active}
                value={item.value}
                content={item.content}
                divider={item.divider}
                hasChildren={item.children && item.children.length > 0}
                path={`${pathPrefix}/${item.value}`}
                maxColumnWidth={this.maxColumnWidth}
                minColumnWidth={this.minColumnWidth}
                onClick={item.onClick}
              />
            )))
          }
        </div>
      );
    },
  },
  mounted() {
    bus.$on(`${this.busId}submenuShow`, (path: string) => {
      this.path = path;
    });
    bus.$on(`${this.busId}clearPath`, () => {
      this.path = '';
    });
  },
  render() {
    const columns: TNodeReturnValue[] = [];
    let menuItems = this.options as DropdownOption[];
    let pathPrefix = '';
    // 根据path渲染
    while (menuItems && menuItems.length) {
      // eslint-disable-next-line
      const activeItem = menuItems.find(item => this.isActive(item, pathPrefix, false));

      columns.push(this.renderMenuColumn(menuItems, !!activeItem, pathPrefix));

      if (activeItem) {
        pathPrefix = `${pathPrefix}/${activeItem.value}`;
        menuItems = activeItem.children || [];
      } else {
        menuItems = [];
      }
    }
    return (
      <div class={name}>
        { columns }
      </div>
    );
  },
});
