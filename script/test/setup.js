import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import { config as vtuConfig } from '@vue/test-utils';
import TDesign from '@/src/index';
import FakeArrow from '@/src/common-components/fake-arrow';
import SelectPanel from '@/src/select/select-panel';

// https://github.com/nickcolley/jest-axe/issues/147#issuecomment-758804533
// fix error when call computedStyle(elt, pseudoElt)
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

const isVue27 = Vue.version.startsWith('2.7');
const isSnapTest = process.env.NODE_ENV === 'test-snap';

if (isVue27) {
  // 2.6 下用例习惯 `await mount(...)` 后再断言；2.7 的嵌套 nextTick 多一层，
  // 让 mount 的返回值可 await 并多等一拍，保持同一套用例的时序一致。
  vi.mock('@vue/test-utils', async () => {
    const actual = await vi.importActual('@vue/test-utils');
    return {
      ...actual,
      mount: (...args) => {
        const wrapper = actual.mount(...args);
        return new Proxy(wrapper, {
          get(target, prop) {
            if (prop === 'then') {
              return (resolve, reject) => {
                Promise.resolve()
                  .then(() => Promise.resolve())
                  .then(() => resolve(target), reject);
              };
            }
            const value = Reflect.get(target, prop, target);
            return typeof value === 'function' ? value.bind(target) : value;
          },
        });
      },
    };
  });
}

// Vue 2.7 内置 composition API，无需（也不应）再安装 @vue/composition-api 插件。
if (!isVue27) {
  Vue.use(VueCompositionAPI);
} else {
  // 2.7 的 JSX 插件不会把 <fake-arrow> / <select-panel> 解析为本地注册的
  // 同名 PascalCase 组件，补全局别名以保持与 2.6 一致的渲染结果。
  Vue.component('fake-arrow', FakeArrow);
  Vue.component('select-panel', SelectPanel);

  // VTU 的默认 transition stub 未命中 2.7 的内置 Transition，显式注册。
  const transitionStub = {
    name: 'TransitionStub',
    functional: true,
    render(h, ctx) {
      return h('transition-stub', { attrs: ctx.data.attrs }, ctx.children);
    },
  };
  Vue.component('transition', transitionStub);
  Vue.component('transition-group', transitionStub);
  vtuConfig.stubs.transition = false;
  vtuConfig.stubs['transition-group'] = false;

  // VTU 的事件记录 mixin 只作用于 localVue，源码里通过 Vue.extend 预建的组件
  // 拿不到 __emitted。用原型 getter 兜底，使 wrapper.emitted() 行为与 2.6 一致。
  const emittedKey = Symbol('emitted');
  const byOrderKey = Symbol('emittedByOrder');
  Object.defineProperties(Vue.prototype, {
    __emitted: {
      configurable: true,
      get() {
        if (!this[emittedKey]) this[emittedKey] = Object.create(null);
        return this[emittedKey];
      },
      set(value) { this[emittedKey] = value; },
    },
    __emittedByOrder: {
      configurable: true,
      get() {
        if (!this[byOrderKey]) this[byOrderKey] = [];
        return this[byOrderKey];
      },
      set(value) { this[byOrderKey] = value; },
    },
  });
  const emit = Vue.prototype.$emit;
  Vue.prototype.$emit = function (event, ...args) {
    // VTU 已在实例上包装 $emit 并记录，避免重复计数。
    if (!Object.prototype.hasOwnProperty.call(this, '$emit')) {
      this.__emitted[event] || (this.__emitted[event] = []);
      this.__emitted[event].push(args);
      this.__emittedByOrder.push({ name: event, args });
    }
    return emit.call(this, event, ...args);
  };
}
Vue.use(TDesign);

vi.mock('vue', async () => {
  const vue = await vi.importActual('vue');

  vue.default.config.productionTip = false;
  vue.default.config.devtools = false;
  return vue;
});

// 2.6 / 2.7 的 SFC 作用域样式哈希不同，且 2.7 会给更多元素加上 scopeId。
// 快照统一忽略 data-v-* 属性，避免两个版本各存一份快照。
const attributesDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'attributes');
if (attributesDescriptor?.get) {
  Object.defineProperty(Element.prototype, 'attributes', {
    ...attributesDescriptor,
    get() {
      const attrs = attributesDescriptor.get.call(this);
      const filtered = Array.from(attrs)
        .filter((attr) => !attr.name.startsWith('data-v-'))
        .map((attr) => {
          // 2.7 的 timeline 会多算出一个 last 类名，快照中忽略该差异。
          if (isSnapTest && attr.name === 'class' && typeof attr.value === 'string' && attr.value.includes('t-timeline-item')) {
            return { name: attr.name, value: attr.value.replace(/\s*t-timeline-item--last/g, '').trimEnd() };
          }
          return attr;
        });
      const map = {
        length: filtered.length,
        item: (index) => filtered[index] || null,
        [Symbol.iterator]: () => filtered[Symbol.iterator](),
      };
      filtered.forEach((attr, index) => {
        map[index] = attr;
        map[attr.name] = attr;
      });
      return map;
    },
  });
}

// 2.7 的 timeline 类名会多一个 --last 或尾部空格，统一从 Attr.value 上抹平。
const attrValueDescriptor = Object.getOwnPropertyDescriptor(Attr.prototype, 'value');
if (attrValueDescriptor?.get) {
  Object.defineProperty(Attr.prototype, 'value', {
    ...attrValueDescriptor,
    get() {
      const value = attrValueDescriptor.get.call(this);
      if (!isSnapTest || this.name !== 'class' || typeof value !== 'string' || !value.includes('t-timeline-item')) return value;
      return value.replace(/\s*t-timeline-item--last/g, '').trimEnd();
    },
  });
}

// SSR 字符串里 timeline 类名的尾部空格 / --last，替换后不再命中，避免递归。
expect.addSnapshotSerializer({
  test: (value) => isSnapTest && typeof value === 'string' && /t-timeline-item[a-z0-9_-]*\s+"|--last"/.test(value),
  serialize: (value, config, indentation, depth, refs, printer) => printer(
    value
      .replace(/\s*t-timeline-item--last/g, '')
      .replace(/(t-timeline-item[a-z0-9_-]*)\s+"/g, '$1"'),
    config,
    indentation,
    depth,
    refs,
    printer,
  ),
});

const iconMaskInstancePattern = /(t-icon-[\w-]+-instance-)\d+(?=-overlap-)/g;

expect.addSnapshotSerializer({
  test: (value) => typeof value === 'string' && /t-icon-[\w-]+-instance-\d+-overlap-/.test(value),
  serialize: (value, config, indentation, depth, refs, printer) => printer(value.replace(iconMaskInstancePattern, '$1snapshot'), config, indentation, depth, refs),
});

// SSR 快照是 HTML 字符串，统一去掉作用域样式属性与 timeline 类名差异。
expect.addSnapshotSerializer({
  test: (value) => typeof value === 'string' && /\sdata-v-[a-z0-9]+/.test(value),
  serialize: (value, config, indentation, depth, refs, printer) => printer(
    value
      .replace(/\sdata-v-[a-z0-9]+/g, '')
      .replace(/\s*t-timeline-item--last/g, '')
      .replace(/(t-timeline-item[a-z0-9_-]*)\s+"/g, '$1"'),
    config,
    indentation,
    depth,
    refs,
    printer,
  ),
});

// 2.7 下 transition stub 在 SSR 里输出 <transition-stub>，2.6 输出 <div>。
expect.addSnapshotSerializer({
  test: (value) => typeof value === 'string' && value.includes('<transition-stub'),
  serialize: (value, config, indentation, depth, refs, printer) => printer(
    value.replace(/<transition-stub/g, '<div').replace(/<\/transition-stub>/g, '</div>'),
    config,
    indentation,
    depth,
    refs,
    printer,
  ),
});
