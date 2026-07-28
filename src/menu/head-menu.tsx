/* eslint-disable no-param-reassign */
import {
  defineComponent, computed, provide, ref, watch, onMounted, onBeforeUnmount, nextTick,
} from 'vue';
import type { VNode } from 'vue';
import { EllipsisIcon } from 'tdesign-icons-vue';
import props from './head-menu-props';
import { MenuValue } from './type';
import { TdMenuInterface, TdOpenType } from './const';
import { Tabs, TabPanel } from '../tabs';
import Submenu from './submenu';
import PopupOverflowContent from './components/popup-overflow-content';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';
import VMenu from './v-menu';
import type { VMenuData } from './v-menu';
import { usePrefixClass } from '../hooks/useConfig';
import useResizeObserver from '../hooks/useResizeObserver';

const MORE_SUBMENU_VALUE = '__t_head_menu_more__';

const cloneVNodeTree = (vnode: VNode): VNode => {
  const cloned = {
    ...vnode,
    data: vnode.data ? { ...vnode.data } : vnode.data,
    children: vnode.children?.map((child) => cloneVNodeTree(child as VNode)),
    componentOptions: vnode.componentOptions
      ? {
        ...vnode.componentOptions,
        children: vnode.componentOptions.children?.map((child) => cloneVNodeTree(child)),
      }
      : vnode.componentOptions,
  } as VNode;
  cloned.elm = undefined;
  cloned.componentInstance = undefined;
  return cloned;
};

export default defineComponent({
  name: 'THeadMenu',
  props,
  model: {
    prop: 'value',
    event: 'change',
  },
  components: { Tabs, TabPanel },
  setup(props, ctx) {
    const activeValue = ref(props.defaultValue || props.value);
    const activeValues = ref([]);
    const expandValues = ref(props.defaultExpanded || props.expanded || []);

    const classPrefix = usePrefixClass();

    const theme = computed(() => props.theme);
    const menuClass = computed(() => [
      `${classPrefix.value}-menu`,
      `${classPrefix.value}-head-menu`,
      `${classPrefix.value}-menu--${props.theme}`,
    ]);
    const mode = ref(props.expandType);
    const submenu = ref([]);
    const deliver = (evt: string) => {
      const func = `on${evt[0].toUpperCase() + evt.slice(1)}`;
      return (val: any) => {
        if (typeof props[func] === 'function') {
          props[func](val);
        }
        ctx.emit(evt, val);
      };
    };
    const emitChange = deliver('change');
    const emitExpand = deliver('expand');
    const vMenu = new VMenu({ isMutex: true, expandValues: expandValues.value });

    provide<TdMenuInterface>('TdMenu', {
      mode,
      theme,
      vMenu,
      isHead: true,
      expandValues,
      activeValue,
      activeValues,
      select: (value: MenuValue) => {
        emitChange(value);
      },
      open: (value: MenuValue, type: TdOpenType) => {
        const expanded = [...expandValues.value];
        const index = expanded.indexOf(value);

        if (mode.value === 'popup') {
          if (type === 'add') {
            if (index === -1) {
              // 可能初始expanded里包含了该value
              expanded.push(value);
            }
          } else if (type === 'remove') {
            expanded.splice(index, 1);
          }
        } else {
          expanded.splice(0, 1);
          if (index === -1) {
            expanded.push(value);
          }
        }
        emitExpand(expanded);
      },
    });

    // methods
    const handleTabChange = (value: MenuValue) => {
      emitChange(value);
    };

    // watch
    const handleSubmenuExpand = (value: MenuValue) => {
      const ans = vMenu.getChild(value);
      submenu.value.length = 0;
      submenu.value.push(...ans);
    };
    watch(
      () => props.expanded,
      (value) => {
        expandValues.value = value;
        if (mode.value === 'normal') {
          handleSubmenuExpand(value[0]);
        }
      },
    );
    const updateActiveValues = (value: MenuValue) => {
      activeValue.value = value;
      activeValues.value = vMenu.select(value);
      syncMoreActiveState();
    };
    watch(() => props.value, updateActiveValues);
    watch(() => props.defaultValue, updateActiveValues);
    watch(
      () => props.expandType,
      (value) => {
        mode.value = value;
      },
    );

    onMounted(() => {
      activeValues.value = vMenu.select(activeValue.value);
      if (expandValues.value?.length > 0) {
        handleSubmenuExpand(expandValues.value[0]); // 顶部导航只能同时展开一个子菜单
      }
    });

    const menuRef = ref<HTMLElement>();
    const innerRef = ref<HTMLElement>();
    const logoRef = ref<HTMLElement>();
    const operationRef = ref<HTMLElement>();
    const foldStartIndex = ref(-1);
    const cachedItemWidths: number[] = [];

    const getMenuItemElements = () => {
      if (!menuRef.value) return [];
      const moreClass = `${classPrefix.value}-head-menu__submenu--more`;
      const menuItemClass = `${classPrefix.value}-menu__item`;
      const submenuClass = `${classPrefix.value}-submenu`;
      const items: HTMLElement[] = [];
      const collect = (parent: HTMLElement, depth: number) => {
        if (depth > 3) return;
        Array.from(parent.children).forEach((element) => {
          if (!(element instanceof HTMLElement) || element.classList.contains(moreClass)) return;
          if (element.classList.contains(menuItemClass) || element.classList.contains(submenuClass)) {
            items.push(element);
          } else {
            collect(element, depth + 1);
          }
        });
      };
      collect(menuRef.value, 0);
      return items;
    };

    const getWrapperElements = () => {
      if (!menuRef.value) return [];
      const moreClass = `${classPrefix.value}-head-menu__submenu--more`;
      const menuItemClass = `${classPrefix.value}-menu__item`;
      const submenuClass = `${classPrefix.value}-submenu`;
      return Array.from(menuRef.value.children).filter(
        (element): element is HTMLElement => element instanceof HTMLElement
          && !element.classList.contains(moreClass)
          && !element.classList.contains(menuItemClass)
          && !element.classList.contains(submenuClass),
      );
    };

    const getElementWidth = (element: HTMLElement) => {
      const style = window.getComputedStyle(element);
      return (
        element.getBoundingClientRect().width
        + Number.parseFloat(style.marginLeft || '0')
        + Number.parseFloat(style.marginRight || '0')
      );
    };

    const getMoreButtonWidth = () => {
      const moreElement = menuRef.value?.querySelector(`.${classPrefix.value}-head-menu__submenu--more`) as HTMLElement;
      if (!moreElement) return 0;
      const wasHidden = moreElement.style.display === 'none';
      if (wasHidden) {
        moreElement.style.visibility = 'hidden';
        moreElement.style.display = '';
      }
      const width = getElementWidth(moreElement);
      if (wasHidden) {
        moreElement.style.display = 'none';
        moreElement.style.visibility = '';
      }
      return width;
    };

    const getComputedCssValue = (element: Element, property: keyof CSSStyleDeclaration) => Number.parseFloat(String(getComputedStyle(element)[property])) || 0;

    const calcMenuWidth = () => {
      if (!innerRef.value || !menuRef.value) return 0;
      let totalWidth = innerRef.value.clientWidth;
      [logoRef.value, operationRef.value].forEach((element) => {
        if (!element) return;
        totalWidth
          -= element.offsetWidth
          + getComputedCssValue(element, 'marginLeft')
          + getComputedCssValue(element, 'marginRight');
      });
      return (
        totalWidth
        - getComputedCssValue(menuRef.value, 'paddingLeft')
        - getComputedCssValue(menuRef.value, 'paddingRight')
        - getComputedCssValue(menuRef.value, 'marginLeft')
        - getComputedCssValue(menuRef.value, 'marginRight')
      );
    };

    function syncMoreActiveState() {
      const values = activeValues.value;
      const hasMoreFlag = values.includes(MORE_SUBMENU_VALUE);
      let needActive = false;
      if (foldStartIndex.value >= 0 && values.length) {
        const topLevelValues = vMenu.data?.children?.map((child) => child.value) || [];
        const foldedValues = new Set(topLevelValues.slice(foldStartIndex.value));
        needActive = values.some((value) => value != null && value !== MORE_SUBMENU_VALUE && foldedValues.has(value));
      }
      if (needActive && !hasMoreFlag) {
        activeValues.value = [...values, MORE_SUBMENU_VALUE];
      } else if (!needActive && hasMoreFlag) {
        activeValues.value = values.filter((value) => value !== MORE_SUBMENU_VALUE);
      }
    }

    const applyFoldState = () => {
      if (!menuRef.value) return;
      getWrapperElements().forEach((element) => {
        element.style.display = 'contents';
      });
      const isFolded = foldStartIndex.value >= 0;
      getMenuItemElements().forEach((element, index) => {
        element.style.display = isFolded && index >= foldStartIndex.value ? 'none' : '';
      });
      const moreElement = menuRef.value.querySelector(`.${classPrefix.value}-head-menu__submenu--more`) as HTMLElement;
      if (moreElement) moreElement.style.display = isFolded ? '' : 'none';
      syncMoreActiveState();
    };

    const handleResize = () => {
      if (props.expandType !== 'popup' || !menuRef.value) return;
      getWrapperElements().forEach((element) => {
        element.style.display = 'contents';
      });
      const itemNodes = getMenuItemElements();
      if (!itemNodes.length) {
        foldStartIndex.value = -1;
        applyFoldState();
        return;
      }

      const moreElement = menuRef.value.querySelector(`.${classPrefix.value}-head-menu__submenu--more`) as HTMLElement;
      if (moreElement) moreElement.style.display = 'none';
      const savedDisplays = itemNodes.map((element) => element.style.display);
      const savedFlexShrinks = itemNodes.map((element) => element.style.flexShrink);
      itemNodes.forEach((element) => {
        element.style.display = '';
        element.style.flexShrink = '0';
      });
      cachedItemWidths.splice(0, cachedItemWidths.length, ...itemNodes.map(getElementWidth));
      itemNodes.forEach((element, index) => {
        element.style.display = savedDisplays[index];
        element.style.flexShrink = savedFlexShrinks[index];
      });

      let nextFoldIndex = -1;
      if (cachedItemWidths.reduce((sum, width) => sum + width, 0) > calcMenuWidth()) {
        const menuWidth = calcMenuWidth();
        const moreWidth = getMoreButtonWidth();
        let currentWidth = 0;
        for (let index = 0; index < itemNodes.length; index++) {
          if (currentWidth + cachedItemWidths[index] + moreWidth > menuWidth) {
            nextFoldIndex = index;
            break;
          }
          currentWidth += cachedItemWidths[index];
        }
        if (nextFoldIndex === -1 && currentWidth + moreWidth > menuWidth) {
          nextFoldIndex = itemNodes.length - 1;
        }
      }
      foldStartIndex.value = nextFoldIndex;
      applyFoldState();
    };

    useResizeObserver(innerRef, handleResize);
    watch(
      () => props.expandType,
      (value) => {
        nextTick(() => {
          if (value === 'popup') {
            handleResize();
          } else {
            foldStartIndex.value = -1;
            applyFoldState();
          }
        });
      },
    );
    watch(logoRef, (element) => {
      element?.querySelectorAll('img').forEach((image) => {
        if (!image.complete) image.addEventListener('load', handleResize, { once: true });
      });
    });

    let mutationObserver: MutationObserver;
    let resizeFrame: number;
    let isResizing = false;
    const safeHandleResize = () => {
      if (isResizing) return;
      applyFoldState();
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        isResizing = true;
        handleResize();
        requestAnimationFrame(() => {
          isResizing = false;
        });
      });
    };
    watch(menuRef, (element) => {
      mutationObserver?.disconnect();
      if (!element || typeof MutationObserver === 'undefined') return;
      mutationObserver = new MutationObserver(safeHandleResize);
      mutationObserver.observe(element, { childList: true, subtree: true });
      nextTick(handleResize);
    });
    onBeforeUnmount(() => {
      mutationObserver?.disconnect();
      cancelAnimationFrame(resizeFrame);
    });

    return {
      mode,
      menuClass,
      expandValues,
      activeValue,
      activeValues,
      submenu,
      handleTabChange,
      classPrefix,
      menuRef,
      innerRef,
      logoRef,
      operationRef,
      foldStartIndex,
    };
  },
  methods: {
    renderNormalSubmenu(node: VMenuData[], depth: number) {
      if (node.length === 0) return null;
      return (
        <ul class={[`${this.classPrefix}-head-menu__submenu`, `${this.classPrefix}-submenu`]}>
          {
            <Tabs value={this.activeValue} onChange={this.handleTabChange}>
              {/* 由于virtual child机制，这里通过vMenu getChild 会有两个相同的节点，故做此处理 */}
              {this.submenu.slice(0, this.submenu.length / 2).map((item) => (
                <TabPanel value={item.value} label={item.vnode[0].text}>
                  {item.children && item.children.length > 0
                    ? this.renderNormalSubmenu(item.children, depth + 1)
                    : null}
                </TabPanel>
              ))}
            </Tabs>
          }
        </ul>
      );
    },
  },
  render() {
    if (this.$slots.options) {
      console.warn('TDesign Warn: `options` slot is going to be deprecated, please use `operations` for slot instead.');
    }
    const operations = renderContent(this, 'operations', 'options');
    const logo = renderTNodeJSX(this, 'logo');
    const content = renderContent(this, 'default', 'content');
    const isFolded = this.foldStartIndex >= 0;
    const freshContent = isFolded ? renderContent(this, 'default', 'content') : [];
    const popupContent = (Array.isArray(freshContent) ? freshContent : [freshContent])
      .filter(Boolean)
      .map((vnode: VNode) => cloneVNodeTree(vnode));
    return (
      <div class={this.menuClass}>
        <div ref="innerRef" class={`${this.classPrefix}-head-menu__inner`}>
          {logo && (
            <div ref="logoRef" class={`${this.classPrefix}-menu__logo`}>
              {logo}
            </div>
          )}
          <ul ref="menuRef" class={`${this.classPrefix}-menu`}>
            {content}
            {this.mode === 'popup' && (
              <Submenu
                class={`${this.classPrefix}-head-menu__submenu--more`}
                value={MORE_SUBMENU_VALUE}
                title={() => <EllipsisIcon />}
                style={{ display: isFolded ? '' : 'none' }}
                disableVirtualChild
              >
                <PopupOverflowContent foldIndex={this.foldStartIndex}>{popupContent}</PopupOverflowContent>
              </Submenu>
            )}
          </ul>
          {operations && (
            <div ref="operationRef" class={`${this.classPrefix}-menu__operations`}>
              {operations}
            </div>
          )}
        </div>
        {this.mode === 'normal' && this.renderNormalSubmenu(this.submenu, 1)}
      </div>
    );
  },
});
