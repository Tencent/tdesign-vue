<template>
  <t-space direction="vertical">
    <t-space breakLine>
      <t-checkbox v-model="disabled">禁用状态</t-checkbox>
      <t-checkbox v-model="autoUpload">自动上传</t-checkbox>
      <t-checkbox v-model="showThumbnail">显示文件缩略图</t-checkbox>
      <t-checkbox v-model="allowUploadDuplicateFile"> 允许上传同名文件 </t-checkbox>
      <t-checkbox v-model="isBatchUpload"> 整体替换上传 </t-checkbox>
      <t-checkbox v-model="uploadAllFilesInOneRequest"> 多个文件一个请求上传 </t-checkbox>
    </t-space>

    <br />

    <t-upload
      v-model="files"
      action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
      placeholder="支持批量上传文件，文件格式不限，最多只能上传 10 份文件"
      theme="file-flow"
      multiple
      :disabled="disabled"
      :abridge-name="ABRIDGE_NAME"
      :auto-upload="autoUpload"
      :show-thumbnail="showThumbnail"
      :max="max"
      :allow-upload-duplicate-file="allowUploadDuplicateFile"
      :is-batch-upload="isBatchUpload"
      :upload-all-files-in-one-request="uploadAllFilesInOneRequest"
      :format-response="formatResponse"
      @dragenter="onDragenter"
      @dragleave="onDragleave"
      @drop="onDrop"
    ></t-upload>
  </t-space>
</template>

<script setup>
import { ref } from 'vue';

const max = ref(10);
const files = ref([]);
const disabled = ref(false);
const autoUpload = ref(false);
const allowUploadDuplicateFile = ref(false);
const isBatchUpload = ref(false);
const uploadAllFilesInOneRequest = ref(false);
const ABRIDGE_NAME = ref([10, 7]);
const showThumbnail = ref(false);
const onDragenter = (p) => {
  console.log('dragenter', p);
};
const onDragleave = (p) => {
  console.log('dragleave', p);
};
const onDrop = (p) => {
  console.log('drop', p);
};
const formatResponse = (res) => {
  if (!res) {
    return {
      status: 'fail',
      error: '上传失败，原因：文件过大或网络不通',
    };
  }
  return res;
};
</script>
