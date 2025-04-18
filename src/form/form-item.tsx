import Vue, { VNode } from 'vue';
import { NormalizedScopedSlot } from 'vue/types/vnode';
import {
  cloneDeep, get as lodashGet, set as lodashSet, isNil, template as lodashTemplate,
} from 'lodash-es';
import {
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  CloseCircleFilledIcon as TdCloseCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
  GlobalIconType,
} from 'tdesign-icons-vue';
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
import { AnalysisValidateResult, ErrorListType, SuccessListType } from './const';
import Form from './form';
import { ClassName, TNodeReturnValue, Styles } from '../common';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { FormConfig, getGlobalIconMixins } from '../config-provider/config-receiver';
import log from '../_common/js/log';
import { renderTNodeJSX } from '../utils/render-tnode';

// type Result = ValidateResult<TdFormProps['data']>;

export type FormInstance = InstanceType<typeof Form>;

export type FormItemValidateResult<T extends Data = Data> = { [key in keyof T]: boolean | AllValidateResult[] };

export const enum VALIDATE_STATUS {
  TO_BE_VALIDATED = 'not',
  SUCCESS = 'success',
  FAIL = 'fail',
}

export interface FormItemConstructor extends Vue {
  form: FormInstance;
}

export function getFormItemClassName(componentName: string, name?: string) {
  if (!name) return '';
  return `${componentName}-item__${name}`.replace(/(\[|\]\.|'|")/g, '_');
}

export default mixins(getConfigReceiverMixins<FormItemConstructor, FormConfig>('form'), getGlobalIconMixins()).extend({
  name: 'TFormItem',

  props: { ...props },

  inject: {
    form: { default: undefined },
  },

  provide(): { tFormItem: any } {
    return {
      tFormItem: this,
    };
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
      // 是否为自由控制是否显示错误信息
      freeShowErrorMessage: undefined,
    };
  },

  computed: {
    needErrorMessage(): Boolean {
      if (this.freeShowErrorMessage !== undefined) return this.freeShowErrorMessage;
      if (typeof this.showErrorMessage === 'boolean') return this.showErrorMessage;
      const parent = this.form;
      return parent?.showErrorMessage;
    },
    classes(): ClassName {
      return [
        `${this.componentName}__item`,
        getFormItemClassName(this.componentName, this.name),
        {
          [`${this.componentName}__item-with-help`]: this.help,
          [`${this.componentName}__item-with-extra`]: this.extraNode,
        },
      ];
    },
    extraNode() {
      const list = this.errorList;
      if (this.needErrorMessage && list && list[0] && list[0].message) {
        return <div class={`${this.classPrefix}-input__extra`}>{list[0].message}</div>;
      }
      if (this.successList.length) {
        return <div class={`${this.classPrefix}-input__extra`}>{this.successList[0].message}</div>;
      }
      return null;
    },
    labelClasses(): ClassName {
      const parent = this.form;
      const labelAlign = isNil(this.labelAlign) ? parent?.labelAlign : this.labelAlign;
      const labelWidth = isNil(this.labelWidth) ? parent?.labelWidth : this.labelWidth;

      return [
        `${this.componentName}__label`,
        {
          [`${this.componentName}__label--required`]: this.needRequiredMark,
          [`${this.componentName}__label--required-right`]:
            this.needRequiredMark && this.requiredMarkPosition === 'right',
          [`${this.componentName}__label--top`]: this.getLabelContent() && (labelAlign === 'top' || !labelWidth),
          [`${this.componentName}__label--left`]: labelAlign === 'left' && labelWidth,
          [`${this.componentName}__label--right`]: labelAlign === 'right' && labelWidth,
        },
      ];
    },
    errorClasses(): string {
      if (!this.needErrorMessage) return '';
      if (this.verifyStatus === VALIDATE_STATUS.SUCCESS) {
        return this.successBorder
          ? [this.commonStatusClassName.success, `${this.componentName}--success-border`].join(' ')
          : this.commonStatusClassName.success;
      }
      if (this.status) return this.statusClass;
      const list = this.errorList;
      if (!list.length) return;
      const type = list[0].type || 'error';
      return type === 'error' ? this.commonStatusClassName.error : this.commonStatusClassName.warning;
    },

    disabled(): boolean {
      return this.form.disabled;
    },

    contentClasses(): ClassName {
      const getErrorClass: string = this.errorClasses;
      return [`${this.componentName}__controls`, getErrorClass];
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
      const requiredMark = this.$props.requiredMark ?? this.form.requiredMark ?? this.global.requiredMark;
      const isRequired = this.innerRules.filter((rule) => rule.required).length > 0;
      return requiredMark || (requiredMark ?? isRequired);
    },
    requiredMarkPosition(): string {
      return this.form.requiredMarkPosition ?? 'left';
    },
    innerRules(): FormRule[] {
      const parent = this.form;
      if (this.rules?.length) return this.rules || [];
      if (!this.name) return [];
      const index = String(this.name || '').lastIndexOf('.') || -1;
      const pRuleName = String(this.name || '').slice(index + 1);
      return lodashGet(parent?.rules, this.name) || lodashGet(parent?.rules, pRuleName) || [];
    },
    errorMessages(): FormErrorMessage {
      return this.form.errorMessage ?? this.global.errorMessage;
    },
    statusClass(): string {
      return `${this.classPrefix}-is-${this.$props.status || 'default'} ${
        this.$props.status === 'success' ? `${this.componentName}--success-border` : ''
      }`;
    },
  },

  created() {
    this.addWatch();
    this.$watch(
      () => {
        if (typeof this.value === 'object') return JSON.stringify(this.value);
        return this.value;
      },
      () => {
        this.validate('change');
      },
    );
    this.$watch(
      () => [this.name, JSON.stringify(this.rules)].join(','),
      () => {
        this.validate('change');
      },
    );
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
    async validate<T>(
      trigger: ValidateTriggerType,
      showErrorMessage = true,
      source: 'submit-function' | 'submit-event' = 'submit-event',
    ): Promise<FormItemValidateResult<T>> {
      this.freeShowErrorMessage = source === 'submit-function' ? showErrorMessage : undefined;
      this.resetValidating = true;
      const {
        errorList, resultList, successList, rules, allowSetValue,
      } = await this.analysisValidateResult(trigger);
      if (allowSetValue) {
        this.errorList = errorList;
        // 仅有自定义校验方法才会存在 successList
        this.successList = successList;
      }
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
        [this.name]: errorList.length === 0 ? true : resultList,
      } as FormItemValidateResult<T>;
    },

    async validateOnly<T>(trigger: ValidateTriggerType) {
      const { errorList, resultList } = await this.analysisValidateResult(trigger);
      return {
        [this.name]: errorList.length === 0 ? true : resultList,
      } as FormItemValidateResult<T>;
    },

    async analysisValidateResult(trigger: ValidateTriggerType) {
      const result: AnalysisValidateResult = {
        successList: [],
        errorList: [],
        rules: [],
        resultList: [],
        allowSetValue: false,
      };
      // 过滤不需要校验的规则
      result.rules = trigger === 'all'
        ? this.innerRules
        : this.innerRules.filter((item) => {
          const { trigger: validateTrigger = 'change' } = item;
          if (Array.isArray(validateTrigger)) {
            return validateTrigger.includes(trigger);
          }

          return trigger === validateTrigger;
        });
      if (this.innerRules.length && !result.rules.length) {
        return result;
      }
      // 校验结果，包含正确的校验信息
      result.allowSetValue = true;
      result.resultList = await validate(this.value, result.rules);
      result.errorList = result.resultList
        .filter((item) => item.result !== true)
        .map((item: ErrorListType) => {
          Object.keys(item).forEach((key) => {
            if (typeof item.message === 'undefined' && this.errorMessages[key]) {
              const compiled = lodashTemplate(this.errorMessages[key]);
              const name = typeof this.label === 'string' ? this.label : this.name;
              // eslint-disable-next-line no-param-reassign
              item.message = compiled({
                name,
                validate: item[key],
              });
            }
          });
          return item;
        });
      // 仅有自定义校验方法才会存在 successList
      result.successList = result.resultList.filter(
        (item) => item.result === true && item.message && item.type === 'success',
      ) as SuccessListType[];
      return result;
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
      const labelContent = this.getLabelContent();
      if (!labelContent) return null;

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
          <label for={this.for}>{labelContent}</label>
          {this.hasColon && this.global.colonText}
        </div>
      );
    },
    getDefaultIcon(): TNodeReturnValue {
      const resultIcon = (Icon: GlobalIconType) => (
        <span class={`${this.componentName}__status`}>
          <Icon />
        </span>
      );
      const list = this.errorList;
      const { CheckCircleFilledIcon, CloseCircleFilledIcon, ErrorCircleFilledIcon } = this.useGlobalIcon({
        CheckCircleFilledIcon: TdCheckCircleFilledIcon,
        CloseCircleFilledIcon: TdCloseCircleFilledIcon,
        ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
      });
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
      const resultIcon = (otherContent?: TNodeReturnValue) => (
        <span class={`${this.componentName}__status`}>{otherContent}</span>
      );
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
    resetField(resetType: 'empty' | 'initial' = 'initial') {
      const parent = this.form;
      if (!this.name && this.label) {
        log.warn('Form', 'name is required for validating.');
        return;
      }
      const tResetType = resetType || parent.resetType;
      if (tResetType === 'empty') {
        lodashSet(parent.data, this.name, this.getEmptyValue());
      }
      if (tResetType === 'initial') {
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
    const helpNode = renderTNodeJSX(this, 'help');
    const tipsNode = renderTNodeJSX(this, 'tips');

    return (
      <div class={this.classes}>
        {this.getLabel()}
        <div class={this.contentClasses} style={this.contentStyle}>
          <div class={`${this.componentName}__controls-content`}>
            {this.$slots.default}
            {this.getSuffixIcon()}
          </div>
          {helpNode && <div class={`${this.classPrefix}-input__help`}>{helpNode}</div>}
          {tipsNode && (
            <div class={[`${this.componentName}-tips`, `${this.classPrefix}-tips`, this.statusClass]}>{tipsNode}</div>
          )}
          {this.extraNode}
        </div>
      </div>
    );
  },
});
