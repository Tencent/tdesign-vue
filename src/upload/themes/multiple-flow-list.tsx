import { CreateElement } from 'vue';
import {
  computed, defineComponent, toRefs, PropType,
} from '@vue/composition-api';
import classNames from 'classnames';
import {
  BrowseIcon as TdBrowseIcon,
  DeleteIcon as TdDeleteIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
  TimeFilledIcon as TdTimeFilledIcon,
} from 'tdesign-icons-vue';
import { useGlobalIcon } from '../../hooks/useGlobalIcon';
import ImageViewer from '../../image-viewer';
import { CommonDisplayFileProps } from '../interface';
import { commonProps } from '../constants';
import TButton from '../../button';
import { UploadFile } from '../type';
import { UploadDisplayDragEvents } from '../../common';
import useDrag, { UploadDragEvents } from '../hooks/useDrag';
import { abridgeName, returnFileSize } from '../../_common/js/upload/utils';
import TLoading from '../../loading';
import Link from '../../link';
import { renderTNodeJSX } from '../../utils/render-tnode';

export interface ImageFlowListProps extends CommonDisplayFileProps {
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent; file?: UploadFile }) => void;
  dragEvents: UploadDragEvents;
  disabled?: boolean;
  isBatchUpload?: boolean;
  draggable?: boolean;
}

export default defineComponent({
  name: 'UploadMultipleFlowList',

  props: {
    ...commonProps,
    uploadFiles: Function as PropType<ImageFlowListProps['uploadFiles']>,
    cancelUpload: Function as PropType<ImageFlowListProps['cancelUpload']>,
    dragEvents: Object as PropType<ImageFlowListProps['dragEvents']>,
    disabled: Boolean,
    isBatchUpload: Boolean,
    draggable: Boolean,
  },

  setup(props: ImageFlowListProps) {
    // locale 已经在 useUpload 中统一处理优先级
    const { locale, uploading, classPrefix } = toRefs(props);
    const uploadPrefix = `${classPrefix.value}-upload`;

    const icons = useGlobalIcon({
      BrowseIcon: TdBrowseIcon,
      DeleteIcon: TdDeleteIcon,
      CheckCircleFilledIcon: TdCheckCircleFilledIcon,
      ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
      TimeFilledIcon: TdTimeFilledIcon,
    });

    const drag = useDrag(props.dragEvents);

    const uploadText = computed(() => {
      if (uploading.value) return `${locale.value.progress.uploadingText}`;
      return locale.value.triggerUploadText.normal;
    });

    const innerDragEvents = computed<UploadDisplayDragEvents>(() => {
      const draggable = props.draggable === undefined ? true : props.draggable;
      return draggable
        ? {
          drop: drag.handleDrop,
          dragenter: drag.handleDragenter,
          dragover: drag.handleDragover,
          dragleave: drag.handleDragleave,
        }
        : {};
    });

    return {
      icons,
      dragActive: drag.dragActive,
      uploadPrefix,
      uploadText,
      innerDragEvents,
    };
  },

  methods: {
    getStatusMap() {
      const { CheckCircleFilledIcon, ErrorCircleFilledIcon, TimeFilledIcon } = this.icons;
      const iconMap = {
        success: <CheckCircleFilledIcon />,
        fail: <ErrorCircleFilledIcon />,
        progress: <TLoading />,
        waiting: <TimeFilledIcon />,
      };
      const { progress } = this.locale;
      const textMap = {
        success: progress?.successText,
        fail: progress?.failText,
        progress: progress?.uploadingText,
        waiting: progress?.waitingText,
      };
      return {
        iconMap,
        textMap,
      };
    },

    renderEmpty() {
      return (
        <div class={`${this.uploadPrefix}__flow-empty`}>
          {this.dragActive ? this.locale.dragger.dragDropText : this.locale.dragger.clickAndDragText}
        </div>
      );
    },

    renderImgItem(file: UploadFile, index: number) {
      const { iconMap, textMap } = this.getStatusMap();
      const { BrowseIcon, DeleteIcon } = this.icons;
      const fileName = this.abridgeName && file.name ? abridgeName(file.name, ...this.abridgeName) : file.name;
      return (
        <li class={`${this.uploadPrefix}__card-item`} key={file.name + index + file.percent + file.status}>
          <div
            class={classNames([
              `${this.uploadPrefix}__card-content`,
              { [`${this.classPrefix}-is-bordered`]: file.status !== 'waiting' },
            ])}
          >
            {['fail', 'progress'].includes(file.status) && (
              <div class={`${this.uploadPrefix}__card-status-wrap ${this.uploadPrefix}__${this.theme}-${file.status}`}>
                {iconMap[file.status as 'fail' | 'progress']}
                <p>
                  {textMap[file.status as 'fail' | 'progress']}
                  {file.status === 'progress' ? ` ${file.percent}%` : ''}
                </p>
              </div>
            )}
            {(['waiting', 'success'].includes(file.status) || (!file.status && file.url)) && (
              <img
                class={`${this.uploadPrefix}__card-image`}
                src={file.url || '//tdesign.gtimg.com/tdesign-default-img.png'}
              />
            )}
            <div class={`${this.uploadPrefix}__card-mask`}>
              {file.url && (
                <span class={`${this.uploadPrefix}__card-mask-item`}>
                  <ImageViewer
                    images={this.displayFiles.map((t) => t.url)}
                    defaultIndex={index}
                    trigger={(h: CreateElement, { open }: any) => (
                      <BrowseIcon
                        onClick={({ e }: { e: MouseEvent }) => {
                          this.$emit('preview', { file, index, e });
                          open();
                        }}
                      />
                    )}
                  ></ImageViewer>
                  <span class={`${this.uploadPrefix}__card-mask-item-divider`}></span>
                </span>
              )}
              {!this.disabled && (
                <span
                  class={`${this.uploadPrefix}__card-mask-item ${this.uploadPrefix}__delete`}
                  onClick={(e: MouseEvent) => this.onRemove({ e, index, file })}
                >
                  <DeleteIcon />
                </span>
              )}
            </div>
          </div>
          <p class={`${this.uploadPrefix}__card-name`}>{fileName}</p>
        </li>
      );
    },

    renderStatus(file: UploadFile) {
      const { iconMap, textMap } = this.getStatusMap();
      return (
        <div class={`${this.uploadPrefix}__flow-status`}>
          {iconMap[file.status]}
          <span class={`${this.uploadPrefix}__${this.theme}-${file.status}`}>
            {textMap[file.status]}
            {this.showUploadProgress && file.status === 'progress' ? ` ${file.percent || 0}%` : ''}
          </span>
        </div>
      );
    },

    renderNormalActionCol(file: UploadFile, index: number) {
      return (
        <td>
          <TButton
            theme="primary"
            variant="text"
            content={this.locale?.triggerUploadText?.delete}
            class={`${this.uploadPrefix}__delete`}
            onClick={(e: MouseEvent) => this.onRemove({ e, index, file })}
          ></TButton>
        </td>
      );
    },

    // batchUpload action col
    renderBatchActionCol(index: number) {
      // 第一行数据才需要合并单元格
      return index === 0 ? (
        <td rowSpan={this.displayFiles.length} class={`${this.uploadPrefix}__flow-table__batch-row`}>
          <TButton
            theme="primary"
            variant="text"
            content={this.locale?.triggerUploadText?.delete}
            class={`${this.uploadPrefix}__delete`}
            onClick={(e: MouseEvent) => this.onRemove({ e, index: -1, file: undefined })}
          ></TButton>
        </td>
      ) : null;
    },

    renderFileList() {
      const list = renderTNodeJSX(this, 'fileListDisplay', {
        params: {
          files: this.displayFiles,
          dragEvents: this.innerDragEvents,
        },
      });
      if (list) return list;

      return (
        <table class={`${this.uploadPrefix}__flow-table`} on={this.innerDragEvents}>
          <thead>
            <tr>
              <th>{this.locale.file?.fileNameText}</th>
              <th style={{ width: '120px' }}>{this.locale.file?.fileSizeText}</th>
              <th style={{ width: '120px' }}>{this.locale.file?.fileStatusText}</th>
              {this.disabled ? null : <th>{this.locale.file?.fileOperationText}</th>}
            </tr>
          </thead>
          <tbody>
            {!this.displayFiles.length && (
              <tr>
                <td colSpan={4}>{this.renderEmpty()}</td>
              </tr>
            )}
            {this.displayFiles.map((file, index) => {
              // 合并操作出现条件为：当前为合并上传模式且列表内没有待上传文件
              const showBatchUploadAction = this.isBatchUpload;
              const deleteNode = showBatchUploadAction && this.displayFiles.every((item) => item.status === 'success' || !item.status)
                ? this.renderBatchActionCol(index)
                : this.renderNormalActionCol(file, index);
              const fileName = this.abridgeName?.length ? abridgeName(file.name, ...this.abridgeName) : file.name;
              return (
                <tr key={file.name + index}>
                  <td class={`${this.uploadPrefix}__file-name`}>
                    {file.url ? (
                      <Link href={file.url} target="_blank" hover="color">
                        {fileName}
                      </Link>
                    ) : (
                      fileName
                    )}
                  </td>
                  <td>{returnFileSize(file.size)}</td>
                  <td>{this.renderStatus(file)}</td>
                  {this.disabled ? null : deleteNode}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    },

    renderImageList() {
      const customList = renderTNodeJSX(this, 'fileListDisplay', {
        params: {
          files: this.displayFiles,
          dragEvents: this.innerDragEvents,
        },
      });
      if (customList) return customList;
      return (
        <ul class={`${this.uploadPrefix}__card clearfix`}>
          {this.displayFiles.map((file, index) => this.renderImgItem(file, index))}
        </ul>
      );
    },
  },

  render() {
    const cardClassName = `${this.uploadPrefix}__flow-card-area`;
    return (
      <div class={`${this.uploadPrefix}__flow ${this.uploadPrefix}__flow-${this.theme}`}>
        <div class={`${this.uploadPrefix}__flow-op`}>
          {this.$scopedSlots.default?.(null)}
          {this.placeholder && (
            <small class={`${this.uploadPrefix}__flow-placeholder ${this.uploadPrefix}__placeholder`}>
              {this.placeholder}
            </small>
          )}
        </div>

        {this.theme === 'image-flow' && (
          <div class={cardClassName} on={this.innerDragEvents}>
            {this.displayFiles.length ? this.renderImageList() : this.renderEmpty()}
          </div>
        )}

        {this.theme === 'file-flow'
          && (this.displayFiles.length ? (
            this.renderFileList()
          ) : (
            <div class={cardClassName} on={this.innerDragEvents}>
              {this.renderEmpty()}
            </div>
          ))}

        {!this.autoUpload && (
          <div class={`${this.uploadPrefix}__flow-bottom`}>
            <TButton
              theme="default"
              disabled={this.disabled || !this.uploading}
              class={`${this.uploadPrefix}__cancel`}
              content={this.locale?.cancelUploadText}
              onClick={(e: MouseEvent) => this.cancelUpload?.({ e })}
            ></TButton>
            <TButton
              disabled={this.disabled || this.uploading || !this.displayFiles.length}
              theme="primary"
              loading={this.uploading}
              content={this.uploadText}
              class={`${this.uploadPrefix}__continue`}
              onClick={() => this.uploadFiles?.()}
            ></TButton>
          </div>
        )}
      </div>
    );
  },
});
