<template>
  <div class="tdesign-tree-demo">
    <t-tree :data="items" activable hover transition/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [{
        label: '第一段',
        children: [{
          label: '第二段',
        }, {
          label: '第二段',
        }],
      }, {
        label: '第一段',
        children: [{
          label: '第二段',
        }, {
          label: '第二段',
        }],
      }, {
        label: '第一段',
        children: [{
          label: '第二段',
        }, {
          label: '第二段',
        }],
      }, {
        label: '第一段',
        children: [{
          label: '第二段',
        }, {
          label: '第二段',
        }],
      }],
    };
  },
};
</script>

<style>
.tdesign-tree-demo .t-tree {
  margin-bottom: 20px;
}
.tdesign-tree-demo .title{
  margin-bottom: 10px;
}
.tdesign-tree-demo .tips{
  margin-bottom: 10px;
}
.tdesign-tree-demo .operations{
  margin-bottom: 10px;
}
.tdesign-tree-demo .t-form__item {
  margin-bottom: 5px;
}
.tdesign-tree-demo .t-button{
  margin: 0 10px 10px 0;
}
</style>
