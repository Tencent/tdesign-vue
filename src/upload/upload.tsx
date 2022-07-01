/* eslint-disable no-param-reassign */
import Vue, { VNode } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import findIndex from 'lodash/findIndex';
import isFunction from 'lodash/isFunction';
import without from 'lodash/without';
import { UploadIcon } from 'tdesign-icons-vue';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { UploadConfig } from '../config-provider/config-receiver';
import { prefix } from '../config';
import Dragger from './dragger';
import ImageCard from './image';
import FlowList from './flow-list';
import xhr from '../_common/js/upload/xhr';
import log from '../_common/js/log';
import { formatFiles, isOverSizeLimit } from '../_common/js/upload/utils';
import TButton from '../button';
import TDialog from '../dialog';
import SingleFile from './single-file';
import { renderContent } from '../utils/render-tnode';
import props from './props';
import { ClassName } from '../common';
import { emitEvent } from '../utils/event';

import {
  HTMLInputEvent,
  SuccessContext,
  InnerProgressContext,
  UploadRemoveOptions,
  FlowRemoveContext,
} from './interface';
import {
  TdUploadProps,
  UploadChangeContext,
  UploadFile,
  UploadRemoveContext,
  RequestMethodResponse,
  SizeLimitObj,
} from './type';

const name = `${prefix}-upload`;

export default mixins(getConfigReceiverMixins<Vue, UploadConfig>('upload')).extend({
  name: 'TUpload',

  components: {
    Dragger,
    SingleFile,
    ImageCard,
    FlowList,
    TDialog,
  },

  model: {
    prop: 'files',
    event: 'change',
  },

  props: { ...props },

  data() {
    return {
      formDisabled: undefined, // 表单控制禁用态时的变量
      dragActive: false,
      loadingFile: null as UploadFile, // 加载中的文件
      toUploadFiles: [], // 等待上传的文件队列
      errorMsg: '',
      showImageViewDialog: false,
      showImageViewUrl: '',
      xhrReq: null as XMLHttpRequest,
    };
  },

  computed: {
    isSingleRequest(): boolean {
      // 单文件和合并上传的情况实际都是只发起一个请求
      return !this.multiple || this.isBatchUpload;
    },
    tDisabled(): boolean {
      return this.formDisabled || this.disabled;
    },
    // 默认文件上传风格：文件进行上传和上传成功后不显示 tips
    showTips(): boolean {
      if (this.theme === 'file') {
        const hasNoFile = (!this.files || !this.files.length) && !this.loadingFile;
        return this.tips && hasNoFile;
      }
      return Boolean(this.tips);
    },
    // 完全自定义上传
    showCustomDisplay(): boolean {
      return this.theme === 'custom';
    },
    // 单文件非拖拽类文件上传
    showSingleDisplay(): boolean {
      return !this.draggable && ['file', 'file-input'].includes(this.theme);
    },
    // 单文件非拖拽勒图片上传
    showImgCard(): boolean {
      return !this.draggable && this.theme === 'image';
    },
    // 拖拽类单文件或图片上传
    singleDraggable(): boolean {
      return !this.multiple && this.draggable && ['file', 'file-input', 'image'].includes(this.theme);
    },
    showUploadList(): boolean {
      return this.multiple && ['file-flow', 'image-flow'].includes(this.theme);
    },
    showImgDialog(): boolean {
      return ['image', 'image-flow', 'custom'].includes(this.theme);
    },
    showErrorMsg(): boolean {
      return !!this.errorMsg;
    },
    tipsClasses(): ClassName {
      return [`${name}__tips`, `${prefix}-size-s`];
    },
    errorClasses(): ClassName {
      return this.tipsClasses.concat(`${name}__tips-error`);
    },
    uploadInOneRequest(): boolean {
      return this.multiple && this.uploadAllFilesInOneRequest;
    },
    canBatchUpload(): boolean {
      return this.uploadInOneRequest && this.isBatchUpload;
    },
    uploadListTriggerText(): string {
      let uploadText = this.global.triggerUploadText.fileInput;
      if (this.toUploadFiles?.length > 0 || this.files?.length > 0) {
        if (this.theme === 'file-input' || (this.files?.length > 0 && this.canBatchUpload)) {
          uploadText = this.global.triggerUploadText.reupload;
        } else {
          uploadText = this.global.triggerUploadText.continueUpload;
        }
      }
      return uploadText;
    },
  },
  methods: {
    emitChangeEvent(files: Array<UploadFile>, ctx: UploadChangeContext) {
      emitEvent<Parameters<TdUploadProps['onChange']>>(this, 'change', files, ctx);
    },
    emitRemoveEvent(ctx: UploadRemoveContext) {
      emitEvent<Parameters<TdUploadProps['onRemove']>>(this, 'remove', ctx);
    },
    // handle event of preview img dialog event
    handlePreviewImg(event: MouseEvent, file?: UploadFile) {
      if (!file || !file.url) return log.error('Uploader', 'Preview Error file');

      this.showImageViewUrl = file.url;
      this.showImageViewDialog = true;
      const previewCtx = { file, e: event };
      emitEvent<Parameters<TdUploadProps['onPreview']>>(this, 'preview', previewCtx);
    },

    handleChange(event: HTMLInputEvent): void {
      const { files } = event.target;
      if (this.tDisabled) return;
      this.uploadFiles(files);
      emitEvent<Parameters<TdUploadProps['onSelectChange']>>(
        this,
        'select-change',
        formatFiles(Array.from(files), this.format),
      );
      (this.$refs.input as HTMLInputElement).value = '';
    },

    handleDragChange(files: FileList): void {
      if (this.tDisabled) return;
      this.uploadFiles(files);
      emitEvent<Parameters<TdUploadProps['onSelectChange']>>(
        this,
        'select-change',
        formatFiles(Array.from(files), this.format),
      );
    },

    handleSingleRemove(e: MouseEvent) {
      const changeCtx = { trigger: 'remove' };
      if (this.loadingFile) this.loadingFile = null;
      this.errorMsg = '';
      this.emitChangeEvent([], changeCtx);
      this.emitRemoveEvent({ e });
    },

    handleFileInputRemove(e: MouseEvent) {
      // prevent trigger upload
      e?.stopPropagation();
      this.handleSingleRemove(e);
    },

    handleMultipleRemove(options: UploadRemoveOptions) {
      const changeCtx = { trigger: 'remove', ...options };
      let files: UploadFile[];
      if (!this.canBatchUpload) {
        files = this.files.concat();
        files.splice(options.index, 1);
      } else {
        // All files remove in batchUpload
        files = [];
        options.files = this.files.concat();
      }
      this.emitChangeEvent(files, changeCtx);
      this.emitRemoveEvent(options);
    },

    handleListRemove(context: FlowRemoveContext) {
      const { file, e } = context;
      const index = findIndex(this.toUploadFiles, (o) => o.name === file?.name);
      if (index >= 0) {
        this.toUploadFiles.splice(index, 1);
        this.emitRemoveEvent({ e, file, index });
      } else {
        const index = findIndex(this.files, (o) => o.name === file?.name);
        this.handleMultipleRemove({ e, index });
      }
    },

    uploadFiles(files: FileList) {
      // 合并上传前则需要清空已上传列表
      if (this.canBatchUpload && this.files?.length > 0) {
        const context = { trigger: 'batch-clear' };
        this.emitChangeEvent([], context);
      }

      let tmpFiles = [...files];
      if (this.max) {
        // 判断当前待上传列表长度
        tmpFiles = tmpFiles.slice(0, this.max - this.toUploadFiles.length - this.files.length);
        if (tmpFiles.length !== files.length) {
          console.warn(`TDesign Upload Warn: you can only upload ${this.max} files`);
        }
      }
      tmpFiles.forEach((fileRaw: File) => {
        let file: UploadFile | File = fileRaw;
        if (typeof this.format === 'function') {
          file = this.format(fileRaw);
        }
        const uploadFile: UploadFile = {
          raw: fileRaw,
          lastModified: fileRaw.lastModified,
          name: fileRaw.name,
          size: fileRaw.size,
          type: fileRaw.type,
          percent: 0,
          status: 'waiting',
          ...file,
        };
        const reader = new FileReader();
        reader.readAsDataURL(fileRaw);
        reader.onload = (event: ProgressEvent<FileReader>) => {
          uploadFile.url = event.target.result as string;
        };
        this.handleBeforeUpload(file).then((canUpload) => {
          if (!canUpload) return;
          const newFiles = this.toUploadFiles.concat();
          // 判断是否为重复文件条件，已选是否存在检验
          if (this.allowUploadDuplicateFile || !this.toUploadFiles.find((file) => file.name === uploadFile.name)) {
            newFiles.push(uploadFile);
          }
          this.toUploadFiles = newFiles;
          this.loadingFile = uploadFile;
          if (this.autoUpload) {
            this.upload(uploadFile);
          }
        });
      });
    },

    async upload(currentFiles: UploadFile | UploadFile[], index?: number) {
      // support allFilesInOneRequest upload，兼容原有的单文件模式
      const innerFiles = Array.isArray(currentFiles) ? currentFiles : [currentFiles];

      if (!this.action && !this.requestMethod) {
        console.error('TDesign Upload Error: one of action and requestMethod must be exist.');
        return;
      }
      this.errorMsg = '';
      innerFiles.forEach((file) => {
        file.status = 'progress';
        this.loadingFile = file;
      });

      // requestMethod 为父组件定义的自定义上传方法
      if (this.requestMethod) {
        this.handleRequestMethod(innerFiles);
      } else {
        if (this.useMockProgress) {
          this.handleMockProgress(innerFiles);
        }
        const request = xhr;

        const currentXhr = request({
          method: this.method,
          action: this.action,
          data: this.data,
          files: innerFiles,
          name: this.name,
          headers: this.headers,
          withCredentials: this.withCredentials,
          onError: this.onError,
          onProgress: this.handleProgress,
          onSuccess: this.handleSuccess,
        });

        if (this.isSingleRequest) {
          this.xhrReq = currentXhr;
        } else if (typeof index === 'number') this.toUploadFiles[index].xhr = currentXhr;
      }
    },
    /** 模拟进度条 Mock Progress */
    handleMockProgress(files: UploadFile[]) {
      const timer = setInterval(() => {
        files.forEach((file) => {
          if (file.status === 'success' || file.percent >= 99) {
            clearInterval(timer);
            return;
          }
          file.percent += 1;
        });
        const { percent } = files[0];
        this.handleProgress({
          files,
          percent,
          type: 'mock',
        });
      }, 10);
    },

    handleRequestMethod(files: UploadFile[]) {
      if (!isFunction(this.requestMethod)) {
        console.warn('TDesign Upload Warn: `requestMethod` must be a function.');
        return;
      }
      // requestMethod first argument can be file or currentFiles
      const requestMethodParam = this.uploadInOneRequest ? files : files[0];
      this.requestMethod(requestMethodParam).then((res: RequestMethodResponse) => {
        if (!this.handleRequestMethodResponse(res)) return;
        if (res.status === 'success') {
          this.handleSuccess({ files, response: res.response });
        } else if (res.status === 'fail') {
          const r = res.response || {};
          this.onError({
            file: this.uploadInOneRequest ? null : files[0],
            files,
            response: { ...r, error: res.error },
          });
        }
      });
    },

    handleRequestMethodResponse(res: RequestMethodResponse) {
      if (!res) {
        console.error('TDesign Upload Error: `requestMethodResponse` is required.');
        return false;
      }
      if (!res.status) {
        console.error(
          'TDesign Upload Error: `requestMethodResponse.status` is missing, which value is `success` or `fail`',
        );
        return false;
      }
      if (!['success', 'fail'].includes(res.status)) {
        console.error('TDesign Upload Error: `requestMethodResponse.status` must be `success` or `fail`');
        return false;
      }
      if (res.status === 'success' && (!res.response || !res.response.url)) {
        console.warn(
          'TDesign Upload Warn: `requestMethodResponse.response.url` is required, when `status` is `success`',
        );
      }
      return true;
    },

    multipleUpload(currentFiles: Array<UploadFile>) {
      if (this.uploadAllFilesInOneRequest) {
        // 一个请求同时上传多个文件
        this.upload(currentFiles);
      } else {
        currentFiles.forEach((file, index) => {
          this.upload(file, index);
        });
      }
    },

    onError(options: {
      event?: ProgressEvent;
      file: UploadFile;
      files: UploadFile[];
      response?: any;
      resFormatted?: boolean;
    }) {
      const {
        event, file, files, response, resFormatted,
      } = options;
      const innerFiles = Array.isArray(files) ? files : [file];

      innerFiles.forEach((file) => {
        file.status = 'fail';
        this.loadingFile = file;
      });
      let res = response;
      if (!resFormatted && typeof this.formatResponse === 'function') {
        res = this.formatResponse(response, { file, currentFiles: files });
      }
      this.errorMsg = res?.error;
      const context = {
        e: event,
        file: this.uploadInOneRequest ? null : innerFiles[0],
        currentFiles: innerFiles,
      };
      emitEvent<Parameters<TdUploadProps['onFail']>>(this, 'fail', context);
    },

    handleProgress({
      event, file, files: currentFiles, percent, type = 'real',
    }: InnerProgressContext) {
      const innerFiles = Array.isArray(currentFiles) ? currentFiles : [file];
      if (innerFiles?.length <= 0) return log.error('Uploader', 'Progress Error files');

      innerFiles.forEach((file) => {
        file.percent = Math.min(percent, 100);
        // 判断文件状态是否上传完成
        this.loadingFile = file.status === 'success' ? null : file;
      });
      const progressCtx = {
        percent,
        e: event,
        file,
        type,
        currentFiles: innerFiles,
      };
      emitEvent<Parameters<TdUploadProps['onProgress']>>(this, 'progress', progressCtx);
    },

    handleSuccess({
      event, file, files: currentFiles, response,
    }: SuccessContext) {
      const innerFiles = Array.isArray(currentFiles) ? currentFiles : [file];
      if (innerFiles?.length <= 0) return log.error('Uploader', 'success no files');

      innerFiles.forEach((file) => {
        file.status = 'success';
      });

      let res = response;
      if (typeof this.formatResponse === 'function') {
        res = this.formatResponse(response, {
          file: this.uploadInOneRequest ? null : innerFiles[0],
          currentFiles: innerFiles,
        });
      }
      // 如果返回值存在 error，则认为当前接口上传失败
      if (res?.error) {
        this.onError({
          event,
          file: this.uploadInOneRequest ? null : innerFiles[0],
          files: innerFiles,
          response: res,
          resFormatted: true,
        });
        return;
      }
      if (!this.uploadInOneRequest) {
        innerFiles[0].url = res.url || innerFiles[0].url;
      }

      // 从待上传文件队列中移除上传成功的文件
      this.toUploadFiles = without(this.toUploadFiles, ...innerFiles);

      // 上传成功的文件发送到 files
      const newFiles = innerFiles.map((file) => ({ ...file, response: res }));
      // 处理并发回调v-model数据 by brianfzhang
      this.multiple && this.files.push(...newFiles);
      const uploadedFiles = this.multiple ? this.files : newFiles;

      const context = { e: event, response: res, trigger: 'upload-success' };
      this.emitChangeEvent(uploadedFiles, context);
      const sContext = {
        file: this.uploadInOneRequest ? null : newFiles[0],
        fileList: uploadedFiles,
        currentFiles: newFiles,
        e: event,
        response: res,
      };
      emitEvent<Parameters<TdUploadProps['onSuccess']>>(this, 'success', sContext);
      this.loadingFile = null;
    },

    handlePreview({ file, event }: { file?: UploadFile; event: ProgressEvent }) {
      return { file, event };
    },

    triggerUpload() {
      if (this.tDisabled) return;
      (this.$refs.input as HTMLInputElement).click();
    },

    handleDragenter(e: DragEvent) {
      if (this.tDisabled) return;
      this.dragActive = true;
      emitEvent<Parameters<TdUploadProps['onDragenter']>>(this, 'dragenter', { e });
    },

    handleDragleave(e: DragEvent) {
      if (this.tDisabled) return;
      this.dragActive = false;
      emitEvent<Parameters<TdUploadProps['onDragleave']>>(this, 'dragleave', { e });
    },

    handleBeforeUpload(file: File | UploadFile): Promise<boolean> {
      if (typeof this.beforeUpload === 'function') {
        const r = this.beforeUpload(file);
        if (r instanceof Promise) return r;
        return new Promise((resolve) => resolve(r));
      }
      return new Promise((resolve) => {
        if (this.sizeLimit) {
          resolve(this.handleSizeLimit(file.size));
        }
        resolve(true);
      });
    },

    handleSizeLimit(fileSize: number) {
      const sizeLimit: SizeLimitObj = typeof this.sizeLimit === 'number' ? { size: this.sizeLimit, unit: 'KB' } : this.sizeLimit;
      const rSize = isOverSizeLimit(fileSize, sizeLimit.size, sizeLimit.unit);
      if (!rSize) {
        // 有参数 message 则使用，没有就使用全局 global 配置
        this.errorMsg = sizeLimit.message
          ? this.t(sizeLimit.message, { sizeLimit: sizeLimit.size })
          : `${this.t(this.global.sizeLimitMessage, { sizeLimit: sizeLimit.size })} ${sizeLimit.unit}`;
      }
      return rSize;
    },

    cancelUpload() {
      if (this.loadingFile) {
        if (!this.requestMethod) {
          this.isSingleRequest && this.xhrReq?.abort?.();

          this.multiple
            && this.toUploadFiles.forEach((file) => {
              if (file.status === 'progress') {
                !this.isBatchUpload && file.xhr.abort(); // 合并上传已统一取消 不需要在文件中手动取消
                file.status = 'waiting';
              }
            });
        }
        emitEvent<Parameters<TdUploadProps['onCancelUpload']>>(this, 'cancel-upload');
        this.loadingFile = null;
      }
      (this.$refs.input as HTMLInputElement).value = '';
    },

    // close image view dialog
    cancelPreviewImgDialog() {
      this.showImageViewDialog = false;
      // Dialog 动画结束后，再清理图片
      let timer = setTimeout(() => {
        this.showImageViewUrl = '';
        clearTimeout(timer);
        timer = null;
      }, 500);
    },

    getDefaultTrigger() {
      if (this.theme === 'file-input' || this.showUploadList) {
        return <TButton variant="outline">{this.uploadListTriggerText}</TButton>;
      }
      return (
        <TButton variant="outline">
          <UploadIcon slot="icon" />
          {this.files?.length ? this.global.triggerUploadText.reupload : this.global.triggerUploadText.normal}
        </TButton>
      );
    },

    renderInput() {
      return (
        <input
          ref="input"
          type="file"
          disabled={this.tDisabled}
          onChange={this.handleChange}
          multiple={this.multiple}
          accept={this.accept}
          hidden
        />
      );
    },
    // 渲染单文件预览：设计稿有两种单文件预览方式，文本型和输入框型。输入框型的需要在右侧显示「删除」按钮
    renderSingleDisplay(triggerElement: ScopedSlotReturnValue) {
      return (
        <SingleFile
          file={this.files && this.files[0]}
          loadingFile={this.loadingFile}
          display={this.theme}
          remove={this.handleSingleRemove}
          showUploadProgress={this.showUploadProgress}
          placeholder={this.placeholder}
          fileListDisplay={this.fileListDisplay}
        >
          <div class={`${name}__trigger`} onclick={this.triggerUpload}>
            {triggerElement}
          </div>
        </SingleFile>
      );
    },
    renderDraggerTrigger() {
      const params = {
        dragActive: this.dragActive,
        uploadingFile: this.multiple ? this.toUploadFiles : this.loadingFile,
      };
      const triggerElement = renderContent(this, 'default', 'trigger', { params });
      return (
        <Dragger
          showUploadProgress={this.showUploadProgress}
          onChange={this.handleDragChange}
          onDragenter={this.handleDragenter}
          onDragleave={this.handleDragleave}
          loadingFile={this.loadingFile}
          file={this.files && this.files[0]}
          display={this.theme}
          cancel={this.cancelUpload}
          trigger={this.triggerUpload}
          remove={this.handleSingleRemove}
          upload={this.upload}
          autoUpload={this.autoUpload}
        >
          {triggerElement}
        </Dragger>
      );
    },
    renderTrigger() {
      const defaultNode = this.getDefaultTrigger();
      return renderContent(this, 'default', 'trigger', defaultNode);
    },
    renderCustom(triggerElement: VNode) {
      return this.draggable ? (
        this.renderDraggerTrigger()
      ) : (
        <div class={`${name}__trigger`} onclick={this.triggerUpload}>
          {triggerElement}
        </div>
      );
    },
  },

  render(): VNode {
    const triggerElement = this.renderTrigger();
    return (
      <div class={name}>
        {this.renderInput()}
        {this.showCustomDisplay && this.renderCustom(triggerElement)}
        {this.showSingleDisplay && this.renderSingleDisplay(triggerElement)}
        {this.singleDraggable && this.renderDraggerTrigger()}
        {this.showImgCard && (
          <ImageCard
            files={this.files}
            multiple={this.multiple}
            remove={this.handleMultipleRemove}
            trigger={this.triggerUpload}
            loadingFile={this.loadingFile}
            toUploadFiles={this.toUploadFiles}
            max={this.max}
            onImgPreview={this.handlePreviewImg}
            disabled={this.tDisabled}
            locale={this.locale}
          ></ImageCard>
        )}
        {this.showUploadList && (
          <FlowList
            files={this.files}
            disabled={this.tDisabled}
            placeholder={this.placeholder}
            autoUpload={this.autoUpload}
            toUploadFiles={this.toUploadFiles}
            remove={this.handleListRemove}
            showUploadProgress={this.showUploadProgress}
            allowUploadDuplicateFile={this.allowUploadDuplicateFile}
            upload={this.multipleUpload}
            cancel={this.cancelUpload}
            display={this.theme}
            batchUpload={this.canBatchUpload}
            onImgPreview={this.handlePreviewImg}
            onChange={this.handleDragChange}
            onDragenter={this.handleDragenter}
            onDragleave={this.handleDragleave}
          >
            <div class={`${name}__trigger`} onclick={this.triggerUpload}>
              {triggerElement}
            </div>
          </FlowList>
        )}
        {this.showImgDialog && (
          <TDialog
            visible={this.showImageViewDialog}
            showOverlay
            width="auto"
            top="10%"
            class={`${name}__dialog`}
            footer={false}
            header={false}
            onClose={this.cancelPreviewImgDialog}
          >
            <div class={`${prefix}__dialog-body-img-box`}>
              <img src={this.showImageViewUrl} alt="" />
            </div>
          </TDialog>
        )}
        {!this.errorMsg && this.showTips && <small class={this.tipsClasses}>{this.tips}</small>}
        {this.showErrorMsg && <small class={this.errorClasses}>{this.errorMsg}</small>}
      </div>
    );
  },
});
