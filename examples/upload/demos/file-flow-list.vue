<template>
  <div class="t-upload__file-flow-demo">
    <t-upload
      v-model="files"
      action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
      :placeholder="`支持批量上传文件，文件格式不限，最多只能上传 ${max} 份文件`"
      theme="file-flow"
      multiple
      :auto-upload="false"
      :max="max"
      :sizeLimit="{ size: 5, unit: 'MB', message: '文件大小不能超过5MB' }"
      @select-change="handleSelectChange"
    ></t-upload>
  </div>
</template>

<script>
import { MessagePlugin as Message } from 'tdesign-vue';

export default {
  name: 'TUploadFileFlow',

  data() {
    return {
      max: 5,
      files: [],
    };
  },
  methods: {
    handleSelectChange(selectFiles) {
      if (selectFiles.length > this.max) Message.error(`所选文件数量超过${this.max}份，只保留前${this.max}份文件`);
    },
  },
};
</script>
