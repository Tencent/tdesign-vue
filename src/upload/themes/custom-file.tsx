import { defineComponent, PropType } from '@vue/composition-api';
import isFunction from 'lodash/isFunction';
import useDrag, { UploadDragEvents } from '../hooks/useDrag';
import { CommonDisplayFileProps } from '../interface';
import { commonProps } from '../constants';
import { renderContent } from '../../utils/render-tnode';
import { TdUploadProps } from '../type';

export interface CustomFileProps extends CommonDisplayFileProps {
  dragEvents: UploadDragEvents;
  draggable?: boolean;
  // 拖拽区域
  dragContent?: TdUploadProps['dragContent'];
  trigger?: TdUploadProps['trigger'];
  triggerUpload?: (e: MouseEvent) => void;
  childrenNode?: any;
}

export default defineComponent({
  name: 'UploadCustomFile',

  props: {
    ...commonProps,
    dragEvents: Object as PropType<CustomFileProps['dragEvents']>,
    draggable: Boolean,
    // 拖拽区域
    dragContent: Function as PropType<CustomFileProps['dragContent']>,
    trigger: Function as PropType<CustomFileProps['trigger']>,
    triggerUpload: Function as PropType<CustomFileProps['triggerUpload']>,
    childrenNode: Function as PropType<CustomFileProps['childrenNode']>,
  },

  setup(props) {
    const drag = useDrag(props.dragEvents);
    const { dragActive } = drag;

    return {
      dragActive,
      ...drag,
    };
  },

  render() {
    const renderDragContent = () => {
      const params = { dragActive: this.dragActive || false, files: this.displayFiles };
      return (
        <div
          class={`${this.classPrefix}-upload__dragger ${this.classPrefix}-upload__dragger-center`}
          onDrop={this.handleDrop}
          onDragenter={this.handleDragenter}
          onDragover={this.handleDragover}
          onDragleave={this.handleDragleave}
          onClick={this.triggerUpload}
        >
          <div class={`${this.classPrefix}-upload__trigger`}>
            {renderContent(this, 'dragContent', 'trigger', { params })
              || (isFunction(this.childrenNode) && this.childrenNode(params))}
          </div>
        </div>
      );
    };
    return this.draggable ? (
      renderDragContent()
    ) : (
      <div class={`${this.classPrefix}-upload__trigger`} onClick={this.triggerUpload}>
        {(isFunction(this.childrenNode) && this.childrenNode({ files: this.displayFiles }))
          || this.$scopedSlots.default?.(null)}
      </div>
    );
  },
});
