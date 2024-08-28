import {
  computed, defineComponent, h, toRefs,
} from '@vue/composition-api';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import type { TNode } from '@src/common';
import { useConfig, usePrefixClass } from '../config-provider/useConfig';
import props from './props';
import type { TdEmptyProps } from './type';
import Image from '../image';
import { renderTNodeJSX } from '../utils/render-tnode';
import MaintenanceSvg from './assets/MaintenanceSvg';
import NetworkErrorSvg from './assets/NetworkErrorSvg';
import EmptySvg from './assets/EmptySvg';
import FailSvg from './assets/FailSvg';
import SuccessSvg from './assets/SuccessSvg';

export default defineComponent({
  name: 'TEmpty',
  components: { TImage: Image },
  props,
  setup(props: TdEmptyProps, { slots }) {
    const {
      size, image: propsImage, description: propsDescription, title: propsTitle, type,
    } = toRefs(props);
    const { globalConfig, classPrefix: tClassPrefix } = useConfig('empty');
    const classPrefix = usePrefixClass('empty');

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

    const defaultSize = {
      small: `${tClassPrefix.value}-size-s`,
      medium: `${tClassPrefix.value}-size`,
      large: `${tClassPrefix.value}-size-l`,
    };

    const emptyClasses = computed(() => [classPrefix.value, defaultSize[size.value]]);
    const titleClasses = [`${classPrefix.value}__title`];
    const imageClasses = [`${classPrefix.value}__image`];
    const descriptionClasses = [`${classPrefix.value}__description`];
    const actionClass = [`${classPrefix.value}__action`];

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
        result = <t-image {...(data as any)} />;
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
        {this.$slots?.action ? <div class={this.actionClass}>{renderTNodeJSX(this, 'action')}</div> : null}
      </div>
    );
  },
});
