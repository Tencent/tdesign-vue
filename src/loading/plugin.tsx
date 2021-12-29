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
      loading.$el.parentNode.removeChild(loading.$el);
    },
  };

  return loadingInstance;
}

function produceLoading(props: boolean | TdLoadingProps): LoadingInstance {
  // 全屏加载
  if (props === true) {
    fullScreenLoadingInstance = createLoading({
      fullscreen: true,
      loading: true,
      attach: 'body',
    });
    return fullScreenLoadingInstance;
  }
  if (props === false) {
    // 销毁全屏实例
    removeClass(document.body, lockClass);
    fullScreenLoadingInstance.hide();
    fullScreenLoadingInstance = null;
    return;
  }
  return createLoading(props);
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
