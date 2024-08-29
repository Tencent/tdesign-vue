import {
  computed, defineComponent, h, toRefs,
} from '@vue/composition-api';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import type { TNode } from '@src/common';
import { useConfig, usePrefixClass } from '../config-provider/useConfig';
import { useCommonClassName } from '../hooks/useConfig';

import props from './props';
import Image from '../image';
import { renderTNodeJSX } from '../utils/render-tnode';
import MaintenanceSvg from './assets/MaintenanceSvg';
import NetworkErrorSvg from './assets/NetworkErrorSvg';
import EmptySvg from './assets/EmptySvg';
import FailSvg from './assets/FailSvg';
import SuccessSvg from './assets/SuccessSvg';

import type { TdEmptyProps } from './type';

export default defineComponent({
  name: 'TEmpty',
  components: { TImage: Image },
  props,
  setup(props: TdEmptyProps, { slots }) {
    const {
      size, image: propsImage, description: propsDescription, title: propsTitle, type,
    } = toRefs(props);
    const { globalConfig } = useConfig('empty');
    const componentName = usePrefixClass('empty');
    const showAction = computed(() => props.action || slots.action);
    const { SIZE } = useCommonClassName();
    const defaultMaps: {
      [key in TdEmptyProps['type']]?: Pick<TdEmptyProps, 'image' | 'title'>;
    } = {
      maintenance: {
        image: globalConfig.value.image.maintenance || (MaintenanceSvg as unknown as TNode),
        title: globalConfig.value.titleText.maintenance,
      },
      success: {
        image: globalConfig.value.image.success || (SuccessSvg as unknown as TNode),
        title: globalConfig.value.titleText.success,
      },
      fail: {
        image: globalConfig.value.image.fail || (FailSvg as unknown as TNode),
        title: globalConfig.value.titleText.fail,
      },
      'network-error': {
        image: globalConfig.value.image.networkError || (NetworkErrorSvg as unknown as TNode),
        title: globalConfig.value.titleText.networkError,
      },
      empty: {
        image: globalConfig.value.image.empty || (EmptySvg as unknown as TNode),
        title: globalConfig.value.titleText.empty,
      },
    };

    const emptyClasses = computed(() => [componentName.value, SIZE.value[size.value]]);
    const titleClasses = [`${componentName.value}__title`];
    const imageClasses = [`${componentName.value}__image`];
    const descriptionClasses = [`${componentName.value}__description`];
    const actionClass = [`${componentName.value}__action`];

    const typeImageProps = computed(() => defaultMaps[type.value] ?? null);
    const showImage = computed(() => propsImage.value || typeImageProps.value?.image || slots.image);
    const showTitle = computed(() => propsTitle.value || typeImageProps.value?.title || slots.title);
    const showDescription = computed(() => propsDescription.value || slots.description);

    return {
      emptyClasses,
      imageClasses,
      titleClasses,
      descriptionClasses,
      actionClass,
      showImage,
      showTitle,
      showDescription,
      showAction,
    };
  },
  methods: {
    renderTitle() {
      if (!this.showTitle) {
        return null;
      }
      return <div class={this.titleClasses}>{this.showTitle}</div>;
    },
    renderDescription() {
      if (!this.showDescription) {
        return null;
      }
      return <div class={this.descriptionClasses}>{this.showDescription}</div>;
    },
    getImageIns() {
      const data = this.showImage;
      let result = null;
      if (data && Reflect.has(data as TNode, 'render')) {
        result = h(data as unknown);
      } else if (isObject(data)) {
        result = <t-image {...data} />;
      } else if (isString(data)) {
        result = <t-image src={data} />;
      }

      return data ? result : null;
    },
  },
  render() {
    return (
      <div class={this.emptyClasses}>
        {this.showImage ? (
          <div class={this.imageClasses} style={this.imageStyle}>
            {this.getImageIns()}
          </div>
        ) : null}
        {this.renderTitle()}
        {this.renderDescription()}
        {this.showAction ? <div class={this.actionClass}>{renderTNodeJSX(this, 'action')}</div> : null}
      </div>
    );
  },
});
