import Vue, { VNode, PropType } from 'vue';
import {
  TimeFilledIcon,
  CheckCircleFilledIcon,
  ErrorCircleFilledIcon,
  DeleteIcon,
  BrowseIcon,
} from 'tdesign-icons-vue';
import { prefix } from '../config';
import { UploadFile } from './type';
import TButton from '../button';
import TLoading from '../loading';
import { returnFileSize, abridgeName } from '../_common/js/upload/utils';
import { FlowRemoveContext } from './interface';
import props from './props';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { UploadConfig } from '../config-provider/config-receiver';

const uploadName = `${prefix}-upload`;

export default mixins(getConfigReceiverMixins<Vue, UploadConfig>('upload')).extend({
  name: 'TUploadFlowList',

  components: {
    TButton,
    TLoading,
    TimeFilledIcon,
    CheckCircleFilledIcon,
    ErrorCircleFilledIcon,
    DeleteIcon,
    BrowseIcon,
  },

  props: {
    showUploadProgress: props.showUploadProgress,
    // 是否过滤重复文件
    allowUploadDuplicateFile: props.allowUploadDuplicateFile,
    // 已上传完成的文件
    files: Array as PropType<Array<UploadFile>>,
    // 合并上传
    batchUpload: Boolean,
    // 上传队列中的文件（可能存在已经上传过的文件）
    toUploadFiles: Array as PropType<Array<UploadFile>>,
    placeholder: String,
    autoUpload: Boolean,
    disabled: Boolean,
    remove: Function as PropType<(ctx: FlowRemoveContext) => void>,
    upload: Function as PropType<(files: Array<UploadFile>, e: MouseEvent) => void>,
    cancel: Function as PropType<(e: MouseEvent) => void>,
    display: {
      type: String as PropType<'file-flow' | 'image-flow'>,
      validator(val: string) {
        return ['file-flow', 'image-flow'].includes(val);
      },
    },
  },

  data() {
    return {
      dragActive: false,
      target: null,
    };
  },

  computed: {
    showInitial(): boolean {
      const isWaitingEmpty = !this.waitingUploadFiles || !this.waitingUploadFiles.length;
      return (!this.files || !this.files.length) && isWaitingEmpty;
    },
    // 上传队列中的文件（不包含已经上传过的文件）
    waitingUploadFiles(): Array<UploadFile> {
      const list: Array<UploadFile> = [];
      this.toUploadFiles.forEach((item) => {
        // 判断是否需要过滤重复文件
        if (!this.allowUploadDuplicateFile) {
          const r = this.files.filter((t) => t.name === item.name);
          if (!r.length) {
            list.push(item);
          }
        } else {
          list.push(item);
        }
      });
      return list;
    },
    listFiles(): Array<UploadFile> {
      if (!this.files || !this.files.length) return this.toUploadFiles;
      return this.files.concat(this.waitingUploadFiles);
    },
    failedList(): Array<UploadFile> {
      return this.toUploadFiles.filter((file) => file.status === 'fail');
    },
    processList(): Array<UploadFile> {
      return this.toUploadFiles.filter((file) => file.status === 'progress');
    },
    isUploading(): boolean {
      return !!this.processList.length;
    },
    allowUpload(): boolean {
      return Boolean(this.waitingUploadFiles && this.waitingUploadFiles.length) && !this.isUploading;
    },
    uploadText(): string {
      if (this.isUploading) return `${this.global.progress.uploadingText}...`;
      return this.failedList && this.failedList.length
        ? this.global.triggerUploadText.reupload
        : this.global.triggerUploadText.normal;
    },
    batchRemoveRow(): boolean {
      return this.batchUpload && this.files.length > 0;
    },
  },
  methods: {
    renderStatus(file: UploadFile) {
      let status = null;
      switch (file.status) {
        case 'success':
          status = (
            <div class={`${uploadName}__flow-status`}>
              <CheckCircleFilledIcon />
              <span>{this.global.progress.successText}</span>
            </div>
          );
          break;
        case 'fail':
          status = (
            <div class={`${uploadName}__flow-status`}>
              <ErrorCircleFilledIcon />
              <span>{this.global.progress.failText}</span>
            </div>
          );
          break;
        case 'progress':
          this.showUploadProgress
            && (status = (
              <div class={`${uploadName}__flow-status`}>
                <TLoading />
                <span>{`${this.global.progress.uploadingText} ${Math.min(file.percent, 99)}%`}</span>
              </div>
            ));
          break;
        case 'waiting':
          status = (
            <div class={`${uploadName}__flow-status`}>
              <TimeFilledIcon />
              <span>{this.global.progress.waitingText}</span>
            </div>
          );
          break;
      }
      return status;
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

    onViewClick(event: MouseEvent, file?: UploadFile) {
      this.$emit('imgPreview', event, file);
    },

    renderDragger() {
      return (
        <div
          class={`${uploadName}__flow-empty`}
          onDrop={this.handleDrop}
          onDragenter={this.handleDragenter}
          onDragover={this.handleDragover}
          onDragleave={this.handleDragleave}
        >
          {this.dragActive ? this.global.dragger.dragDropText : this.global.dragger.clickAndDragText}
        </div>
      );
    },

    renderFileList() {
      return (
        <table class={`${uploadName}__flow-table`}>
          <tr>
            <th>{this.global.file.fileNameText}</th>
            <th>{this.global.file.fileSizeText}</th>
            <th>{this.global.file.fileStatusText}</th>
            <th>{this.global.file.fileOperationText}</th>
          </tr>
          {this.showInitial && (
            <tr>
              <td colspan={4}>{this.renderDragger()}</td>
            </tr>
          )}
          {this.listFiles.map((file, index) => {
            // 合并操作出现条件为：当前为合并上传模式且列表内没有待上传文件
            const showBatchUploadAction = this.batchUpload && this.toUploadFiles.length === 0;
            return (
              <tr>
                <td>{abridgeName(file.name, 7, 10)}</td>
                <td>{returnFileSize(file.size)}</td>
                <td>{this.renderStatus(file)}</td>
                {showBatchUploadAction ? this.renderBatchActionCol(index) : this.renderNormalActionCol(file, index)}
              </tr>
            );
          })}
        </table>
      );
    },

    renderNormalActionCol(file: UploadFile, index: number) {
      return (
        <td>
          <span
            class={`${uploadName}__flow-button`}
            onClick={(e: MouseEvent) => this.remove({
              e,
              index,
              file,
            })
            }
          >
            {this.global.triggerUploadText.delete}
          </span>
        </td>
      );
    },

    // batchUpload action col
    renderBatchActionCol(index: number) {
      // 第一行数据才需要合并单元格
      return index === 0 ? (
        <td rowspan={this.listFiles.length} class={`${uploadName}__flow-table__batch-row`}>
          <span
            class={`${uploadName}__flow-button`}
            onClick={(e: MouseEvent) => this.remove({
              e,
              index: -1,
              file: null,
            })
            }
          >
            {this.global.triggerUploadText.delete}
          </span>
        </td>
      ) : (
        ''
      );
    },

    renderImgList() {
      return (
        <div class={`${uploadName}__flow-card-area`}>
          {this.showInitial && this.renderDragger()}
          {!!this.listFiles.length && (
            <ul class={`${uploadName}__card clearfix`}>
              {this.listFiles.map((file, index) => (
                <li class={`${uploadName}__card-item`}>
                  <div
                    class={[`${uploadName}__card-content`, { [`${prefix}-is-bordered`]: file.status !== 'waiting' }]}
                  >
                    {file.status === 'fail' && (
                      <div class={`${uploadName}__card-status-wrap`}>
                        <ErrorCircleFilledIcon />
                        <p>{this.global.progress.failText}</p>
                      </div>
                    )}
                    {file.status === 'progress' && (
                      <div class={`${uploadName}__card-status-wrap`}>
                        <TLoading />
                        <p>
                          {this.global.progress.uploadingText} {Math.min(file.percent, 99)}
                        </p>
                      </div>
                    )}
                    {(['waiting', 'success'].includes(file.status) || (!file.status && file.url)) && (
                      <img
                        class={`${uploadName}__card-image`}
                        src={file.url || '//tdesign.gtimg.com/tdesign-default-img.png'}
                      />
                    )}
                    <div class={`${uploadName}__card-mask`}>
                      {file.url && (
                        <span class={`${uploadName}__card-mask-item`}>
                          <BrowseIcon nativeOnClick={(e: MouseEvent) => this.onViewClick(e, file)} />
                          <span class={`${uploadName}__card-mask-item-divider`}></span>
                        </span>
                      )}
                      {!this.disabled && (
                        <span
                          class={`${uploadName}__card-mask-item`}
                          onClick={(e: MouseEvent) => this.remove({ e, index, file })}
                        >
                          <DeleteIcon />
                        </span>
                      )}
                    </div>
                  </div>
                  <p class={`${uploadName}__card-name`}>{abridgeName(file.name)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    },
  },

  render(): VNode {
    return (
      <div class={[`${uploadName}__flow`, `${uploadName}__flow-${this.display}`]}>
        <div class={`${uploadName}__flow-op`}>
          {this.$scopedSlots.default && this.$scopedSlots.default(null)}
          <small class={`${prefix}-size-s ${uploadName}__flow-placeholder`}>{this.placeholder}</small>
        </div>
        {this.display === 'file-flow' && this.renderFileList()}
        {this.display === 'image-flow' && this.renderImgList()}
        <div class={`${uploadName}__flow-bottom`}>
          <TButton theme="default" onClick={this.cancel}>
            {this.global.cancelUploadText}
          </TButton>
          <TButton
            disabled={!this.allowUpload}
            theme="primary"
            onClick={(e: MouseEvent) => this.upload(this.waitingUploadFiles, e)}
          >
            {this.uploadText}
          </TButton>
        </div>
      </div>
    );
  },
});
