<template>
  <t-list style="height: 300px" :scroll="{ type: 'virtual' }"
  ><t-list-item v-for="(item, index) in list" :key="index">
    <t-list-item-meta :image="imageUrl" title="列表标题" :description="item.content" /></t-list-item
  ></t-list>
</template>
<script>
const list = [];
const imageUrl = 'https://tdesign.gtimg.com/site/avatar.jpg';
for (let i = 0; i < 3000; i++) {
  list.push({ content: `第${i + 1}个列表内容的描述性文字` });
}

export default {
  data() {
    return {
      list,
      imageUrl,
    };
  },
};
</script>
