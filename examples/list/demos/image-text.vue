<template>
  <div>
    <t-list :split="true">
      <t-list-item>
        <t-list-item-meta
          :image="imageUrl"
          title="列表主内容"
          description="列表内容列表内容"
        ></t-list-item-meta>
      </t-list-item>
      <t-list-item>
        <t-list-item-meta
          :image="imageUrl"
          title="列表主内容"
          description="列表内容列表内容"
        ></t-list-item-meta>
      </t-list-item>
      <t-list-item>
        <t-list-item-meta
          :image="imageUrl"
          title="列表主内容"
          description="列表内容列表内容"
        ></t-list-item-meta>
      </t-list-item>
    </t-list>

    <div style="margin-bottom:16px"></div>

    <t-list :split="true">
      <t-list-item>
        <t-list-item-meta
          :image="imageUrl"
          title="列表主内容"
        >
          <template slot="description">
            <p>列表内容列表内容列表内容</p>
            <p>列表内容列表内容列表内容</p>
            <p>列表内容列表内容列表内容</p>
            <p>列表内容列表内容列表内容</p>
            <p>列表内容列表内容列表内容</p>
          </template>
        </t-list-item-meta>
      </t-list-item>
    </t-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: 'https://tdesign.gtimg.com/list-icon.png',
    };
  },
};
</script>
