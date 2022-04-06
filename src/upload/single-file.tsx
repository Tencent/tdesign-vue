import Vue, { PropType } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import { CloseCircleFilledIcon, ErrorCircleFilledIcon, CheckCircleFilledIcon } from 'tdesign-icons-vue';
import Loading from '../loading';
import { prefix } from '../config';
import { UploadFile } from './type';
import { ClassName } from '../common';
import { abridgeName } from '../_common/js/upload/utils';
import { renderTNodeJSX } from '../utils/render-tnode';
import props from './props';

const uploadName = `${prefix}-upload`;

export default Vue.extend({
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
      return [`${prefix}-input__inner`, { [`${uploadName}__placeholder`]: !this.inputName }];
    },
    classes(): ClassName {
      return [`${uploadName}__single`, `${uploadName}__single-${this.display}`];
    },
  },

  methods: {
    renderProgress() {
      if (this.loadingFile.status === 'fail') {
        return <ErrorCircleFilledIcon />;
      }
      if (this.showUploadProgress) {
        return (
          <div class={`${uploadName}__single-progress`}>
            <Loading />
            <span class={`${uploadName}__single-percent`}>{Math.min(this.loadingFile.percent, 99)}%</span>
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
        <div class={[`${uploadName}__single-display-text`, `${uploadName}__display-text--margin`]}>
          {fileListDisplay || <span class={`${uploadName}__single-name`}>{this.inputName}</span>}
          {this.showProgress ? (
            this.renderProgress()
          ) : (
            <CloseCircleFilledIcon
              class={`${uploadName}__icon-delete`}
              nativeOnClick={(e: MouseEvent) => this.remove(e)}
            />
          )}
        </div>
      );
    },
    // 输入框型预览
    renderFilePreviewAsInput() {
      return (
        <div class={`${uploadName}__single-input-preview ${prefix}-input`}>
          <div class={this.inputTextClass}>
            {<span class={`${uploadName}__single-input-text`}>{abridgeName(this.inputText, 4, 6)}</span>}
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
          <span class={`${uploadName}__single-input-delete`} onClick={(e: MouseEvent) => this.remove(e)}>
            删除
          </span>
        )}
      </div>
    );
  },
});
