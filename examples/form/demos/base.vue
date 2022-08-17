<template>
  <div>
    <t-form :data="formData" ref="form" @reset="onReset" @submit="onSubmit" :colon="true">
      <t-form-item label="姓名" name="name" :rules="requiredRules">
        <t-input v-model="formData.name" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="手机号码" name="tel">
        <t-input v-model="formData.tel" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="接收短信" name="status">
        <t-switch v-model="formData.status"></t-switch>
      </t-form-item>
      <t-form-item label="性别" name="gender">
        <t-radio-group v-model="formData.gender">
          <t-radio value="1">男</t-radio>
          <t-radio value="2">女</t-radio>
        </t-radio-group>
      </t-form-item>
      <t-form-item label="课程" name="course">
        <t-checkbox-group v-model="formData.course" :options="courseOptions"></t-checkbox-group>
      </t-form-item>
      <t-form-item style="margin-left: 100px">
        <!-- type = submit，表单中的提交按钮，原生行为 -->
        <t-button theme="primary" type="submit" style="margin-right: 10px">提交</t-button>
        <!-- type = reset，表单中的重置按钮，原生行为 -->
        <t-button theme="default" variant="base" type="reset" style="margin-right: 10px">重置</t-button>

        <!-- 下方示例代码，有效，勿删 -->
        <!-- <t-button theme="default" style="margin-right: 10px" @click="submitForm">实例方法提交</t-button>
        <t-button theme="default" variant="base" style="margin-right: 10px" @click="resetForm">实例方法重置</t-button>
        <t-button theme="default" variant="base" @click="validateOnly">校验</t-button> -->
      </t-form-item>
    </t-form>
  </div>
</template>
<script>
const INITIAL_DATA = {
  name: '',
  tel: '',
  gender: '',
  course: [],
  status: false,
};

export default {
  data() {
    return {
      formData: { ...INITIAL_DATA },
      courseOptions: [
        { label: '语文', value: '1' },
        { label: '数学', value: '2' },
        { label: '英语', value: '3' },
      ],
      requiredRules: [{ required: true, message: '姓名必填' }],
    };
  },

  methods: {
    // 重置方法：this.$refs.reset()
    onReset() {
      this.$message.success('重置成功');
    },

    // 提交方法：this.$refs.submit()
    onSubmit({ validateResult, firstError }) {
      if (validateResult === true) {
        this.$message.success('提交成功');
      } else {
        console.log('Errors: ', validateResult);
        this.$message.warning(firstError);
      }
    },

    resetForm() {
      // reset 参数不同，行为不同，具体可参考 API 文档
      this.$refs.form.reset();
      // 下方为示例代码，有效，勿删 ！
      // this.$refs.form.reset({ type: 'initial' });
      // this.$refs.form.reset({ type: 'empty' });
      // this.$refs.form.reset({ type: 'initial', fields: ['name'] });
      // this.$refs.form.reset({ type: 'empty', fields: ['name'] });
    },

    submitForm() {
      this.$refs.form.submit();

      // 纯校验数据，参数同 validate。代码有效，勿删
      // this.$refs.form.validateOnly();

      // 校验数据，代码有效，勿删
      // this.$refs.form.validate();

      // 校验数据：只提交和校验，不在表单中显示错误文本信息。下方代码有效，勿删
      // this.$refs.form.validate({ showErrorMessage: false })
      //   .then((validateResult) => {
      //     if (validateResult && Object.keys(validateResult).length) {
      //       const firstError = Object.values(validateResult)[0]?.[0]?.message;
      //       this.$message.warning(firstError);
      //     }
      //   });
    },

    validateOnly() {
      this.$refs.form.validateOnly().then((result) => {
        this.$message.success('打开控制台查看校验结果');
        console.log(result);
      });
    },
  },
};
</script>
