<template>
  <div class="tdesign-demo-upload">
    <div class="tdesign-demo-upload-item">
      <t-upload
        action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        v-model="file1"
        @fail="handleFail"
        theme="image"
        tips="请选择单张图片文件上传（上传成功状态演示）"
        accept="image/*"
      ></t-upload>
    </div>
    <div class="tdesign-demo-upload-item">
      <t-upload
        action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        v-model="fileFail"
        theme="image"
        tips="请选择单张图片文件上传（上传失败状态演示）"
        accept="image/*"
        :formatResponse="formatResponse"
      ></t-upload>
    </div>
    <div class="tdesign-demo-upload-item">
      <t-upload
        action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        v-model="file2"
        @fail="handleFail"
        theme="image"
        tips="请选择单张图片文件上传（自定义预览图片地址）"
        accept="image/*"
        :formatResponse="formatImgResponse"
      ></t-upload>
    </div>
    <div class="tdesign-demo-upload-item">
      <t-upload
        action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        v-model="files"
        @fail="handleFail"
        theme="image"
        tips="允许选择多张图片文件上传，最多只能上传 3 张图片"
        accept="image/*"
        multiple
        :max="3"
      ></t-upload>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      file1: [],
      file2: [],
      files: [],
      fileFail: [],
    };
  },
  methods: {
    // formatResponse 返回后的 url 优先级高于接口返回的 url
    formatImgResponse() {
      return { url: 'https://tdesign.gtimg.com/site/avatar.jpg' };
    },
    // 一旦 formatResponse 返回值包含 error，便会被组件判定为上传失败
    formatResponse() {
      return { error: '网络异常，图片上传失败' };
    },
    handleFail({ file }) {
      this.$message.error(`文件 ${file.name} 上传失败`);
    },
  },
};
</script>

<style scoped>
.tdesign-demo-upload-item {
  display: inline-block;
  margin-right: 80px;
}
.tdesign-demo-upload-item + .tdesign-demo-upload-item {
  margin-top: 80px;
}
</style>
