import Vue, { PropType } from 'vue';
import { AddIcon, DeleteIcon, BrowseIcon } from 'tdesign-icons-vue';
import { UploadFile } from './type';
import TLoading from '../loading';
import { UploadRemoveOptions } from './interface';
import { UPLOAD_NAME } from './util';
import props from './props';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { UploadConfig } from '../config-provider/config-receiver';

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
      <ul class={`${UPLOAD_NAME}__card`}>
        {this.files
          && this.files.map((file, index) => (
            <li class={`${UPLOAD_NAME}__card-item ${prefix}-is--background`}>
              <div class={`${UPLOAD_NAME}__card-content ${UPLOAD_NAME}__card-box`}>
                <img class={`${UPLOAD_NAME}__card-image`} src={file.url} />
                <div class={`${UPLOAD_NAME}__card-mask`} onClick={this.onMaskClick}>
                  <span class={`${UPLOAD_NAME}__card-mask-item`} onClick={(e: MouseEvent) => e.stopPropagation()}>
                    <BrowseIcon nativeOnClick={(e: MouseEvent) => this.onViewClick(e, file)} />
                  </span>
                  {!this.disabled && [
                    <span class={`${UPLOAD_NAME}__card-mask-item-divider`} key="divider"></span>,
                    <span
                      class={`${UPLOAD_NAME}__card-mask-item`}
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
              `${UPLOAD_NAME}__card-item ${prefix}-is--background`,
              {
                [CLASSNAMES.STATUS.disabled]: this.disabled,
              },
            ]}
            onClick={this.trigger}
          >
            {this.showUploadProgress && this.loadingFile && this.loadingFile.status === 'progress' ? (
              <div class={`${UPLOAD_NAME}__card-container ${UPLOAD_NAME}__card-box`}>
                <TLoading />
                <p>
                  {this.global.progress.uploadingText} {Math.min(this.loadingFile.percent, 99)}%
                </p>
              </div>
            ) : (
              <div class={`${UPLOAD_NAME}__card-container ${UPLOAD_NAME}__card-box`}>
                <AddIcon></AddIcon>
                <p class={`${prefix}-size-s`}>{this.global.triggerUploadText.image}</p>
              </div>
            )}
          </li>
        )}
      </ul>
    );
  },
});
