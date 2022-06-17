import Vue, { VNode } from 'vue';
import isEmpty from 'lodash/isEmpty';
import { prefix } from '../config';
import {
  Data,
  FormValidateResult,
  TdFormProps,
  FormValidateParams,
  AllValidateResult,
  FormValidateMessage,
  FormResetParams,
} from './type';
import props from './props';
import { FORM_ITEM_CLASS_PREFIX, CLASS_NAMES, FORM_CONTROL_COMPONENTS } from './const';
import { emitEvent } from '../utils/event';
import FormItem, { FormItemValidateResult } from './form-item';
import { FormResetEvent, FormSubmitEvent, ClassName } from '../common';

type FormItemInstance = InstanceType<typeof FormItem>;

const name = `${prefix}-form`;

export default Vue.extend({
  name: 'TForm',

  props: { ...props },

  provide(): { form: Vue } {
    return {
      form: this,
    };
  },

  data() {
    return {
      children: [] as Array<FormItemInstance>,
    };
  },

  computed: {
    formClass(): ClassName {
      return [
        CLASS_NAMES.form,
        {
          [`${name}-inline`]: this.layout === 'inline',
        },
      ];
    },
    controlledComponents(): string[] {
      let fields = FORM_CONTROL_COMPONENTS;
      if (this.formControlledComponents?.length) {
        fields = fields.concat(this.formControlledComponents);
      }
      return fields;
    },
  },

  created() {
    this.$on('form-item-created', (formItem: FormItemInstance) => {
      this.children.push(formItem);
    });
    this.$on('form-item-destroyed', (formItem: FormItemInstance) => {
      const index = this.children.findIndex((item) => item === formItem);
      this.children.splice(index, 1);
    });
  },

  methods: {
    getFirstError<T>(r: boolean | FormItemValidateResult<T>) {
      if (r === true) return;
      const [firstKey] = Object.keys(r);
      if (this.scrollToFirstError) {
        this.scrollTo(`.${FORM_ITEM_CLASS_PREFIX + firstKey}`);
      }
      return r[firstKey][0].message;
    },

    // 校验不通过时，滚动到第一个错误表单
    scrollTo(selector: string) {
      const dom = this.$el.querySelector(selector);
      const behavior = this.scrollToFirstError as ScrollBehavior;
      dom && dom.scrollIntoView({ behavior });
    },

    isFunction(val: unknown) {
      return typeof val === 'function';
    },

    needValidate(name: string, fields: string[]) {
      if (!fields || !Array.isArray(fields)) return true;
      return fields.indexOf(name) !== -1;
    },

    formatValidateResult<T>(arr: Awaited<FormItemValidateResult<T>>[]) {
      const r = arr.reduce((r, err) => Object.assign(r || {}, err));
      Object.keys(r).forEach((key) => {
        if (r[key] === true) {
          delete r[key];
        } else {
          r[key] = r[key].filter((fr: AllValidateResult) => fr.result === false);
        }
      });
      return isEmpty(r) ? true : r;
    },

    // 对外方法，showErrorMessage = true 时，该方法会触发表单组件错误信息显示
    async validate<T = Record<string, any>>(
      param: FormValidateParams = { showErrorMessage: true },
      source: 'submit-function' | 'submit-event' = 'submit-function',
    ): Promise<FormValidateResult<T>> {
      const { fields, trigger = 'all' } = param || {};
      const list = this.children
        .filter((child) => this.isFunction(child.validate) && this.needValidate(String(child.name), fields))
        .map((child) => child.validate<T>(trigger, param.showErrorMessage, source));
      const arr = await Promise.all(list);
      const result = this.formatValidateResult(arr);
      emitEvent<Parameters<TdFormProps['onValidate']>>(this, 'validate', {
        validateResult: result,
        firstError: this.getFirstError<T>(result),
      });
      return result;
    },

    // 对外方法，仅返回校验结果，不改动任何变量
    async validateOnly<T = Record<string, any>>(
      param: Pick<FormValidateParams, 'fields' | 'trigger'>,
    ): Promise<FormValidateResult<T>> {
      const { fields, trigger = 'all' } = param || {};
      const list = this.children
        .filter((child) => this.isFunction(child.validate) && this.needValidate(String(child.name), fields))
        .map((child) => child.validateOnly<T>(trigger));
      const arr = await Promise.all(list);
      const result = this.formatValidateResult(arr);
      return result;
    },

    setValidateMessage(validateMessage: FormValidateMessage<FormData>) {
      const keys = Object.keys(validateMessage || {});
      if (!keys.length) return;
      const list = this.children
        .filter((child) => this.isFunction(child.setValidateMessage) && keys.includes(String(child.name)))
        .map((child) => child.setValidateMessage(validateMessage[child.name]));
      Promise.all(list);
    },

    submitHandler<T>(e?: FormSubmitEvent) {
      if (this.preventSubmitDefault) {
        e?.preventDefault();
        e?.stopPropagation();
      }
      this.validate<T>({ showErrorMessage: true }, 'submit-event').then((r) => {
        emitEvent<Parameters<TdFormProps['onSubmit']>>(this, 'submit', {
          validateResult: r,
          firstError: this.getFirstError<T>(r),
          e,
        });
      });
    },

    resetHandler(e?: FormResetEvent) {
      if (this.preventSubmitDefault) {
        e?.preventDefault();
        e?.stopPropagation();
      }
      this.children
        .filter((child) => this.isFunction(child.resetField))
        .forEach((child) => child.resetField(this.resetType || 'initial'));
      emitEvent<Parameters<TdFormProps['onReset']>>(this, 'reset', { e });
    },

    clearValidate(fields?: Array<string>) {
      this.children.forEach((child) => {
        if (this.isFunction(child.resetHandler) && this.needValidate(String(child.name), fields)) {
          child.resetHandler();
        }
      });
    },

    // exposure function, If there is no reset button in form, this function can be used
    reset<T = FormData>(params: FormResetParams<T> = {}) {
      this.children
        .filter((child) => this.isFunction(child.resetField))
        .forEach((child) => {
          const resetType = params.type || this.resetType || 'initial';
          if (!params.fields || (params.fields && params.fields.includes(child.name as keyof T))) {
            child.resetField(resetType);
          }
        });
      emitEvent<Parameters<TdFormProps['onReset']>>(this, 'reset', { e: undefined });
    },

    // exposure function, If there is no submit button in form, this function can be used
    submit<T extends Data = Data>(params?: { showErrorMessage?: boolean }) {
      this.validate<T>({ showErrorMessage: params?.showErrorMessage }, 'submit-function').then((r) => {
        emitEvent<Parameters<TdFormProps['onSubmit']>>(this, 'submit', {
          validateResult: r,
          firstError: this.getFirstError<T>(r),
        });
      });
    },
  },

  render(): VNode {
    const on = {
      submit: this.submitHandler,
      reset: this.resetHandler,
    };
    return (
      <form ref="form" class={this.formClass} {...{ on }}>
        {this.$slots.default}
      </form>
    );
  },
});
