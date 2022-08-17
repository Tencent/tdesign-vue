import Vue, { VueConstructor } from 'vue';
import props from './props';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';
import { AvatarGroupInstance } from './instance';
import { Styles } from '../common';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('avatar');

export interface AvatarInstance extends Vue {
  avatarGroup: AvatarGroupInstance;
}

export default mixins(Vue as VueConstructor<AvatarInstance>, classPrefixMixins).extend({
  name: 'TAvatar',

  props: {
    ...props,
  },
  data() {
    return {
      isImgExist: true,
      gap: 4,
      sizeValue: '',
      scale: '',
    };
  },
  inject: {
    avatarGroup: {
      default: undefined,
    },
  },
  computed: {
    customAvatarSize(): Styles {
      return this.isCustomSize()
        ? {
          width: this.sizeValue,
          height: this.sizeValue,
          'font-size': `${Number.parseInt(this.sizeValue, 10) / 2}px`,
        }
        : {};
    },
    customImageSize(): Styles {
      return this.isCustomSize()
        ? {
          height: this.sizeValue,
          width: this.sizeValue,
        }
        : {};
    },
    customCharacterSize(): Styles {
      return {
        transform: this.scale,
      };
    },
  },

  mounted() {
    const { avatarGroup } = this;
    this.sizeValue = this.size || avatarGroup?.size;
    this.$nextTick(() => {
      this.setScaleParams();
    });
  },

  methods: {
    handleImgLoadError() {
      const { onError, hideOnLoadFailed } = this.$props;
      this.isImgExist = !hideOnLoadFailed;
      onError && onError();
      this.$emit('error');
    },
    setScaleParams() {
      const avatar = this.$refs.avatar as HTMLElement;
      const avatarChild = this.$refs.avatarChild as HTMLElement;
      const avatarWidth = avatar?.offsetWidth;
      const avatarChildWidth = avatarChild?.offsetWidth;
      if (this.gap * 2 < avatarWidth) {
        this.scale = avatarChildWidth > avatarWidth - this.gap * 2
          ? `scale(${(avatarWidth - this.gap * 2) / avatarChildWidth})`
          : 'scale(1)';
      }
    },
    isCustomSize() {
      return this.sizeValue && !this.commonSizeClassName[this.sizeValue];
    },
  },
  updated() {
    this.$nextTick(() => {
      this.setScaleParams();
    });
  },
  render() {
    let content = renderContent(this, 'default', 'content');
    const icon = renderTNodeJSX(this, 'icon');
    const isIconOnly = icon && !content;
    const { shape, image, alt } = this.$props;
    const avatarClass = [
      this.componentName,
      this.commonSizeClassName[this.sizeValue],
      {
        [`${this.componentName}--circle`]: shape === 'circle',
        [`${this.componentName}--round`]: shape === 'round',
        [`${this.componentName}__icon`]: !!isIconOnly,
      },
    ];
    content = (
      <span ref="avatarChild" style={{ ...this.customCharacterSize }}>
        {content}
      </span>
    );
    if (icon) {
      content = [icon, !isIconOnly ? content : ''];
    }

    if (image && this.isImgExist) {
      content = <img style={{ ...this.customImageSize }} src={image} alt={alt} onError={this.handleImgLoadError}></img>;
    }
    return (
      <div ref="avatar" class={avatarClass} style={{ ...this.customAvatarSize }}>
        {content}
      </div>
    );
  },
});
