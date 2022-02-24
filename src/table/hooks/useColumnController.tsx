/**
 * 自定义显示列控制器，即列配置
 */
import { SettingIcon } from 'tdesign-icons-vue';
// import Checkbox from '../../checkbox';
// import CheckboxGroup from '../../checkbox/group';
import { prefix } from '../../config';
import { DialogPlugin } from '../../dialog/plugin';
import { useTNodeJSX } from '../../hooks/tnode';
import { TdPrimaryTableProps } from '../type';

export default function useColumnController() {
  const renderTNode = useTNodeJSX();

  const handleToggleColumnController = (props: TdPrimaryTableProps) => {
    const widthMode = props.columnController?.displayType === 'fixed-width' ? 'fixed' : 'auto';
    const dialogTmp = DialogPlugin.confirm({
      header: '自定义设置表格列',
      body: () => {
        const defaultNode = (
          <div class={[`${prefix}-table__column-controller`, `${prefix}-table__column-controller--${widthMode}`]}>
            <div class={`${prefix}-table__column-controller-body`}>
              <p class={`${prefix}-table__column-controller-desc`}>请选择需要在表格中显示的数据列</p>
              <div class={`${prefix}-table__column-controller-block`}>
                {/* <Checkbox
                  indeterminate={this.isSomeShowColumns}
                  checked={this.isAllShowColumns}
                  onChange={this.handleClickAllShowColumns}
                >
                  全选
                </Checkbox> */}
              </div>
              <div class={`${prefix}-table__column-controller-block`}>
                {/* <CheckboxGroup
                  options={this.showColumnCheckboxOpts}
                  value={this.showColumnCheckboxKeys}
                  onChange={handleCheckChange}
                /> */}
              </div>
            </div>
          </div>
        );
        return renderTNode('columnControllerContent', defaultNode);
      },
      confirmBtn: '确认',
      cancelBtn: '取消',
      width: 612,
      onConfirm: () => {
        // this.showColumnKeys = [...this.showColumnCheckboxKeys];
        dialogTmp.hide();
      },
      onClose: () => {
        dialogTmp.hide();
      },
    });
  };

  const renderColumnController = () => (
    <div class={`${prefix}-table__top-content`}>
      <t-button theme="default" variant="outline" onClick={handleToggleColumnController}>
        <SettingIcon slot="icon" />
        列配置
      </t-button>
    </div>
  );

  return {
    renderColumnController,
  };
}
