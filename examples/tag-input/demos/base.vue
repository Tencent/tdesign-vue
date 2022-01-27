<template>
  <div class="tdesign-demo-block-column" style="width: 80%">
    <t-tag-input v-model="tags1" clearable @paste="onPaste" @enter="onTagInputEnter" />

    <t-tag-input :value="tags2" label="Controlled: " clearable @change="onChange" />

    <t-tag-input :default-value="tags3" label="UnControlled: " clearable />
  </div>
</template>
<script>
export default {
  data() {
    return {
      tags1: ['Vue', 'React'],
      tags2: ['Vue', 'React'],
      tags3: ['Vue', 'React'],
    };
  },
  methods: {
    onTagInputEnter: (val, context) => {
      console.log(val, context);
    },
    onChange: (val, context) => {
      console.log(val, context);
      this.tags2 = val;
    },
    onPaste: (context) => {
      console.log(context);
    },
  },
};
</script>
