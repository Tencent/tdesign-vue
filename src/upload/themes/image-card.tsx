import {
  CreateElement, defineComponent, PropType, toRefs, computed, toRef, Ref,
} from 'vue';
import {
  BrowseIcon as TdBrowseIcon,
  DeleteIcon as TdDeleteIcon,
  AddIcon as TdAddIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-vue';
import { UploadConfig } from '@src/config-provider';
import Loading from '../../loading';
import { useGlobalIcon } from '../../hooks/useGlobalIcon';
import ImageViewer from '../../image-viewer';
import { CommonDisplayFileProps } from '../interface';
import { commonProps } from '../constants';
import { TdUploadProps, UploadFile } from '../type';
import { abridgeName } from '../../_common/js/upload/utils';
import { renderTNodeJSX } from '../../utils/render-tnode';
import Link from '../../link';
import Image from '../../image';

export interface ImageCardUploadProps extends CommonDisplayFileProps {
  multiple: TdUploadProps['multiple'];
  max: TdUploadProps['max'];
  disabled?: TdUploadProps['disabled'];
  showUploadProgress: TdUploadProps['showUploadProgress'];
  triggerUpload?: (e: MouseEvent) => void;
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent; file: UploadFile }) => void;
}

export default defineComponent({
  name: 'UploadImageCard',

  props: {
    ...commonProps,
    multiple: Boolean,
    max: Number,
    disabled: Boolean,
    showUploadProgress: Boolean,
    triggerUpload: Function as PropType<ImageCardUploadProps['triggerUpload']>,
    uploadFiles: Function as PropType<ImageCardUploadProps['uploadFiles']>,
    cancelUpload: Function as PropType<ImageCardUploadProps['cancelUpload']>,
    showImageFileName: Boolean,
    onPreview: Function,
  },

  setup(props) {
    const { displayFiles, multiple, max } = toRefs(props);
    const locale = toRef(props, 'locale') as Ref<UploadConfig>;
    const icons = useGlobalIcon({
      AddIcon: TdAddIcon,
      BrowseIcon: TdBrowseIcon,
      DeleteIcon: TdDeleteIcon,
      ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
    });

    const showTrigger = computed(() => {
      if (multiple.value) {
        return !max.value || displayFiles.value.length < max.value;
      }
      return !displayFiles.value?.[0];
    });

    return {
      icons,
      showTrigger,
      locale,
    };
  },

  methods: {
    renderMainContent(file: UploadFile, index: number) {
      const { BrowseIcon, DeleteIcon } = this.icons;
      return (
        <div class={`${this.classPrefix}-upload__card-content ${this.classPrefix}-upload__card-box`}>
          <Image class={`${this.classPrefix}-upload__card-image`} src={file.url || file.raw} error="" fit="contain" />
          <div class={`${this.classPrefix}-upload__card-mask`}>
            <span class={`${this.classPrefix}-upload__card-mask-item`} onClick={(e: MouseEvent) => e.stopPropagation()}>
              <ImageViewer
                images={this.displayFiles.map((t: UploadFile) => t.url || t.raw)}
                defaultIndex={index}
                trigger={(h: CreateElement, { open }: any) => (
                  <BrowseIcon
                    onClick={({ e }: { e: MouseEvent }) => {
                      this.$emit('preview', { file, index, e });
                      open();
                    }}
                  />
                )}
                props={this.imageViewerProps}
              ></ImageViewer>
            </span>
            {!this.disabled && [
              <span class={`${this.classPrefix}-upload__card-mask-item-divider`} />,
              <span
                class={`${this.classPrefix}-upload__card-mask-item`}
                onClick={(e: MouseEvent) => e.stopPropagation()}
              >
                <DeleteIcon onClick={({ e }: { e: MouseEvent }) => this.onRemove?.({ e, file, index })} />
              </span>,
            ]}
          </div>
        </div>
      );
    },

    renderProgressFile(file: UploadFile, loadCard: string) {
      return (
        <div class={[loadCard, `${this.classPrefix}-upload__${this.theme}-${file.status}`]}>
          <Loading loading={true} size="medium" />
          <p>
            {this.locale?.progress?.uploadingText}
            {this.showUploadProgress ? ` ${file.percent}%` : ''}
          </p>
        </div>
      );
    },

    renderFailFile(file: UploadFile, index: number, loadCard: string) {
      const { ErrorCircleFilledIcon, DeleteIcon } = this.icons;
      return (
        <div class={loadCard}>
          <ErrorCircleFilledIcon />
          <p>{file.response?.error || this.locale?.progress?.failText}</p>
          <div class={`${this.classPrefix}-upload__card-mask`}>
            <span class={`${this.classPrefix}-upload__card-mask-item`} onClick={(e: MouseEvent) => e.stopPropagation()}>
              <DeleteIcon onClick={({ e }: { e: MouseEvent }) => this.onRemove?.({ e, file, index })} />
            </span>
          </div>
        </div>
      );
    },
  },

  render() {
    // render custom UI with fileListDisplay
    const customList = renderTNodeJSX(this, 'fileListDisplay', {
      params: {
        files: this.displayFiles,
        onPreview: this.onPreview,
        toUploadFiles: this.toUploadFiles,
        sizeOverLimitMessage: this.sizeOverLimitMessage,
        locale: this.locale,
        triggerUpload: this.triggerUpload,
        uploadFiles: this.uploadFiles,
        cancelUpload: this.cancelUpload,
        onRemove: this.onRemove,
      },
    });
    if (customList) return customList;

    const cardItemClasses = `${this.classPrefix}-upload__card-item ${this.classPrefix}-is-background`;
    const { AddIcon } = this.icons;

    return (
      <div>
        <ul class={`${this.classPrefix}-upload__card`}>
          {this.displayFiles?.map((file: UploadFile, index: number) => {
            const loadCard = `${this.classPrefix}-upload__card-container ${this.classPrefix}-upload__card-box`;
            const fileName = this.abridgeName ? abridgeName(file.name, ...this.abridgeName) : file.name;
            const fileNameClassName = `${this.classPrefix}-upload__card-name`;
            return (
              <li class={cardItemClasses} key={index}>
                {file.status === 'progress' && this.renderProgressFile(file, loadCard)}
                {file.status === 'fail' && this.renderFailFile(file, index, loadCard)}
                {!['progress', 'fail'].includes(file.status) && this.renderMainContent(file, index)}
                {fileName
                  && this.showImageFileName
                  && (file.url ? (
                    <Link href={file.url} class={fileNameClassName} target="_blank" hover="color" size="small">
                      {fileName}
                    </Link>
                  ) : (
                    <span class={fileNameClassName}>{fileName}</span>
                  ))}
              </li>
            );
          })}

          {this.showTrigger && (
            <li class={cardItemClasses} onClick={this.triggerUpload}>
              <div
                class={[
                  `${this.classPrefix}-upload__image-add ${this.classPrefix}-upload__card-container ${this.classPrefix}-upload__card-box`,
                  {
                    [`${this.classPrefix}-is-disabled`]: this.disabled,
                  },
                ]}
              >
                <AddIcon />
                <p class={`${this.classPrefix}-size-s ${this.classPrefix}-upload__add-text`}>
                  {this.locale?.triggerUploadText?.image}
                </p>
              </div>
            </li>
          )}
        </ul>
      </div>
    );
  },
});
