import Vue, { VNode, VueConstructor } from 'vue';
import { NormalizedScopedSlot } from 'vue/types/vnode';
import cloneDeep from 'lodash/cloneDeep';
import lodashGet from 'lodash/get';
import lodashSet from 'lodash/set';
import { prefix } from '../config';
import { validate } from './form-model';
import {
  ErrorList, TdFormItemProps, TdFormProps, ValidateResult, ValueType,
} from './type';
import props from './form-item-props';
import { CLASS_NAMES, FORM_ITEM_CLASS_PREFIX } from './const';
import Form from './form';
import { ClassName, TNodeReturnValue } from '../common';
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
      return [CLASS_NAMES.formItem, CLASS_NAMES.row, FORM_ITEM_CLASS_PREFIX + this.name];
    },
    labelClasses(): ClassName {
      const parent = this.form;
      const labelAlign = parent && parent.labelAlign;
      const layout = parent && parent.layout;
      let otherClasses = [];
      if (layout === 'inline') {
        otherClasses = [CLASS_NAMES.labelTop];
      } else {
        otherClasses = [`t-form__label--${labelAlign}`, labelAlign === 'top' ? CLASS_NAMES.col12 : CLASS_NAMES.col1];
      }
      return [
        CLASS_NAMES.col,
        CLASS_NAMES.label,
        ...otherClasses,
        {
          't-form__label--required': this.needRequiredMark,
          't-form__label--colon': this.hasColon,
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
      return [CLASS_NAMES.controls, CLASS_NAMES.col, getErrorClass];
    },
    labelProps(): Record<string, any> {
      const parent = this.form;
      const labelProps: Record<string, any> = {};
      const labelWidth = parent && parent.labelWidth;
      if (labelWidth) {
        labelProps.style = `min-width: ${labelWidth}px;`;
      }
      return labelProps;
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
      this.validate();
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
    async validate(): Promise<Result> {
      this.resetValidating = true;
      const r = await validate(this.value, this.innerRules);
      this.errorList = r;
      this.verifyStatus = this.errorList.length ? VALIDATE_STATUS.FAIL : VALIDATE_STATUS.SUCCESS;
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
      if (Number(labelWidth) === 0) return;
      return (
        <div class={this.labelClasses} {...this.labelProps}>
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
        <div class={this.contentClasses}>
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
