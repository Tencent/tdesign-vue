import Vue, { PropType } from 'vue';
import { AddIcon as TdAddIcon, DeleteIcon as TdDeleteIcon, BrowseIcon as TdBrowseIcon } from 'tdesign-icons-vue';
import { UploadFile } from './type';
import TLoading from '../loading';
import { UploadRemoveOptions } from './interface';
import props from './props';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { UploadConfig, getGlobalIconMixins } from '../config-provider/config-receiver';

export default mixins(getConfigReceiverMixins<Vue, UploadConfig>('upload'), getGlobalIconMixins()).extend({
  name: 'TImageUpload',

  components: {
    TLoading,
  },
  props: {
    showUploadProgress: props.showUploadProgress,
    files: {
      type: Array as PropType<Array<UploadFile>>,
    },
    loadingFile: {
      type: Object as PropType<UploadFile>,
    },
    trigger: {
      type: Function as PropType<(e: MouseEvent) => void>,
    },
    remove: {
      type: Function as PropType<(options: UploadRemoveOptions) => void>,
    },
    multiple: Boolean,
    max: Number,
    disabled: Boolean,
    locale: Object,
  },

  computed: {
    showTrigger(): boolean {
      if (this.multiple) {
        return !this.max || this.files.length < this.max;
      }
      return !(this.files && this.files[0]);
    },
  },

  methods: {
    onMaskClick(e: MouseEvent) {
      !this.showTrigger && this.trigger(e);
    },
    onViewClick(e: MouseEvent, file?: UploadFile) {
      this.$emit('imgPreview', e, file);
    },
  },

  render() {
    const { AddIcon, DeleteIcon, BrowseIcon } = this.useGlobalIcon({
      AddIcon: TdAddIcon,
      DeleteIcon: TdDeleteIcon,
      BrowseIcon: TdBrowseIcon,
    });

    return (
      <ul class={`${this.componentName}__card`}>
        {this.files
          && this.files.map((file, index) => (
            <li class={`${this.componentName}__card-item ${this.classPrefix}-is--background`}>
              <div class={`${this.componentName}__card-content ${this.componentName}__card-box`}>
                <img class={`${this.componentName}__card-image`} src={file.url} />
                <div class={`${this.componentName}__card-mask`} onClick={this.onMaskClick}>
                  <span
                    class={`${this.componentName}__card-mask-item`}
                    onClick={(e: MouseEvent) => e.stopPropagation()}
                  >
                    <BrowseIcon nativeOnClick={(e: MouseEvent) => this.onViewClick(e, file)} />
                  </span>
                  {!this.disabled && [
                    <span class={`${this.componentName}__card-mask-item-divider`} key="divider"></span>,
                    <span
                      class={`${this.componentName}__card-mask-item`}
                      onClick={(e: MouseEvent) => e.stopPropagation()}
                      key="delete-icon"
                    >
                      <DeleteIcon nativeOnClick={(e: MouseEvent) => this.remove({ e, file, index })} />
                    </span>,
                  ]}
                </div>
              </div>
            </li>
          ))}
        {this.showTrigger && (
          <li
            class={[
              `${this.componentName}__card-item`,
              `${this.classPrefix}-is--background`,
              {
                [this.commonStatusClassName.disabled]: this.disabled,
              },
            ]}
            onClick={this.trigger}
          >
            {this.showUploadProgress && this.loadingFile && this.loadingFile.status === 'progress' ? (
              <div class={`${this.componentName}__card-container ${this.componentName}__card-box`}>
                <TLoading />
                <p>
                  {this.locale?.progress?.uploadingText || this.global.progress.uploadingText}{' '}
                  {Math.min(this.loadingFile.percent, 99)}%
                </p>
              </div>
            ) : (
              <div class={`${this.componentName}__card-container ${this.componentName}__card-box`}>
                <AddIcon></AddIcon>
                <p class={`${this.classPrefix}-size-s`}>
                  {this.locale?.triggerUploadText?.image || this.global.triggerUploadText.image}
                </p>
              </div>
            )}
          </li>
        )}
      </ul>
    );
  },
});
