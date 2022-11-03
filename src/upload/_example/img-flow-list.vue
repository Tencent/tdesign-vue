<template>
  <t-space direction="vertical">
    <div>
      是否自动上传：
      <t-switch v-model="autoUpload" />
    </div>
    <br />
    <t-upload
      v-model="files"
      action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
      placeholder="支持批量上传图片文件"
      theme="image-flow"
      accept="image/*"
      multiple
      :auto-upload="autoUpload"
      :max="8"
      @dragenter="onDragenter"
      @dragleave="onDragleave"
      @drop="onDrop"
    ></t-upload>
  </t-space>
</template>

<script>
export default {
  name: 'TUploadImageFlow',

  data() {
    return {
      autoUpload: false,
      files: [
        // {
        //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //   name: 'loading.svg',
        // },
      ],
    };
  },

  methods: {
    onDragenter(p) {
      console.log('dragenter', p);
    },
    onDragleave(p) {
      console.log('dragleave', p);
    },
    onDrop(p) {
      console.log('drop', p);
    },
  },
};
</script>
