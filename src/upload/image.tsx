import Vue, { PropType } from 'vue';
import { AddIcon, DeleteIcon, BrowseIcon } from 'tdesign-icons-vue';
import { UploadFile } from './type';
import TLoading from '../loading';
import { UploadRemoveOptions } from './interface';
import props from './props';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { UploadConfig } from '../config-provider/config-receiver';

export const uploadName = `${prefix}-upload`;

export default mixins(getConfigReceiverMixins<Vue, UploadConfig>('upload')).extend({
  name: 'TImageUpload',

  components: {
    AddIcon,
    DeleteIcon,
    BrowseIcon,
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
    return (
      <ul class={`${uploadName}__card`}>
        {this.files
          && this.files.map((file, index) => (
            <li class={`${uploadName}__card-item ${prefix}-is--background`}>
              <div class={`${uploadName}__card-content ${uploadName}__card-box`}>
                <img class={`${uploadName}__card-image`} src={file.url} />
                <div class={`${uploadName}__card-mask`} onClick={this.onMaskClick}>
                  <span class={`${uploadName}__card-mask-item`} onClick={(e: MouseEvent) => e.stopPropagation()}>
                    <BrowseIcon nativeOnClick={(e: MouseEvent) => this.onViewClick(e, file)} />
                  </span>
                  {!this.disabled && [
                    <span class={`${uploadName}__card-mask-item-divider`} key="divider"></span>,
                    <span
                      class={`${uploadName}__card-mask-item`}
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
              `${uploadName}__card-item ${prefix}-is--background`,
              {
                [CLASSNAMES.STATUS.disabled]: this.disabled,
              },
            ]}
            onClick={this.trigger}
          >
            {this.showUploadProgress && this.loadingFile && this.loadingFile.status === 'progress' ? (
              <div class={`${uploadName}__card-container ${uploadName}__card-box`}>
                <TLoading />
                <p>
                  {this.global.progress.uploadingText} {Math.min(this.loadingFile.percent, 99)}%
                </p>
              </div>
            ) : (
              <div class={`${uploadName}__card-container ${uploadName}__card-box`}>
                <AddIcon></AddIcon>
                <p class={`${prefix}-size-s`}>
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
