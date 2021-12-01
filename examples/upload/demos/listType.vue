<template>
  <section class="tdesign-demo-upload">
    <header class="tdesign-demo-upload-header">
      <t-upload
        action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        :data="{ foo: 1, bar: 2 }"
        :files="files"
        :multiple="true"
        @change="handleChange"
        @preview="handlePreview"
        :showFileList="true">
        <div slot="trigger">
          <t-button variant="outline"><upload-icon slot="icon"/>选择文件</t-button>
          <p class="describe">请上传txt文件，大小在60M以内</p>
        </div>
      </t-upload>
    </header>
  </section>
</template>

<script>
import { UploadIcon } from 'tdesign-icons-vue';

export default {
  components: {
    UploadIcon,
  },
  data: () => ({
    files: [],
  }),
  methods: {
    handleChange(files) {
      console.log(files);
    },
    handlePreview(file) {
      console.log(file);
      window.open(file.thumbUrl);
    },
  },
};
</script>

<style lang="less" scoped>
.describe{
  color: rgb(153,153,153);
  font-size: 12px;
  margin-top: 12px;
}
</style>
