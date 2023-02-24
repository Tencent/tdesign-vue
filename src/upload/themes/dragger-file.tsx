import { CreateElement } from 'vue';
import {
  defineComponent, toRefs, PropType, ref, computed, h,
} from '@vue/composition-api';
import {
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-vue';
import { abridgeName, getFileSizeText } from '../../_common/js/upload/utils';
import { TdUploadProps, UploadFile } from '../type';
import Button from '../../button';
import { CommonDisplayFileProps } from '../interface';
import { commonProps } from '../constants';
import useCommonClassName from '../../hooks/useCommonClassName';
import TLoading from '../../loading';
import useDrag, { UploadDragEvents } from '../hooks/useDrag';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import ImageViewer from '../../image-viewer';
import { renderTNodeJSX } from '../../utils/render-tnode';

export interface DraggerProps extends CommonDisplayFileProps {
  trigger?: TdUploadProps['trigger'];
  triggerUpload?: (e: MouseEvent) => void;
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent; file: UploadFile }) => void;
  dragEvents: UploadDragEvents;
}

export default defineComponent({
  name: 'UploadDraggerFile',

  props: {
    ...commonProps,
    trigger: Function as PropType<DraggerProps['trigger']>,
    triggerUpload: Function as PropType<DraggerProps['triggerUpload']>,
    uploadFiles: Function as PropType<DraggerProps['uploadFiles']>,
    cancelUpload: Function as PropType<DraggerProps['cancelUpload']>,
    dragEvents: Object as PropType<DraggerProps['dragEvents']>,
  },

  setup(props: DraggerProps) {
    const { displayFiles } = toRefs(props);

    const { sizeClassNames } = useCommonClassName();
    const uploadPrefix = `${props.classPrefix}-upload`;

    const drag = useDrag(props.dragEvents);
    const { dragActive } = drag;

    const draggerFileRef = ref();

    const classes = computed(() => [
      `${uploadPrefix}__dragger`,
      { [`${uploadPrefix}__dragger-center`]: !displayFiles.value[0] },
      { [`${uploadPrefix}__dragger-error`]: displayFiles.value[0]?.status === 'fail' },
    ]);

    const icons = useGlobalIcon({
      CheckCircleFilledIcon: TdCheckCircleFilledIcon,
      ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
    });

    return {
      drag,
      dragActive,
      draggerFileRef,
      classes,
      sizeClassNames,
      uploadPrefix,
      icons,
    };
  },

  methods: {
    renderImage() {
      if (!this.displayFiles.length) return;
      const file = this.displayFiles[0];
      const url = file?.url || file?.response?.url;
      return (
        <div class={`${this.uploadPrefix}__dragger-img-wrap`}>
          {url && (
            <ImageViewer
              images={[url]}
              trigger={(h: CreateElement, { open }: any) => (
                <img src={url} onClick={open} style={{ maxWidth: '100%', maxHeight: '100%' }} />
              )}
              style={{ maxWidth: '120px', maxHeight: '120px' }}
            ></ImageViewer>
          )}
        </div>
      );
    },

    renderUploading() {
      if (!this.displayFiles.length) return;
      const file = this.displayFiles[0];
      if (file?.status === 'progress') {
        return (
          <div class={`${this.uploadPrefix}__single-progress`}>
            <TLoading />
            <span class={`${this.uploadPrefix}__single-percent`}>{file.percent}%</span>
          </div>
        );
      }
    },

    renderMainPreview() {
      const file = this.displayFiles[0];
      const { CheckCircleFilledIcon, ErrorCircleFilledIcon } = this.icons;
      const fileName = this.abridgeName ? abridgeName(file.name, ...this.abridgeName) : file.name;
      const fileInfo = [
        <div class={`${this.uploadPrefix}__dragger-text`} key="info">
          <span class={`${this.uploadPrefix}__single-name`}>{fileName}</span>
          {file.status === 'progress' && this.renderUploading()}
          {file.status === 'success' && <CheckCircleFilledIcon />}
          {file.status === 'fail' && <ErrorCircleFilledIcon />}
        </div>,
        <small class={`${this.sizeClassNames.small}`} key="size">
          {this.locale.file.fileSizeText}：{getFileSizeText(file.size)}
        </small>,
        <small class={`${this.sizeClassNames.small}`} key="time">
          {this.locale.file.fileOperationDateText}：{file.uploadTime || '-'}
        </small>,
      ];
      return (
        <div class={`${this.uploadPrefix}__dragger-progress`}>
          {this.theme === 'image' && this.renderImage()}
          <div class={`${this.uploadPrefix}__dragger-progress-info`}>
            {renderTNodeJSX(this, 'fileListDisplay', { params: { files: this.displayFiles } }) || fileInfo}

            <div class={`${this.uploadPrefix}__dragger-btns`}>
              {['progress', 'waiting'].includes(file.status) && !this.disabled && (
                <Button
                  theme="primary"
                  variant="text"
                  class={`${this.uploadPrefix}__dragger-progress-cancel`}
                  onClick={(e: MouseEvent) => this.cancelUpload?.({
                    e,
                    file: this.toUploadFiles[0] || this.files[0],
                  })
                  }
                >
                  {this.locale?.cancelUploadText}
                </Button>
              )}
              {!this.autoUpload && file.status === 'waiting' && (
                <Button
                  theme="primary"
                  variant="text"
                  disabled={this.disabled}
                  onClick={() => this.uploadFiles?.()}
                  class={`${this.uploadPrefix}__dragger-upload-btn`}
                >
                  {this.locale.triggerUploadText.normal}
                </Button>
              )}
            </div>
            {['fail', 'success'].includes(file?.status) && !this.disabled && (
              <div class={`${this.uploadPrefix}__dragger-btns`}>
                <Button
                  theme="primary"
                  variant="text"
                  disabled={this.disabled}
                  class={`${this.uploadPrefix}__dragger-progress-cancel`}
                  onClick={this.triggerUpload}
                >
                  {this.locale.triggerUploadText.reupload}
                </Button>
                <Button
                  theme="danger"
                  variant="text"
                  disabled={this.disabled}
                  class={`${this.uploadPrefix}__dragger-delete-btn`}
                  onClick={(e: MouseEvent) => this.onRemove?.({ e, index: 0, file })}
                >
                  {this.locale.triggerUploadText.delete}
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    },

    renderDefaultDragElement() {
      const unActiveElement = (
        <div>
          <span class={`${this.uploadPrefix}--highlight`}>{this.locale.triggerUploadText?.normal}</span>
          <span>&nbsp;&nbsp;/&nbsp;&nbsp;{this.locale.dragger.draggingText}</span>
        </div>
      );
      const activeElement = <div>{this.locale.dragger.dragDropText}</div>;
      return this.dragActive ? activeElement : unActiveElement;
    },

    getContent() {
      const file = this.displayFiles[0];
      if (file && (['progress', 'success', 'fail', 'waiting'].includes(file.status) || !file.status)) {
        return this.renderMainPreview();
      }
      return (
        <div class={`${this.uploadPrefix}__trigger`} onClick={this.triggerUpload}>
          {this.$scopedSlots.default?.(null) || this.renderDefaultDragElement()}
        </div>
      );
    },
  },

  render() {
    return (
      <div
        ref="draggerFileRef"
        class={this.classes}
        onDrop={this.drag.handleDrop}
        onDragenter={this.drag.handleDragenter}
        onDragover={this.drag.handleDragover}
        onDragleave={this.drag.handleDragleave}
      >
        {this.trigger?.(h, { files: this.displayFiles, dragActive: this.dragActive }) || this.getContent()}
      </div>
    );
  },
});
