import Vue, { VNode, VueConstructor } from 'vue';
import { NormalizedScopedSlot } from 'vue/types/vnode';
import cloneDeep from 'lodash/cloneDeep';
import lodashGet from 'lodash/get';
import lodashSet from 'lodash/set';
import { prefix } from '../config';
import { validate } from './form-model';
import {
  ErrorList, TdFormItemProps, TdFormProps, ValidateResult, ValueType, ValidateTriggerType,
} from './type';
import props from './form-item-props';
import { CLASS_NAMES, FORM_ITEM_CLASS_PREFIX } from './const';
import Form from './form';
import { ClassName, TNodeReturnValue, Styles } from '../common';
import TIconCheckCircleFilled from '../icon/check-circle-filled';
import TIconErrorCircleFilled from '../icon/error-circle-filled';
import TIconCloseCircleFilled from '../icon/close-circle-filled';

type Result = ValidateResult<TdFormProps['data']>;

type IconConstructor = typeof TIconErrorCircleFilled;

type FormInstance = InstanceType<typeof Form>;

export const enum VALIDATE_STATUS {
  TO_BE_VALIDATED = 'not',
  SUCCESS = 'success',
  FAIL = 'fail',
}

const name = `${prefix}-form-item`;

export interface FormItemContructor extends Vue {
  form: FormInstance;
}

export default (Vue as VueConstructor<FormItemContructor>).extend({
  name,

  props: { ...props },

  inject: {
    form: { default: undefined },
  },

  data() {
    return {
      errorList: [] as ErrorList,
      // 当前校验状态 未校验、校验通过、校验不通过
      verifyStatus: VALIDATE_STATUS.TO_BE_VALIDATED as VALIDATE_STATUS,
      resetValidating: false as boolean,
      needResetField: false as boolean,
      initialValue: undefined as ValueType,
    };
  },

  computed: {
    classes(): ClassName {
      return [CLASS_NAMES.formItem, FORM_ITEM_CLASS_PREFIX + this.name];
    },
    labelClasses(): ClassName {
      const parent = this.form;
      const labelAlign = parent && parent.labelAlign;
      const labelWidth = parent && parent.labelWidth;

      return [
        CLASS_NAMES.label,
        {
          [`${prefix}-form__label--required`]: this.needRequiredMark,
          [`${prefix}-form__label--colon`]: this.hasColon,
          [`${prefix}-form__label--top`]: labelAlign === 'top' || !labelWidth,
          [`${prefix}-form__label--left`]: labelAlign === 'left' && labelWidth,
          [`${prefix}-form__label--right`]: labelAlign === 'right' && labelWidth,
        },
      ];
    },
    errorClasses(): string {
      const parent = this.form;
      if (!parent.showErrorMessage) return '';
      if (this.verifyStatus === VALIDATE_STATUS.SUCCESS) return CLASS_NAMES.success;
      if (!this.errorList.length) return;
      const type = this.errorList[0].type || 'error';
      return type === 'error' ? CLASS_NAMES.error : CLASS_NAMES.warning;
    },
    contentClasses(): ClassName {
      const getErrorClass: string = this.errorClasses;
      return [CLASS_NAMES.controls, getErrorClass];
    },
    contentStyle(): Styles {
      const parent = this.form;
      const layout = parent && parent.layout;
      const labelAlign = parent && parent.labelAlign;
      const labelWidth = parent && parent.labelWidth;
      let contentStyle = {};
      if (labelWidth && labelAlign !== 'top' && layout !== 'inline') {
        contentStyle = { marginLeft: `${parseInt(String(labelWidth), 10)}px` };
      }

      return contentStyle;
    },
    value(): ValueType {
      const parent = this.form;
      return parent && parent.data && lodashGet(parent.data, this.name);
    },
    hasColon(): boolean {
      const parent = this.form;
      return !!(parent && parent.colon && this.getLabelContent());
    },
    needRequiredMark(): boolean {
      const parent = this.form;
      const allowMark = parent && parent.requiredMark;
      const isRequired = this.innerRules.filter((rule) => rule.required).length > 0;
      return Boolean(allowMark && isRequired);
    },
    innerRules(): ErrorList {
      const parent = this.form;
      const rules = parent && parent.rules;
      return (rules && rules[this.name]) || (this.rules || []);
    },
  },

  watch: {
    value() {
      this.validate('change');
    },
  },

  mounted() {
    this.initialValue = cloneDeep(this.value);
    this.form.$emit('form-item-created', this);
  },

  beforeDestroy() {
    this.form.$emit('form-item-destroyed', this);
  },

  methods: {
    async validate(trigger: ValidateTriggerType): Promise<Result> {
      this.resetValidating = true;
      const rules = trigger === 'all' ? this.innerRules : this.innerRules.filter((item) => (item.trigger || 'change') === trigger);
      const r = await validate(this.value, rules);
      this.errorList = r;
      this.verifyStatus = this.errorList.length ? VALIDATE_STATUS.FAIL : VALIDATE_STATUS.SUCCESS;
      if (!rules.length) this.verifyStatus = VALIDATE_STATUS.TO_BE_VALIDATED;
      if (this.needResetField) {
        this.resetHandler();
      }
      this.resetValidating = false;
      return ({
        [this.name]: r.length === 0 ? true : r,
      });
    },
    getLabelContent(): TNodeReturnValue {
      if (typeof this.label === 'function') {
        return this.label(this.$createElement);
      }
      if (typeof this.$scopedSlots.label === 'function') {
        return this.$scopedSlots.label(null);
      }
      return this.label;
    },
    getLabel(): TNodeReturnValue {
      const parent = this.form;
      const labelWidth = parent && parent.labelWidth;
      const labelAlign = parent && parent.labelAlign;
      if (Number(labelWidth) === 0) return;

      let labelStyles = {};
      if (labelWidth && labelAlign !== 'top') {
        labelStyles = { width: `${parseInt(String(labelWidth), 10)}px` };
      }

      return (
        <div class={this.labelClasses} style={labelStyles}>
          <label for={this.for}>
            {this.getLabelContent()}
          </label>
        </div>
      );
    },
    renderTipsInfo(): VNode {
      const parent = this.form;
      let helpVNode: VNode;
      if (this.help) {
        helpVNode = <div class={CLASS_NAMES.help}>{this.help}</div>;
      }
      const list = this.errorList;
      if (parent.showErrorMessage && list && list[0] && list[0].message) {
        return (
          <div>
            <span class={CLASS_NAMES.extra}>{list[0].message}</span>
          </div>
        );
      }
      return helpVNode;
    },
    getDefaultIcon(): TNodeReturnValue {
      const resultIcon = (Icon: IconConstructor) => (
        <span class={CLASS_NAMES.status}>
          <Icon size='25px'></Icon>
        </span>
      );
      const list = this.errorList;
      if (this.verifyStatus === VALIDATE_STATUS.SUCCESS) {
        return resultIcon(TIconCheckCircleFilled);
      }
      if (list && list[0]) {
        const type = this.errorList[0].type || 'error';
        const icon = {
          error: TIconCloseCircleFilled,
          warning: TIconErrorCircleFilled,
        }[type] || TIconCheckCircleFilled;
        return resultIcon(icon);
      }
      return null;
    },
    getIcon(
      statusIcon: TdFormProps['statusIcon'] | TdFormItemProps['statusIcon'],
      slotStatusIcon: NormalizedScopedSlot,
      props?: TdFormItemProps,
    ): TNodeReturnValue {
      const resultIcon = (otherContent?: TNodeReturnValue) => (
        <span class={CLASS_NAMES.status}>{otherContent}</span>
      );
      const withoutIcon = () => (
        <span class={[CLASS_NAMES.status, `${CLASS_NAMES.status}-without-icon`]}>
        </span>
      );
      if (statusIcon === true) {
        return this.getDefaultIcon();
      }
      if (statusIcon === false) {
        return withoutIcon();
      }
      if (typeof statusIcon === 'function') {
        return resultIcon(statusIcon(this.$createElement, props));
      }
      if (typeof slotStatusIcon === 'function') {
        return resultIcon(slotStatusIcon(null));
      }
      return null;
    },
    getSuffixIcon(): TNodeReturnValue {
      const parent = this.form;
      const { statusIcon } = this;
      const slotStatusIcon = this.$scopedSlots.statusIcon;
      const parentStatusIcon = parent.statusIcon;
      const parentSlotStatusIcon = parent.$scopedSlots.statusIcon;
      let resultIcon: TNodeReturnValue = this.getIcon(statusIcon, slotStatusIcon);
      if (resultIcon) return resultIcon;
      if (resultIcon === false) return;
      resultIcon = this.getIcon(parentStatusIcon, parentSlotStatusIcon, this.$props);
      if (resultIcon) return resultIcon;
    },
    getEmptyValue(): ValueType {
      const parent = this.form;
      const type = Object.prototype.toString.call(lodashGet(parent.data, this.name));
      let emptyValue: ValueType;
      if (type === '[object Array]') {
        emptyValue = [];
      }
      if (type === '[object Object]') {
        emptyValue = {};
      }
      return emptyValue;
    },
    resetField(): void {
      const parent = this.form;
      if (!this.name) {
        return;
      }
      if (parent.resetType === 'empty') {
        lodashSet(parent.data, this.name, this.getEmptyValue());
      }
      if (parent.resetType === 'initial') {
        lodashSet(parent.data, this.name, this.initialValue);
      }
      Vue.nextTick(() => {
        if (this.resetValidating) {
          this.needResetField = true;
        } else {
          this.resetHandler();
        }
      });
    },
    resetHandler(): void {
      this.needResetField = false;
      this.errorList = [];
      this.verifyStatus = VALIDATE_STATUS.TO_BE_VALIDATED;
    },
  },

  render(): VNode {
    return (
      <div class={this.classes}>
        {this.getLabel()}
        <div class={this.contentClasses} style={this.contentStyle}>
          <div class={CLASS_NAMES.controlsContent}>
            {this.$slots.default}
            {this.getSuffixIcon()}
          </div>
          {this.renderTipsInfo()}
        </div>
      </div>
    );
  },
});
