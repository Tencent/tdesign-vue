// Vue 2.7 内置 composition API，vitest 在 2.7 下把 `@vue/composition-api` 指向本文件，
// 让源码里保留的旧导入无需改写即可工作（2.6 仍走真实的 composition-api 插件）。
// 走 Vue 的 ESM 入口，具名导出与 @vue/composition-api 保持一致。
import * as VueModule from 'vue';

export * from 'vue';

// 2.6 的类型里没有这些具名导出，运行时只在 2.7 下通过别名加载本文件。
const rawDefineComponent = (VueModule as any).defineComponent;
const getRawInstance = (VueModule as any).getCurrentInstance;

// 2.6 的 setup context 带 refs / listeners，2.7 移除了它们；在 defineComponent
// 包装层补回，源码无需改动即可继续用 ctx.refs / listeners。
export function defineComponent(options: any) {
  if (!options || typeof options.setup !== 'function') {
    return rawDefineComponent(options);
  }
  const originalSetup = options.setup;
  return rawDefineComponent({
    ...options,
    setup(props: any, ctx: any) {
      const raw = getRawInstance();
      const proxy = raw?.proxy;
      const augmented = { ...ctx };
      Object.defineProperties(augmented, {
        refs: { get: () => proxy?.$refs || {} },
        listeners: { get: () => proxy?.$listeners || {} },
      });
      return originalSetup(props, augmented);
    },
  });
}

// @vue/composition-api 暴露的内部实例形状与 Vue 2.7 内建的不同（vnode / slots /
// setupContext / parent）。这里做一层适配，使源码在 2.7 下无需修改即可沿用 2.6 写法。
function adaptInstance(raw: any): any {
  if (!raw) return raw;
  const proxy = raw.proxy || raw;
  const vnode = raw.vnode || proxy.$vnode;
  const scopedSlots = proxy.$scopedSlots || {};
  // 2.6 的 instance.slots 对应普通插槽（数组），setupContext.slots 对应作用域插槽（函数）。
  // 2.7 的 VNode 上多了 componentInstance，源码里用它比对 uid 时会误判，这里屏蔽掉。
  const slots: any = {};
  Object.keys(proxy.$slots || {}).forEach((key) => {
    slots[key] = (proxy.$slots[key] || []).map((node: any) => {
      if (!node?.componentInstance) return node;
      return new Proxy(node, {
        get(target, prop) {
          return prop === 'componentInstance' ? undefined : Reflect.get(target, prop);
        },
      });
    });
  });
  const rawParent = raw.parent || proxy.$parent;

  return {
    ...raw,
    proxy,
    // 2.6 的 instance.uid 与插槽 VNode 的 _uid 不适用；2.7 下用独立值避免误判。
    uid: Symbol('compat-uid'),
    emit: raw.emit || proxy.$emit?.bind(proxy),
    vnode: vnode?.componentOptions ? vnode : proxy.$vnode,
    slots,
    props: raw.props || proxy.$props,
    refs: raw.refs || proxy.$refs,
    setupContext: raw.setupContext || {
      slots: scopedSlots,
      attrs: proxy.$attrs,
      listeners: proxy.$listeners,
      emit: proxy.$emit?.bind(proxy),
      expose() {},
    },
    parent: rawParent ? adaptInstance(rawParent) : null,
  };
}

export function getCurrentInstance() {
  return adaptInstance(getRawInstance());
}

// 兼容 `import VueCompositionAPI from '@vue/composition-api'` 的旧写法，
// 默认导出一个空插件，使 `Vue.use(VueCompositionAPI)` 安全无副作用。
export default {
  install() {},
} as any;
