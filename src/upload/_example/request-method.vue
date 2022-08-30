<template>
  <div class="tdesign-demo-block-column-large">
    <div>
      <t-radio-group variant="default-filled" v-model="uploadMethod">
        <t-radio-button value="requestSuccessMethod">上传成功示例</t-radio-button>
        <t-radio-button value="requestFailMethod">上传失败示例</t-radio-button>
      </t-radio-group>
    </div>

    <t-upload v-model="files" :requestMethod="requestMethod" tips="自定义上传方法需要返回成功或失败信息"></t-upload>
  </div>
</template>
<script>
/* eslint-disable no-param-reassign */
export default {
  data() {
    return {
      files: [],
      uploadMethod: 'requestSuccessMethod',
    };
  },
  computed: {
    requestMethod() {
      return this[this.uploadMethod];
    },
  },
  watch: {
    // 切换上传示例时，重置 files 数据
    uploadMethod() {
      this.files = [];
    },
  },
  methods: {
    // file 为等待上传的文件信息，用于提供给上传接口。file.raw 表示原始文件
    requestSuccessMethod(file /** UploadFile */) {
      console.log(file, file.raw);
      return new Promise((resolve) => {
        // file.percent 用于控制上传进度，如果不希望显示上传进度，则不对 file.percent 设置值即可。
        // 如果代码规范不能设置 file.percent，也可以设置 this.files
        file.percent = 0;
        const timer = setTimeout(() => {
          // resolve 参数为关键代码
          resolve({ status: 'success', response: { url: 'https://tdesign.gtimg.com/site/avatar.jpg' } });
          file.percent = 100;
          clearTimeout(timer);
        }, 500);
      });
    },
    requestFailMethod(file /** UploadFile */) {
      console.log(file);
      return new Promise((resolve) => {
        // resolve 参数为关键代码
        resolve({ status: 'fail', error: '上传失败，请检查文件是否符合规范' });
      });
    },
  },
};
</script>
