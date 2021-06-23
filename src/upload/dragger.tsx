import Vue, { PropType, VNode } from 'vue';
import { prefix } from '../config';
import { UploadFile } from '../../types/upload/TdUploadProps';
import TIconLoading from '../icon/loading';
import TIconCheckCircleFilled from '../icon/check-circle-filled';
import TIconErrorCircleFilled from '../icon/error-circle-filled';
import TButton from '../button';
import { returnFileSize, getCurrentDate } from './util';

const name = `${prefix}-upload-dragger`;

export default Vue.extend({
  name,

  components: { TIconLoading, TIconCheckCircleFilled, TButton, TIconErrorCircleFilled },

  props: {
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
    autoUpload: {
      type: Boolean,
      default: true,
    },
    cancel: Function as PropType<(e: MouseEvent) => void>,
    trigger: Function as PropType<(e: MouseEvent) => void>,
    remove: Function as PropType<(e: MouseEvent) => void>,
  },

  data() {
    return {
      target: null,
      dragActive: false,
      percentNum: 0,
    };
  },

  computed: {
    isImage(): boolean {
      return this.display === 'image';
    },
    imageUrl(): string {
      return (this.file && this.file.url) || (this.loadingFile && this.loadingFile.url);
    },
    percent(): number {
      return this.loadingFile && this.loadingFile.percent;
    },
    inputName(): string {
      return (this.loadingFile && this.loadingFile.name) || (this.file && this.file.name);
    },
    classes(): ClassName {
      return [
        't-upload__dragger',
        { 't-upload__dragger-center': !this.loadingFile && !this.file },
        { 't-upload__dragger-error': this.loadingFile && this.loadingFile.status === 'fail' },
      ];
    },
    size(): number {
      return (this.loadingFile && this.loadingFile.size) || (this.file && this.file.size);
    },
    // 上传失败或者上传成功会显示
    showResultOperate(): boolean {
      const fail = (!!this.loadingFile && this.loadingFile.status === 'fail');
      const success = (this.file && this.file.name && !this.loadingFile);
      return fail || success;
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
          <span class={`${prefix}-upload__highlight`}>点击上传</span>
          <span>&nbsp;&nbsp;/&nbsp;&nbsp;拖拽到此区域</span>
        </div>
      );
      const activeElement = <div>释放鼠标</div>;
      return this.dragActive ? activeElement : unActiveElement;
    },

    renderImage() {
      return (
        <div class='t-upload__draggar-img-wrap'>
          {this.imageUrl && <img src={this.imageUrl || 'default.png'}></img>}
        </div>
      );
    },

    renderUploading() {
      if (this.autoUpload === false) {
        return '';
      }
      if (this.loadingFile.status === 'fail') {
        return <TIconErrorCircleFilled />;
      }
      return (
        <div class='t-upload__single-progress'>
          <TIconLoading size='20px'></TIconLoading>
          <span class='t-upload__single-percent'>{this.percentNum}%</span>
        </div>
      );
    },

    renderProgress() {
      return (
        <div class='t-upload__dragger-progress'>
          {this.isImage && this.renderImage()}
          <div class='t-upload__dragger-progress-info'>
            <div class='t-upload__dragger-text'>
              <span class='t-upload__single-name'>{this.inputName}</span>
              {this.loadingFile && this.renderUploading()}
              {(!this.loadingFile && !!this.file) && <TIconCheckCircleFilled/>}
            </div>
            <small class='t-upload__small'>文件大小：{returnFileSize(this.size)}</small>
            <small class='t-upload__small'>上传日期：{getCurrentDate()}</small>
            {!!this.loadingFile && this.loadingFile.status !== 'fail' && (
              <TButton variant='text' class='t-upload__dragger-progress-cancel' onClick={this.cancel}>取消上传</TButton>
            )}
            {this.showResultOperate && (
              <div class='t-upload__dragger-btns'>
                <TButton variant='text' class='t-upload__dragger-progress-cancel' onClick={this.trigger}>重新上传</TButton>
                <TButton variant='text' onClick={this.remove}>删除</TButton>
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
        <div class='t-upload__trigger' onClick={this.trigger}>
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
