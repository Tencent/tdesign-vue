import Vue from 'vue';
import LoadingComponent from './loading';
import { prefix } from '../config';
import { getAttach, removeClass } from '../utils/dom';
import { TdLoadingProps, LoadingInstance, LoadingMethod } from './type';

const lockClass = `${prefix}-loading--lock`;

let fullScreenLoadingInstance: LoadingInstance = null;

function createLoading(options: TdLoadingProps): LoadingInstance {
  const props = { ...options };
  const loading = new LoadingComponent({
    propsData: { ...props },
  }).$mount();

  const attach = getAttach(props.attach);
  if (attach) {
    attach.appendChild(loading.$el);
  } else {
    console.error('attach is not exist');
  }

  const loadingInstance: LoadingInstance = {
    hide: () => {
      loading.loading = false;
      loading.$el.parentNode?.removeChild(loading.$el);
    },
  };

  return loadingInstance;
}

function produceLoading(props: boolean | TdLoadingProps): LoadingInstance {
  const destroyLoadingInstance = () => {
    // 销毁全屏实例
    removeClass(document.body, lockClass);
    fullScreenLoadingInstance.hide();
    fullScreenLoadingInstance = null;
  };
  // 全屏加载
  if (props === true) {
    // 若存在已经创建的全屏实例则不需要再创建
    if (fullScreenLoadingInstance) return;
    fullScreenLoadingInstance = createLoading({
      fullscreen: true,
      loading: true,
      attach: 'body',
    });
    return fullScreenLoadingInstance;
  }
  // 存在全屏实例时才执行销毁动作
  if (props === false && fullScreenLoadingInstance) {
    // 销毁全屏实例
    destroyLoadingInstance();
    return;
  }
  return createLoading(props as TdLoadingProps);
}

export type LoadingPluginType = Vue.PluginObject<undefined> & LoadingMethod;

export const LoadingPlugin: LoadingPluginType = produceLoading as LoadingPluginType;

LoadingPlugin.install = () => {
  // 这样定义后，可以通过 this.$loading 调用插件
  Vue.prototype.$loading = produceLoading;
};

export default LoadingPlugin;

declare module 'vue/types/vue' {
  // Bind to `this` keyword
  interface Vue {
    $loading: LoadingMethod;
  }
}
