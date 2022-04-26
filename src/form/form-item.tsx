import Vue, { VNode } from 'vue';
import { NormalizedScopedSlot } from 'vue/types/vnode';
import cloneDeep from 'lodash/cloneDeep';
import lodashGet from 'lodash/get';
import lodashSet from 'lodash/set';
import isNil from 'lodash/isNil';
import { CheckCircleFilledIcon, ErrorCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue';
import lodashTemplate from 'lodash/template';
import { prefix } from '../config';
import { validate } from './form-model';
import {
  Data,
  FormRule,
  TdFormItemProps,
  TdFormProps,
  ValueType,
  ValidateTriggerType,
  AllValidateResult,
  FormErrorMessage,
  FormItemValidateMessage,
} from './type';
import props from './form-item-props';
import { CLASS_NAMES, FORM_ITEM_CLASS_PREFIX } from './const';
import Form from './form';
import { ClassName, TNodeReturnValue, Styles } from '../common';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { FormConfig } from '../config-provider/config-receiver';

// type Result = ValidateResult<TdFormProps['data']>;

export type IconConstructor = typeof ErrorCircleFilledIcon;

export type FormInstance = InstanceType<typeof Form>;

export type FormItemValidateResult<T extends Data = Data> = { [key in keyof T]: boolean | AllValidateResult[] };

export const enum VALIDATE_STATUS {
  TO_BE_VALIDATED = 'not',
  SUCCESS = 'success',
  FAIL = 'fail',
}

export interface FormItemContructor extends Vue {
  form: FormInstance;
}

export default mixins(getConfigReceiverMixins<FormItemContructor, FormConfig>('form')).extend({
  name: 'TFormItem',

  props: { ...props },

  inject: {
    form: { default: undefined },
  },

  data() {
    return {
      // 校验不通过信息列表
      errorList: [],
      // 校验通过显示的内容
      successList: [],
      // 当前校验状态 未校验、校验通过、校验不通过
      verifyStatus: VALIDATE_STATUS.TO_BE_VALIDATED,
      resetValidating: false as boolean,
      needResetField: false as boolean,
      initialValue: undefined as ValueType,
    };
  },

  computed: {
    needErrorMessage(): Boolean {
      if (typeof this.showErrorMessage === 'boolean') return this.showErrorMessage;

      const parent = this.form;
      return parent?.showErrorMessage;
    },
    classes(): ClassName {
      return [
        CLASS_NAMES.formItem,
        FORM_ITEM_CLASS_PREFIX + this.name,
        {
          [CLASS_NAMES.formItemWithHelp]: this.help,
          [CLASS_NAMES.formItemWithExtra]: this.renderTipsInfo(),
        },
      ];
    },
    labelClasses(): ClassName {
      const parent = this.form;
      const labelAlign = isNil(this.labelAlign) ? parent?.labelAlign : this.labelAlign;
      const labelWidth = isNil(this.labelWidth) ? parent?.labelWidth : this.labelWidth;

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
      if (!this.needErrorMessage) return '';
      if (this.verifyStatus === VALIDATE_STATUS.SUCCESS) {
        return this.successBorder ? [CLASS_NAMES.success, CLASS_NAMES.successBorder].join(' ') : CLASS_NAMES.success;
      }
      const list = this.errorList;
      if (!list.length) return;
      const type = list[0].type || 'error';
      return type === 'error' ? CLASS_NAMES.error : CLASS_NAMES.warning;
    },

    disabled(): boolean {
      return this.form.disabled;
    },

    contentClasses(): ClassName {
      const getErrorClass: string = this.errorClasses;
      return [CLASS_NAMES.controls, getErrorClass];
    },
    contentStyle(): Styles {
      const parent = this.form;
      const labelAlign = isNil(this.labelAlign) ? parent?.labelAlign : this.labelAlign;
      const labelWidth = isNil(this.labelWidth) ? parent?.labelWidth : this.labelWidth;
      let contentStyle = {};
      if (this.getLabelContent() && labelWidth && labelAlign !== 'top') {
        if (typeof labelWidth === 'number') {
          contentStyle = { marginLeft: `${labelWidth}px` };
        } else {
          contentStyle = { marginLeft: labelWidth };
        }
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
      const { requiredMark } = this.$props;
      if (typeof requiredMark === 'boolean') return requiredMark;
      const parent = this.form;
      const parentRequiredMark = parent?.requiredMark === undefined ? this.global.requiredMark : parent.requiredMark;
      const isRequired = this.innerRules.filter((rule) => rule.required).length > 0;
      return Boolean(parentRequiredMark && isRequired);
    },
    innerRules(): FormRule[] {
      const parent = this.form;
      if (this.rules?.length) return this.rules || [];
      if (!this.name) return [];
      const index = this.name.lastIndexOf('.') || -1;
      const pRuleName = this.name.slice(index + 1);
      return lodashGet(parent?.rules, this.name) || lodashGet(parent?.rules, pRuleName) || [];
    },
    errorMessages(): FormErrorMessage {
      return this.form.errorMessage ?? this.global.errorMessage;
    },
  },

  watch: {
    value() {
      this.validate('change');
    },
  },

  created() {
    this.addWatch();
  },

  mounted() {
    this.initialValue = cloneDeep(this.value);
    this.form.$emit('form-item-created', this);
  },

  beforeDestroy() {
    this.form.$emit('form-item-destroyed', this);
  },

  methods: {
    addWatch() {
      if (this.disabled === undefined) return;
      this.$watch(
        'disabled',
        (val) => {
          this.$nextTick(() => {
            this.setChildrenDisabled(val, this.$children);
          });
        },
        { immediate: true },
      );
    },
    // 设置表单内组件的禁用状态
    setChildrenDisabled(disabled: boolean, children: Vue[]) {
      children.forEach((item) => {
        if (this.form.controlledComponents?.includes(item.$options.name)) {
          // eslint-disable-next-line no-param-reassign
          item.$data.formDisabled = disabled;
        }
        if (item.$children?.length) {
          this.setChildrenDisabled(disabled, item.$children);
        }
      });
    },
    // 设置表单错误信息
    setValidateMessage(validateMessage: FormItemValidateMessage[]) {
      if (!validateMessage || !Array.isArray(validateMessage)) return;
      if (validateMessage.length === 0) {
        this.errorList = [];
        this.verifyStatus = VALIDATE_STATUS.SUCCESS;
        return;
      }
      this.errorList = validateMessage;
      this.verifyStatus = VALIDATE_STATUS.FAIL;
    },
    // T 表示表单数据的类型
    async validate<T>(trigger: ValidateTriggerType): Promise<FormItemValidateResult<T>> {
      this.resetValidating = true;
      // 过滤不需要校验的规则
      const rules = trigger === 'all' ? this.innerRules : this.innerRules.filter((item) => (item.trigger || 'change') === trigger);
      // 校验结果，包含正确的校验信息
      const r = await validate(this.value, rules);
      const errorList = r
        .filter((item) => item.result !== true)
        .map((item) => {
          Object.keys(item).forEach((key) => {
            if (typeof item.message === 'undefined' && this.errorMessages[key]) {
              const compiled = lodashTemplate(this.errorMessages[key]);
              // eslint-disable-next-line no-param-reassign
              item.message = compiled({
                name: this.label,
                validate: item[key],
              });
            }
          });
          return item;
        });
      this.errorList = errorList;
      // 仅有自定义校验方法才会存在 successList
      this.successList = r.filter((item) => item.result === true && item.message && item.type === 'success');
      // 根据校验结果设置校验状态
      if (rules.length) {
        this.verifyStatus = errorList.length ? VALIDATE_STATUS.FAIL : VALIDATE_STATUS.SUCCESS;
      } else {
        this.verifyStatus = VALIDATE_STATUS.TO_BE_VALIDATED;
      }
      // 重置处理
      if (this.needResetField) {
        this.resetHandler();
      }
      this.resetValidating = false;
      return {
        [this.name]: errorList.length === 0 ? true : r,
      } as FormItemValidateResult<T>;
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
      const labelWidth = isNil(this.labelWidth) ? parent?.labelWidth : this.labelWidth;
      const labelAlign = isNil(this.labelAlign) ? parent?.labelAlign : this.labelAlign;
      if (Number(labelWidth) === 0) return;

      let labelStyle = {};
      if (labelWidth && labelAlign !== 'top') {
        if (typeof labelWidth === 'number') {
          labelStyle = { width: `${labelWidth}px` };
        } else {
          labelStyle = { width: labelWidth };
        }
      }

      return (
        <div class={this.labelClasses} style={labelStyle}>
          <label for={this.for}>{this.getLabelContent()}</label>
        </div>
      );
    },
    renderTipsInfo(): VNode {
      let helpVNode: VNode = <div class={CLASS_NAMES.help}></div>;
      if (this.help) {
        helpVNode = <div class={CLASS_NAMES.help}>{this.help}</div>;
      }
      const list = this.errorList;
      if (this.needErrorMessage && list && list[0] && list[0].message) {
        return <div class={CLASS_NAMES.extra}>{list[0].message}</div>;
      }
      if (this.successList.length) {
        return <div class={CLASS_NAMES.extra}>{this.successList[0].message}</div>;
      }
      return helpVNode;
    },
    getDefaultIcon(): TNodeReturnValue {
      const resultIcon = (Icon: IconConstructor) => (
        <span class={CLASS_NAMES.status}>
          <Icon></Icon>
        </span>
      );
      const list = this.errorList;
      if (this.verifyStatus === VALIDATE_STATUS.SUCCESS) {
        return resultIcon(CheckCircleFilledIcon);
      }
      if (list && list[0]) {
        const type = list[0].type || 'error';
        const icon = {
          error: CloseCircleFilledIcon,
          warning: ErrorCircleFilledIcon,
        }[type] || CheckCircleFilledIcon;
        return resultIcon(icon);
      }
      return null;
    },
    getIcon(
      statusIcon: TdFormProps['statusIcon'] | TdFormItemProps['statusIcon'],
      slotStatusIcon: NormalizedScopedSlot,
      props?: TdFormItemProps,
    ): TNodeReturnValue {
      const resultIcon = (otherContent?: TNodeReturnValue) => <span class={CLASS_NAMES.status}>{otherContent}</span>;
      if (statusIcon === true) {
        return this.getDefaultIcon();
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
      if (statusIcon === false) return;
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
      if (type === '[object String]') {
        emptyValue = '';
      }
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
      this.successList = [];
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
