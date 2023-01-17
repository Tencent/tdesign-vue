import Vue, { VueConstructor } from 'vue';
import props from './props';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';
import { AvatarGroupInstance } from './instance';
import { Styles } from '../common';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import Image from '../image';
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
      scale: '',
    };
  },
  inject: {
    avatarGroup: {
      default: undefined,
    },
  },
  computed: {
    // 即使 Vue2 的 inject 非响应式，但放在 computed 中依然正常响应
    sizeValue(): string {
      return this.size || this.avatarGroup?.size;
    },
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
    this.$nextTick(() => {
      this.setScaleParams();
    });
  },

  methods: {
    handleImgLoadError(context: { e: Event }) {
      const { onError, hideOnLoadFailed } = this;
      this.isImgExist = !hideOnLoadFailed;
      this.$emit('error', context);
      onError && onError(context);
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
      content = (
        <Image
          style={{ ...this.customImageSize }}
          src={image}
          alt={alt}
          props={this.imageProps}
          error={!this.$scopedSlots.error && !this.imageProps?.error ? ' ' : undefined}
          loading={!this.$scopedSlots.loading && !this.imageProps?.loading ? ' ' : undefined}
          scopedSlots={this.$scopedSlots}
          on={{
            error: this.handleImgLoadError,
          }}
        ></Image>
      );
    }
    return (
      <div ref="avatar" class={avatarClass} style={this.customAvatarSize}>
        {content}
      </div>
    );
  },
});
