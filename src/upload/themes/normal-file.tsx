import { defineComponent } from '@vue/composition-api';
import {
  CloseIcon as TdCloseIcon,
  TimeFilledIcon as TdTimeFilledIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
  CloseCircleFilledIcon as TdCloseCircleFilledIcon,
} from 'tdesign-icons-vue';
import TLoading from '../../loading';
import Link from '../../link';
import { renderTNodeJSX } from '../../utils/render-tnode';
import { UploadFile } from '../type';
import { abridgeName } from '../../_common/js/upload/utils';
import { useGlobalIcon } from '../../hooks/useGlobalIcon';
import { CommonDisplayFileProps } from '../interface';
import { commonProps } from '../constants';

export interface NormalFileProps extends CommonDisplayFileProps {
  multiple: boolean;
}

const NormalFile = defineComponent({
  name: 'UploadNormalFile',

  props: {
    multiple: Boolean,
    ...commonProps,
  },

  setup(props: NormalFileProps) {
    const icons = useGlobalIcon({
      CloseIcon: TdCloseIcon,
      TimeFilledIcon: TdTimeFilledIcon,
      CheckCircleFilledIcon: TdCheckCircleFilledIcon,
      ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
      CloseCircleFilledIcon: TdCloseCircleFilledIcon,
    });

    const uploadPrefix = `${props.classPrefix}-upload`;

    return {
      uploadPrefix,
      icons,
    };
  },

  methods: {
    renderProgress(percent: number) {
      return (
        <div class={`${this.uploadPrefix}__single-progress`}>
          <TLoading />
          <span class={`${this.uploadPrefix}__single-percent`}>{percent || 0}%</span>
        </div>
      );
    },

    // 文本型预览
    renderFilePreviewAsText(files: UploadFile[]) {
      if (this.theme !== 'file') return null;
      if (!this.multiple && files[0]?.status === 'fail') {
        return null;
      }
      const { ErrorCircleFilledIcon, TimeFilledIcon, CloseIcon } = this.icons;
      return files.map((file, index) => (
        <div
          class={`${this.uploadPrefix}__single-display-text ${this.uploadPrefix}__display-text--margin`}
          key={file.name + index + file.percent + file.status}
        >
          {file.url ? (
            <Link
              href={file.url}
              target="_blank"
              hover="color"
              size="small"
              class={`${this.uploadPrefix}__single-name`}
            >
              {file.name}
            </Link>
          ) : (
            <span class={`${this.uploadPrefix}__single-name`}>{file.name}</span>
          )}
          {file.status === 'fail' && (
            <div class={`${this.uploadPrefix}__flow-status`}>
              <ErrorCircleFilledIcon />
            </div>
          )}
          {file.status === 'waiting' && (
            <div class={`${this.uploadPrefix}__flow-status`}>
              <TimeFilledIcon />
            </div>
          )}
          {file.status === 'progress' && this.renderProgress(file.percent)}
          {!this.disabled && file.status !== 'progress' && (
            <CloseIcon
              class={`${this.uploadPrefix}__icon-delete`}
              onClick={(e: MouseEvent) => this.onRemove({ e, file, index })}
            />
          )}
        </div>
      ));
    },

    // 输入框型预览
    renderFilePreviewAsInput() {
      if (this.theme !== 'file-input') return;
      const {
        TimeFilledIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon, CloseCircleFilledIcon,
      } = this.icons;
      const file = this.displayFiles[0];
      const inputTextClass = [
        `${this.classPrefix}-input__inner`,
        { [`${this.uploadPrefix}__placeholder`]: !this.displayFiles[0] },
      ];
      const disabledClass = this.disabled ? `${this.classPrefix}-is-disabled` : '';
      const fileName = this.abridgeName?.length && file?.name
        ? abridgeName(file.name, this.abridgeName[0], this.abridgeName[1])
        : file?.name;
      return (
        <div class={`${this.uploadPrefix}__single-input-preview ${this.classPrefix}-input ${disabledClass}`}>
          <div class={inputTextClass}>
            <span class={`${this.uploadPrefix}__single-input-text`}>{file?.name ? fileName : this.placeholder}</span>
            {file?.status === 'progress' && this.renderProgress(file.percent)}
            {file?.status === 'waiting' && <TimeFilledIcon class={`${this.uploadPrefix}__status-icon`} />}
            {file?.url && file.status === 'success' && (
              <CheckCircleFilledIcon class={`${this.uploadPrefix}__status-icon`} />
            )}
            {file?.name && file.status === 'fail' && (
              <ErrorCircleFilledIcon class={`${this.uploadPrefix}__status-icon`} />
            )}
            {!this.disabled && (
              <CloseCircleFilledIcon
                class={`${this.uploadPrefix}__single-input-clear`}
                onClick={({ e }: { e: MouseEvent }) => this.onRemove({ e, file, index: 0 })}
              />
            )}
          </div>
        </div>
      );
    },
  },

  render() {
    const classes = [`${this.uploadPrefix}__single`, `${this.uploadPrefix}__single-${this.theme}`];
    const fileListDisplay = renderTNodeJSX(this, 'fileListDisplay', { params: { files: this.displayFiles } });
    return (
      <div class={classes}>
        {this.theme === 'file-input' && this.renderFilePreviewAsInput()}

        {this.$scopedSlots.default?.(null)}

        {this.theme === 'file' && this.placeholder && !this.displayFiles[0] && (
          <small class={this.tipsClasses}>{this.placeholder}</small>
        )}

        {fileListDisplay || this.renderFilePreviewAsText(this.displayFiles)}

        {this.sizeOverLimitMessage && <small class={this.errorClasses}>{this.sizeOverLimitMessage}</small>}

        {/* 单文件上传失败要显示失败的原因 */}
        {!this.multiple && this.displayFiles[0]?.status === 'fail' && this.theme === 'file' ? (
          <small class={this.errorClasses}>
            {this.displayFiles[0].response?.error || this.locale.progress.failText}
          </small>
        ) : null}
      </div>
    );
  },
});

export default NormalFile;
