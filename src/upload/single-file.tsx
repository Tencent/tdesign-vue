import Vue, { PropType } from 'vue';
import TIconClearCircleFilled from '../icon/clear-circle-filled';
import TIconLoading from '../icon/loading';
import { UploadFile } from '../../types/upload/TdUploadProps';

export default Vue.extend({
  name: 'TUploadSingleFile',

  components: {
    TIconClearCircleFilled,
    TIconLoading,
  },

  data() {
    return {
      percentNum: 0,
    };
  },

  props: {
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
      return this.loadingFile && this.loadingFile.status === 'progress';
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
      return [
        't-input__inner',
        { 't-upload__placeholder': !this.inputName },
      ];
    },
    classes(): ClassName {
      return [
        't-upload__single',
        `t-upload__single-${this.display}`,
      ];
    },
  },

  watch: {
    percent: {
      immediate: true,
      handler(val: number) {
        this.handlePercent(val);
      },
    },
  },

  methods: {
    handlePercent(val: number) {
      this.percentNum = val;
      const timer = setInterval(() => {
        this.percentNum += 1;
        if (this.percentNum >= 99) {
          clearInterval(timer);
        }
      }, 10);
    },
    renderProgress() {
      return (
        <div class='t-upload__single-progress'>
          <TIconLoading size='20px'></TIconLoading>
          <span class='t-upload__single-percent'>{this.percentNum >= 100 ? 99 : this.percentNum}%</span>
        </div>
      );
    },
    // 文本型预览
    renderFilePreviewAsText() {
      if (!this.inputName) return;
      return (
        <div class='t-upload__single-display-text t-display-text--margin'>
          <span class='t-upload__single-name'>{this.inputName}</span>
          {this.showProgress
            ? this.renderProgress()
            : <TIconClearCircleFilled size='16px' nativeOnClick={(e: MouseEvent) => this.remove(e)}/>}
        </div>
      );
    },
    // 输入框型预览
    renderFilePreviewAsInput() {
      return (
        <div class='t-upload__single-input-preview t-input'>
          <div class={this.inputTextClass}>
            {<span class='t-upload__single-input-text'>{this.inputText}</span>}
            {this.showProgress && this.renderProgress()}
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
        {this.showInput && <span class='t-upload__single-input-delete' onClick={(e: MouseEvent) => this.remove(e)}>删除</span>}
      </div>
    );
  },
});
