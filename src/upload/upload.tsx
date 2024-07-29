import { computed, defineComponent, SetupContext } from '@vue/composition-api';
import { UploadIcon as TdUploadIcon } from 'tdesign-icons-vue';
import useFormDisabled from '../hooks/useFormDisabled';
import props from './props';
import NormalFile from './themes/normal-file';
import DraggerFile from './themes/dragger-file';
import ImageCard from './themes/image-card';
import MultipleFlowList from './themes/multiple-flow-list';
import useUpload from './hooks/useUpload';
import Button from '../button';
import { CommonDisplayFileProps, UploadProps } from './interface';
import { UploadDragEvents } from './hooks/useDrag';
import CustomFile from './themes/custom-file';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';

import useGlobalIcon from '../hooks/useGlobalIcon';

export default defineComponent({
  name: 'TUpload',

  props,

  setup(props: UploadProps, context: SetupContext) {
    const uploadData = useUpload(props, context);
    const { formDisabled } = useFormDisabled();

    const {
      localeConfig,
      classPrefix,
      toUploadFiles,
      displayFiles,
      uploadValue,
      sizeOverLimitMessage,
      uploading,
      tipsClasses,
      errorClasses,
      placeholderClass,
      innerDisabled,
      onInnerRemove,
      onDragFileChange,
      onPasteFileChange,
    } = uploadData;

    const tDisabled = computed<boolean>(() => formDisabled.value || innerDisabled.value);
    const icons = useGlobalIcon({
      UploadIcon: TdUploadIcon,
    });

    const commonDisplayFileProps = computed<CommonDisplayFileProps>(() => ({
      accept: props.accept,
      files: uploadValue.value,
      toUploadFiles: toUploadFiles.value,
      displayFiles: displayFiles.value,
      theme: props.theme,
      placeholder: props.placeholder,
      disabled: tDisabled.value,
      tips: props.tips,
      status: props.status,
      sizeOverLimitMessage: sizeOverLimitMessage.value,
      uploading: uploading.value,
      classPrefix: classPrefix.value,
      tipsClasses,
      errorClasses,
      placeholderClass,
      locale: localeConfig.value,
      autoUpload: props.autoUpload,
      showUploadProgress: props.showUploadProgress,
      abridgeName: props.abridgeName,
      imageViewerProps: props.imageViewerProps,
      fileListDisplay: props.fileListDisplay,
      onRemove: onInnerRemove,
    }));

    const dragProps = computed<UploadDragEvents>(() => ({
      onDragFileChange,
      onDragenter: (p) => {
        props.onDragenter?.(p);
        context.emit('dragenter', p);
      },
      onDragleave: (p) => {
        props.onDragleave?.(p);
        context.emit('dragleave', p);
      },
      onDrop: (p) => {
        props.onDrop?.(p);
        context.emit('drop', p);
      },
    }));

    const uploadClasses = computed(() => [
      `${classPrefix.value}-upload`,
      {
        [`${classPrefix.value}-upload--theme-${props.theme}`]: props.theme === 'file-input',
      },
    ]);

    return {
      ...uploadData,
      onPasteFileChange,
      commonDisplayFileProps,
      dragProps,
      uploadClasses,
      sizeOverLimitMessage,
      tDisabled,
      icons,
    };
  },

  methods: {
    renderTrigger() {
      const { UploadIcon } = this.icons;
      const getDefaultTrigger = () => {
        if (this.theme === 'file-input') {
          return (
            <Button disabled={this.tDisabled} variant="outline" props={this.triggerButtonProps}>
              {this.triggerUploadText}
            </Button>
          );
        }
        return (
          <Button
            disabled={this.tDisabled}
            variant="outline"
            icon={() => <UploadIcon />}
            props={this.triggerButtonProps}
          >
            {this.triggerUploadText}
          </Button>
        );
      };
      return (
        renderContent(this, 'default', 'trigger', {
          params: { dragActive: false, files: this.uploadValue },
        }) || getDefaultTrigger()
      );
    },

    getNormalFileNode() {
      return (
        <NormalFile
          props={this.commonDisplayFileProps}
          multiple={this.multiple}
          scopedSlots={{
            fileListDisplay: this.$scopedSlots.fileListDisplay,
            'file-list-display': this.$scopedSlots['file-list-display'],
          }}
        >
          <div class={`${this.classPrefix}-upload__trigger`} onClick={this.triggerUpload}>
            {this.renderTrigger()}
          </div>
        </NormalFile>
      );
    },

    getSingleFileDraggerUploadNode() {
      return (
        <DraggerFile
          props={this.commonDisplayFileProps}
          dragEvents={this.dragProps}
          trigger={this.trigger}
          cancelUpload={this.cancelUpload}
          triggerUpload={this.triggerUpload}
          uploadFiles={this.uploadFiles}
          onCancelUpload={this.innerCancelUpload}
          scopedSlots={{
            fileListDisplay: this.$scopedSlots.fileListDisplay,
            'file-list-display': this.$scopedSlots['file-list-display'],
          }}
        />
      );
    },

    getImageCardUploadNode() {
      return (
        <ImageCard
          props={this.commonDisplayFileProps}
          multiple={this.multiple}
          max={this.max}
          showUploadProgress={this.showUploadProgress}
          triggerUpload={this.triggerUpload}
          uploadFiles={this.uploadFiles}
          cancelUpload={this.cancelUpload}
          showImageFileName={this.showImageFileName}
          on={{
            preview: this.onInnerPreview,
          }}
          scopedSlots={{
            fileListDisplay: this.$scopedSlots.fileListDisplay,
            'file-list-display': this.$scopedSlots['file-list-display'],
          }}
        />
      );
    },

    getFlowListNode() {
      return (
        <MultipleFlowList
          props={this.commonDisplayFileProps}
          isBatchUpload={this.isBatchUpload}
          draggable={this.draggable}
          dragEvents={this.dragProps}
          uploadFiles={this.uploadFiles}
          cancelUpload={this.cancelUpload}
          onPreview={this.onInnerPreview}
          showThumbnail={this.showThumbnail}
          showImageFileName={this.showImageFileName}
          uploadButton={this.uploadButton}
          cancelUploadButton={this.cancelUploadButton}
          scopedSlots={{
            fileListDisplay: this.$scopedSlots.fileListDisplay,
            'file-list-display': this.$scopedSlots['file-list-display'],
            uploadButton: this.$scopedSlots.uploadButton,
            'upload-button': this.$scopedSlots['upload-button'],
            cancelUploadButton: this.$scopedSlots.cancelUploadButton,
            'cancel-upload-button': this.$scopedSlots['cancel-upload-button'],
          }}
        >
          <div class={`${this.classPrefix}-upload__trigger`} onClick={this.triggerUpload}>
            {this.renderTrigger()}
          </div>
        </MultipleFlowList>
      );
    },

    getCustomFile() {
      return (
        <CustomFile
          props={this.commonDisplayFileProps}
          draggable={this.draggable}
          dragContent={this.dragContent}
          dragEvents={this.dragProps}
          triggerUpload={this.triggerUpload}
          trigger={this.trigger}
          childrenNode={this.$scopedSlots.default}
          scopedSlots={{
            dragContent: this.$scopedSlots.dragContent,
            'drag-content': this.$scopedSlots['drag-content'],
            trigger: this.$scopedSlots.trigger,
          }}
        >
          {!this.draggable && this.renderTrigger()}
        </CustomFile>
      );
    },
  },

  render() {
    return (
      <div class={this.uploadClasses} onPaste={this.uploadPastedFiles ? this.onPasteFileChange : undefined}>
        <input
          ref="inputRef"
          type="file"
          disabled={this.tDisabled}
          onChange={this.onNormalFileChange}
          multiple={this.multiple}
          accept={this.accept}
          hidden
          attrs={this.inputAttributes}
        />
        {['file', 'file-input'].includes(this.theme) && !this.draggable && this.getNormalFileNode()}
        {['file', 'image'].includes(this.theme) && this.draggable && this.getSingleFileDraggerUploadNode()}
        {this.theme === 'image' && !this.draggable && this.getImageCardUploadNode()}
        {['image-flow', 'file-flow'].includes(this.theme) && this.getFlowListNode()}
        {this.theme === 'custom' && this.getCustomFile()}

        {Boolean(this.tips || this.$scopedSlots.tips) && (
          <small class={[this.tipsClasses, { [`${this.classPrefix}-upload__tips-${this.status}`]: this.status }]}>
            {renderTNodeJSX(this, 'tips')}
          </small>
        )}

        {this.sizeOverLimitMessage && <small class={this.errorClasses}>{this.sizeOverLimitMessage}</small>}
      </div>
    );
  },
});
