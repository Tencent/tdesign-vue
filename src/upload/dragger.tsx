import Vue, { PropType, VNode } from 'vue';
import {
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-vue';
import { UploadFile } from './type';
import TLoading from '../loading';
import TButton from '../button';
import { returnFileSize, getCurrentDate, abridgeName } from '../_common/js/upload/utils';
import { ClassName } from '../common';
import props from './props';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { UploadConfig, getGlobalIconMixins } from '../config-provider/config-receiver';

export default mixins(getConfigReceiverMixins<Vue, UploadConfig>('upload'), getGlobalIconMixins()).extend({
  name: 'TUploadDragger',

  components: {
    TLoading,
    TButton,
  },

  props: {
    showUploadProgress: props.showUploadProgress,
    file: {
      type: Object as PropType<UploadFile>,
    },
    loadingFile: {
      type: Object as PropType<UploadFile>,
    },
    display: {
      type: String as PropType<'file' | 'file-input' | 'image' | 'custom'>,
      validator(val: string) {
        return ['file', 'file-input', 'image', 'custom'].includes(val);
      },
    },
    cancel: Function as PropType<(e: MouseEvent) => void>,
    trigger: Function as PropType<(e: MouseEvent) => void>,
    remove: Function as PropType<({ e, file }: { e: MouseEvent; file: UploadFile }) => void>,
    upload: Function as PropType<(file: UploadFile, e: MouseEvent) => void>,
    autoUpload: Boolean,
    locale: props.locale,
  },

  data() {
    return {
      target: null,
      dragActive: false,
    };
  },

  computed: {
    isImage(): boolean {
      return this.display === 'image';
    },
    imageUrl(): string {
      return (this.loadingFile && this.loadingFile.url) || (this.file && this.file.url);
    },
    percent(): number {
      return this.loadingFile && this.loadingFile.percent;
    },
    inputName(): string {
      return (this.loadingFile && this.loadingFile.name) || (this.file && this.file.name);
    },
    classes(): ClassName {
      return [
        `${this.componentName}__dragger`,
        { [`${this.componentName}__dragger-center`]: !this.loadingFile && !this.file },
        { [`${this.componentName}__dragger-error`]: this.loadingFile && this.loadingFile.status === 'fail' },
      ];
    },
    size(): number {
      return (this.loadingFile && this.loadingFile.size) || (this.file && this.file.size);
    },
    // 上传失败或者上传成功会显示
    showResultOperate(): boolean {
      return Boolean(!this.loadingFile && this.file?.name) || ['success', 'fail'].includes(this.loadingFile?.status);
    },
  },

  methods: {
    handleDrop(event: DragEvent) {
      event.preventDefault();
      this.$emit('change', event.dataTransfer.files);
      this.$emit('dragleave', event);
      this.dragActive = false;
    },

    handleDragenter(event: DragEvent) {
      this.target = event.target;
      event.preventDefault();
      this.$emit('dragenter', event);
      this.dragActive = true;
    },

    handleDragleave(event: DragEvent) {
      if (this.target !== event.target) return;
      event.preventDefault();
      this.$emit('dragleave', event);
      this.dragActive = false;
    },

    handleDragover(event: DragEvent) {
      event.preventDefault();
    },

    renderDefaultDragElement(): VNode {
      const unActiveElement = (
        <div>
          <span class={`${this.componentName}--highlight`}>
            {this.locale?.triggerUploadText?.normal || this.global.triggerUploadText.normal}
          </span>
          <span>&nbsp;&nbsp;/&nbsp;&nbsp;{this.locale?.dragger?.draggingText || this.global.dragger.draggingText}</span>
        </div>
      );
      const activeElement = <div>{this.locale?.dragger?.dragDropText || this.global.dragger.dragDropText}</div>;
      return this.dragActive ? activeElement : unActiveElement;
    },

    renderImage() {
      return (
        <div class={`${this.componentName}__dragger-img-wrap`}>
          {this.imageUrl && <img src={this.imageUrl || 'default.png'}></img>}
        </div>
      );
    },

    renderUploading() {
      if (this.loadingFile.status === 'fail') {
        const { ErrorCircleFilledIcon } = this.useGlobalIcon({
          ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
        });
        return <ErrorCircleFilledIcon />;
      }
      if (this.loadingFile.status === 'progress' && this.showUploadProgress) {
        return (
          <div class={`${this.componentName}__single-progress`}>
            <TLoading />
            <span class={`${this.componentName}__single-percent`}>{Math.min(this.loadingFile.percent, 99)}%</span>
          </div>
        );
      }
    },

    reUpload(e: MouseEvent) {
      e.stopPropagation();
      this.remove({ e, file: this.file });
      this.trigger(e);
    },

    renderProgress() {
      const { CheckCircleFilledIcon } = this.useGlobalIcon({
        CheckCircleFilledIcon: TdCheckCircleFilledIcon,
      });

      return (
        <div class={`${this.componentName}__dragger-progress`}>
          {this.isImage && this.renderImage()}
          <div class={`${this.componentName}__dragger-progress-info`}>
            <div class={`${this.componentName}__dragger-text`}>
              <span class={`${this.componentName}__single-name`}>{abridgeName(this.inputName)}</span>
              {this.loadingFile && this.renderUploading()}
              {!this.loadingFile && !!this.file && <CheckCircleFilledIcon />}
            </div>
            <small class={`${this.classPrefix}-size-s`}>
              {this.locale?.file?.fileSizeText || this.global.file.fileSizeText}：{returnFileSize(this.size)}
            </small>
            <small class={`${this.classPrefix}-size-s`}>
              {this.locale?.file?.fileOperationDateText || this.global.file.fileOperationDateText}：{getCurrentDate()}
            </small>
            <div class={`${this.componentName}__dragger-btns`}>
              {['progress', 'waiting'].includes(this.loadingFile?.status) && (
                <TButton
                  theme="primary"
                  variant="text"
                  class={`${this.componentName}__dragger-progress-cancel`}
                  onClick={(e: MouseEvent) => {
                    this.cancel?.(e);
                    e.stopPropagation();
                  }}
                >
                  {this.locale?.cancelUploadText || this.global.cancelUploadText}
                </TButton>
              )}
              {!this.autoUpload && this.loadingFile?.status === 'waiting' && (
                <TButton
                  theme="primary"
                  variant="text"
                  onClick={(e: MouseEvent) => {
                    this.upload({ ...this.loadingFile }, e);
                    e.stopPropagation();
                  }}
                >
                  {this.locale?.triggerUploadText?.normal || this.global.triggerUploadText.normal}
                </TButton>
              )}
            </div>
            {this.showResultOperate && (
              <div class={`${this.componentName}__dragger-btns`}>
                <TButton
                  theme="primary"
                  variant="text"
                  class={`${this.componentName}__dragger-progress-cancel`}
                  onClick={this.reUpload}
                >
                  {this.locale?.triggerUploadText?.reupload || this.global.triggerUploadText.reupload}
                </TButton>
                <TButton
                  theme="primary"
                  variant="text"
                  onClick={(e: MouseEvent) => {
                    this.remove?.({ e, file: this.file });
                    e.stopPropagation();
                  }}
                >
                  {this.locale?.triggerUploadText?.delete || this.global.triggerUploadText.delete}
                </TButton>
              </div>
            )}
          </div>
        </div>
      );
    },
  },

  render(): VNode {
    let content = null;
    if ((this.loadingFile || this.file) && this.display !== 'custom') {
      content = this.renderProgress();
    } else {
      content = (
        <div class={`${this.componentName}__trigger`} onClick={this.trigger}>
          {(this.$scopedSlots.default && this.$scopedSlots.default(null)) || this.renderDefaultDragElement()}
        </div>
      );
    }
    return (
      <div
        class={this.classes}
        onDrop={this.handleDrop}
        onDragenter={this.handleDragenter}
        onDragover={this.handleDragover}
        onDragleave={this.handleDragleave}
      >
        {content}
      </div>
    );
  },
});
