import Vue, { PropType } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import { CloseCircleFilledIcon, ErrorCircleFilledIcon, CheckCircleFilledIcon } from 'tdesign-icons-vue';
import Loading from '../loading';
import { UploadFile } from './type';
import { ClassName } from '../common';
import { abridgeName } from '../_common/js/upload/utils';
import { renderTNodeJSX } from '../utils/render-tnode';
import props from './props';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { UploadConfig } from '../config-provider/config-receiver';

export default mixins(getConfigReceiverMixins<Vue, UploadConfig>('upload')).extend({
  name: 'TUploadSingleFile',

  components: {
    CloseCircleFilledIcon,
    ErrorCircleFilledIcon,
    CheckCircleFilledIcon,
    Loading,
  },

  data() {
    return {};
  },

  props: {
    showUploadProgress: props.showUploadProgress,
    file: Object as PropType<UploadFile>,
    loadingFile: Object as PropType<UploadFile>,
    remove: Function as PropType<(e: MouseEvent) => void>,
    placeholder: String,
    display: {
      type: String as PropType<'file' | 'file-input'>,
      validator(val: string) {
        return ['file', 'file-input'].includes(val);
      },
    },
  },

  computed: {
    percent(): number {
      return this.loadingFile && this.loadingFile.percent;
    },
    showPreview(): boolean {
      return Boolean(this.file && this.file.name);
    },
    showTextPreview(): boolean {
      return this.display === 'file';
    },
    showInput(): boolean {
      return this.display === 'file-input';
    },
    showProgress(): boolean {
      return !!(this.loadingFile && this.loadingFile.status === 'progress');
    },
    showDelete(): boolean {
      return this.file && this.file.name && !this.loadingFile;
    },
    inputName(): string {
      const fileName = this.file && this.file.name;
      const loadingName = this.loadingFile && this.loadingFile.name;
      return this.showProgress ? loadingName : fileName;
    },
    inputText(): string {
      return this.inputName || this.placeholder;
    },
    inputTextClass(): ClassName {
      return [`${this.classPrefix}-input__inner`, { [`${this.componentName}__placeholder`]: !this.inputName }];
    },
    classes(): ClassName {
      return [`${this.componentName}__single`, `${this.componentName}__single-${this.display}`];
    },
  },

  methods: {
    renderProgress() {
      if (this.loadingFile.status === 'fail') {
        return <ErrorCircleFilledIcon />;
      }
      if (this.showUploadProgress) {
        return (
          <div class={`${this.componentName}__single-progress`}>
            <Loading />
            <span class={`${this.componentName}__single-percent`}>{Math.min(this.loadingFile.percent, 99)}%</span>
          </div>
        );
      }
    },

    renderResult() {
      if (!!this.loadingFile && this.loadingFile.status === 'fail') {
        return <ErrorCircleFilledIcon />;
      }
      if (this.file && this.file.name && !this.loadingFile) {
        return <CheckCircleFilledIcon />;
      }
      return '';
    },
    // 文本型预览
    renderFilePreviewAsText() {
      if (!this.inputName) return;
      const fileListDisplay: ScopedSlotReturnValue = renderTNodeJSX(this, 'fileListDisplay');
      return (
        <div class={[`${this.componentName}__single-display-text`, `${this.componentName}__display-text--margin`]}>
          {fileListDisplay || <span class={`${this.componentName}__single-name`}>{this.inputName}</span>}
          {this.showProgress ? (
            this.renderProgress()
          ) : (
            <CloseCircleFilledIcon
              class={`${this.componentName}__icon-delete`}
              nativeOnClick={(e: MouseEvent) => this.remove(e)}
            />
          )}
        </div>
      );
    },
    // 输入框型预览
    renderFilePreviewAsInput() {
      return (
        <div class={`${this.componentName}__single-input-preview ${this.classPrefix}-input`}>
          <div class={this.inputTextClass}>
            {<span class={`${this.componentName}__single-input-text`}>{abridgeName(this.inputText, 4, 6)}</span>}
            {this.showProgress && this.renderProgress()}
            {this.renderResult()}
          </div>
        </div>
      );
    },
  },

  render() {
    return (
      <div class={this.classes}>
        {this.showInput && this.renderFilePreviewAsInput()}
        {this.$scopedSlots.default && this.$scopedSlots.default(null)}
        {this.showTextPreview && this.renderFilePreviewAsText()}
        {this.showInput && this.showDelete && (
          <span class={`${this.componentName}__single-input-delete`} onClick={(e: MouseEvent) => this.remove(e)}>
            删除
          </span>
        )}
      </div>
    );
  },
});
