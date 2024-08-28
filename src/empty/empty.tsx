import { defineComponent, h, toRefs } from '@vue/composition-api';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import type { TNode } from '@src/common';
import { useConfig, usePrefixClass } from '../config-provider/useConfig';
import props from './props';
import type { TdEmptyProps } from './type';
import Image from '../image';
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
      size, image: propsImage, description: propsDescription, title: propsTitle, type, action,
    } = toRefs(props);
    const { t, globalConfig } = useConfig('empty');
    const classPrefix = usePrefixClass('empty');

    const defaultMaps: {
      [key in TdEmptyProps['type']]?: Pick<TdEmptyProps, 'image' | 'title'>;
    } = {
      maintenance: {
        image: globalConfig.value.image.maintenance || (MaintenanceSvg as unknown as TNode),
        title: globalConfig.value.titleText.maintenance || t(globalConfig.value.titleText.maintenance),
      },
      success: {
        image: globalConfig.value.image.success || (SuccessSvg as unknown as TNode),
        title: globalConfig.value.titleText.success || t(globalConfig.value.titleText.success),
      },
      fail: {
        image: globalConfig.value.image.fail || (FailSvg as unknown as TNode),
        title: globalConfig.value.titleText.fail || t(globalConfig.value.titleText.fail),
      },
      'network-error': {
        image: globalConfig.value.image.networkError || (NetworkErrorSvg as unknown as TNode),
        title: globalConfig.value.titleText.networkError || t(globalConfig.value.titleText.networkError),
      },
      empty: {
        image: globalConfig.value.image.empty || (EmptySvg as unknown as TNode),
        title: globalConfig.value.titleText.empty || t(globalConfig.value.titleText.empty),
      },
    };

    const defaultSize = {
      small: `${classPrefix.value}-size-s`,
      medium: `${classPrefix.value}-size`,
      large: `${classPrefix.value}-size-l`,
    };

    const emptyClasses = [classPrefix.value, defaultSize[size.value]];
    const titleClasses = [`${classPrefix.value}__title`];
    const imageClasses = [`${classPrefix.value}__image`];
    const descriptionClasses = [`${classPrefix.value}__description`];
    const actionClass = [`${classPrefix.value}__action`];

    const typeImageProps = defaultMaps[type.value] ?? null;

    const { image, description, title } = {
      image: propsImage.value || typeImageProps?.image || slots.image,
      title: propsTitle.value || typeImageProps?.title || slots.title,
      description: propsDescription.value || slots.description,
    };

    const showActions = action.value || slots.action;

    return {
      emptyClasses,
      imageClasses,
      titleClasses,
      descriptionClasses,
      actionClass,
      showActions,
      showImage: image,
      showTitle: title,
      showDescription: description,
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
    getImageIns(data: TdEmptyProps['image']) {
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
            {this.getImageIns(this.showImage)}
          </div>
        ) : null}
        {this.renderTitle()}
        {this.renderDescription()}
        {this.showActions ? <div class={this.actionClass}>{this.showActions}</div> : null}
      </div>
    );
  },
});
