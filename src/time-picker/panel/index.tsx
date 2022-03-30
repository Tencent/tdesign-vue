import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import mixins from '../../utils/mixins';
import getConfigReceiverMixins, { TimePickerConfig } from '../../config-provider/config-receiver';
import { TimePickerPanelInstance, TimePickerPanelColInstance, EPickerCols } from '../interface';
import { componentName } from '../constant';
import { panelProps } from './props';
import PanelCol from './panel-col';
import TButton from '../../button/button';

const name = `${componentName}__panel`;

dayjs.extend(customParseFormat);

export default mixins(getConfigReceiverMixins<TimePickerPanelInstance, TimePickerConfig>('timePicker')).extend({
  name,
  data() {
    return {
      panel: null,
      isSetup: false,
    };
  },
  components: {
    PanelCol,
    TButton,
  },

  props: panelProps(),
  computed: {
    sectionComponentName() {
      return `${name}-section`;
    },
    classNames() {
      return this.rangePicker ? [name, this.sectionComponentName] : [name];
    },
    colValues() {
      return this.value.map((el) => el || dayjs());
    },
    rangePicker() {
      return this.colValues.length > 1;
    },
    formatField() {
      const match = this.format.match(/(a\s+|A\s+)?(h+|H+)?:?(m+)?:?(s+)?(\s+a|\s+A)?/);
      const [, startAChart, hour, minute, second, endAChart] = match;
      return {
        startAChart,
        hour,
        minute,
        second,
        endAChart,
      };
    },
    cols() {
      const {
        startAChart, hour, minute, second, endAChart,
      } = this.formatField;
      const res = [];
      startAChart && res.push(EPickerCols.meridiem);
      hour && res.push(EPickerCols.hour);
      minute && res.push(EPickerCols.minute);
      second && res.push(EPickerCols.second);
      endAChart && res.push(EPickerCols.meridiem);
      return res;
    },
    localeMeridiems() {
      return [this.global.anteMeridiem, this.global.postMeridiem];
    },
    showNowTime() {
      // 是否展示此刻按钮
      return !this.rangePicker && this.steps.filter((step) => step !== 1).length < 1;
    },
  },
  watch: {
    isShowPanel(val: boolean) {
      if (val) {
        this.panelColUpdate();
      }
    },
  },
  mounted() {
    // 不做 isShowPanel 的判断，故无法合并到 watch
    this.panelColUpdate();
  },
  methods: {
    panelColUpdate() {
      setTimeout(() => {
        (this.$refs.panelCol_0 as TimePickerPanelColInstance)?.updateTimeScrollPos();
        (this.$refs.panelCol_1 as TimePickerPanelColInstance)?.updateTimeScrollPos();
      });
    },
    scrollToTime(colIndex: number, col: EPickerCols, time: number | string, behavior: ScrollBehavior) {
      const scroller = this.$refs[`panelCol_${colIndex}`] as TimePickerPanelColInstance;
      scroller && scroller.scrollToTime(col, time, behavior);
    },
    renderFooter() {
      const confirmAction = this.confirmBtnClick.bind(this);
      return (
        <div class={`${this.sectionComponentName}-footer`}>
          {/* 样式设置为row-reverse 这样不用特地为确定写个绝对布局 */}
          <t-button theme="primary" variant="base" onClick={confirmAction}>
            {this.t(this.global.confirm)}
          </t-button>
          {this.showNowTime && (
            <t-button theme="primary" variant="text" onClick={this.nowAction}>
              {this.t(this.global.now)}
            </t-button>
          )}
        </div>
      );
    },

    renderBody() {
      return (
        <div class={`${this.sectionComponentName}-body`}>
          {this.renderSinglePicker(0)}
          {this.rangePicker && this.renderSinglePicker(1)}
        </div>
      );
    },
    renderSinglePicker(index: number) {
      const val = this.colValues[index];
      const ref = `panelCol_${index}`;
      return (
        <panel-col
          ref={ref}
          value={val}
          cols={this.cols}
          steps={this.steps}
          hideDisabledTime={this.hideDisabledTime}
          disableTime={this.disableTime}
          format={this.format}
          ontime-pick={(col: EPickerCols, time: string | number) => this.handleTimePick(col, time, index)}
          localeMeridiems={this.localeMeridiems}
        />
      );
    },
    confirmBtnClick(e: MouseEvent) {
      this.$emit('sure', e);
    },
    nowAction() {
      this.$emit('now-action');
      this.panelColUpdate();
    },
    /**
     * 时间 item 点击选择处理函数
     * @param col 选择的哪一列 上午/下午 hour minute second am/pm
     * @param time 选择的时间 如果col是：上午/下午或者am/pm 则time是 string，如果是hour或minute或second则time是 number
     * @param index
     */
    handleTimePick(col: EPickerCols, time: string | number, index: number) {
      this.$emit('time-pick', col, time, index, this.colValues[index]);
    },
  },
  render() {
    const { isFooterDisplay, classNames } = this;
    return (
      <div class={classNames}>
        {this.renderBody()}
        {isFooterDisplay ? this.renderFooter() : null}
      </div>
    );
  },
});
