import { CreateElement } from 'vue';
import {
  defineComponent, PropType, toRefs, computed,
} from '@vue/composition-api';
import {
  BrowseIcon as TdBrowseIcon,
  DeleteIcon as TdDeleteIcon,
  AddIcon as TdAddIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-vue';
import Loading from '../../loading';
import { useGlobalIcon } from '../../hooks/useGlobalIcon';
import ImageViewer from '../../image-viewer';
import { CommonDisplayFileProps } from '../interface';
import { commonProps } from '../constants';
import { TdUploadProps, UploadFile } from '../type';
import { abridgeName } from '../../_common/js/upload/utils';

export interface ImageCardUploadProps extends CommonDisplayFileProps {
  multiple: TdUploadProps['multiple'];
  max: TdUploadProps['max'];
  disabled?: TdUploadProps['disabled'];
  showUploadProgress: TdUploadProps['showUploadProgress'];
  triggerUpload?: (e: MouseEvent) => void;
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent; file: UploadFile }) => void;
  onPreview?: TdUploadProps['onPreview'];
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
    // onPreview: Function as PropType<ImageCardUploadProps['onPreview']>,
  },

  setup(props: ImageCardUploadProps) {
    const { displayFiles, multiple, max } = toRefs(props);
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
    };
  },

  methods: {
    renderMainContent(file: UploadFile, index: number) {
      const { BrowseIcon, DeleteIcon } = this.icons;
      return (
        <div class={`${this.classPrefix}-upload__card-content ${this.classPrefix}-upload__card-box`}>
          <img class={`${this.classPrefix}-upload__card-image`} src={file.url} />
          <div class={`${this.classPrefix}-upload__card-mask`}>
            <span class={`${this.classPrefix}-upload__card-mask-item`} onClick={(e: MouseEvent) => e.stopPropagation()}>
              <ImageViewer
                images={this.displayFiles.map((t: UploadFile) => t.url)}
                defaultIndex={index}
                trigger={(h: CreateElement, { open }: any) => (
                  <BrowseIcon
                    onClick={({ e }: { e: MouseEvent }) => {
                      this.onPreview?.({ file, index, e });
                      open();
                    }}
                  />
                )}
              ></ImageViewer>
            </span>
            {!this.disabled && [
              <span class={`${this.classPrefix}-upload__card-mask-item-divider`} />,
              <span
                class={`${this.classPrefix}-upload__card-mask-item`}
                onClick={(e: MouseEvent) => e.stopPropagation()}
              >
                <DeleteIcon onClick={({ e }: { e: MouseEvent }) => this?.onRemove?.({ e, file, index })} />
              </span>,
            ]}
          </div>
        </div>
      );
    },

    renderProgressFile(file: UploadFile, loadCard: string) {
      return (
        <div class={loadCard}>
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
              <DeleteIcon onClick={({ e }: { e: MouseEvent }) => this?.onRemove?.({ e, file, index })} />
            </span>
          </div>
        </div>
      );
    },
  },

  render() {
    const cardItemClasses = `${this.classPrefix}-upload__card-item ${this.classPrefix}-is-background`;
    const { AddIcon } = this.icons;

    return (
      <div>
        <ul class={`${this.classPrefix}-upload__card`}>
          {this.displayFiles?.map((file: UploadFile, index: number) => {
            const loadCard = `${this.classPrefix}-upload__card-container ${this.classPrefix}-upload__card-box`;
            const fileName = this.abridgeName ? abridgeName(file.name, ...this.abridgeName) : file.name;
            return (
              <li class={cardItemClasses} key={index}>
                {file.status === 'progress' && this.renderProgressFile(file, loadCard)}
                {file.status === 'fail' && this.renderFailFile(file, index, loadCard)}
                {!['progress', 'fail'].includes(file.status) && file.url && this.renderMainContent(file, index)}
                <div class={`${this.classPrefix}-upload__card-name`}>{fileName}</div>
              </li>
            );
          })}

          {this.showTrigger && (
            <li class={cardItemClasses} onClick={this.triggerUpload}>
              <div class={`${this.classPrefix}-upload__card-container ${this.classPrefix}-upload__card-box`}>
                <AddIcon />
                <p class={`${this.classPrefix}-size-s`}>{this.locale?.triggerUploadText?.image}</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    );
  },
});
