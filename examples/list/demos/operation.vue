<template>
  <div>
    <t-list :split="true">
      <t-list-item>
        <t-list-item-meta :avatar="avatarUrl" title="列表主内容" description="列表内容列表内容"></t-list-item-meta>
        <template #action>
          <span>
            <t-button variant="text">操作1</t-button>
            <t-button variant="text">操作2</t-button>
            <t-button variant="text">操作3</t-button>
          </span>
        </template>
      </t-list-item>
      <t-list-item>
        <t-list-item-meta :avatar="avatarUrl" title="列表主内容" description="列表内容列表内容"></t-list-item-meta>
        <template #action>
          <span>
            <t-button variant="text">操作1</t-button>
            <t-button variant="text">操作2</t-button>
            <t-button variant="text">操作3</t-button>
          </span>
        </template>
      </t-list-item>
    </t-list>

    <div style="margin-bottom: 16px"></div>

    <t-list :split="true">
      <t-list-item>
        <t-list-item-meta :avatar="avatarUrl" title="列表主内容" description="列表内容列表内容"></t-list-item-meta>
        <template #action>
          <li><t-icon-edit /></li>
          <li><t-icon-download /></li>
        </template>
      </t-list-item>
      <t-list-item>
        <t-list-item-meta :avatar="avatarUrl" title="列表主内容" description="列表内容列表内容"></t-list-item-meta>
        <template #action>
          <li><t-icon-edit /></li>
          <li><t-icon-download /></li>
        </template>
      </t-list-item>
    </t-list>
  </div>
</template>

<script>
import TIconEdit from '@tencent/tdesign-vue/lib/icon/edit';
import TIconDownload from '@tencent/tdesign-vue/lib/icon/download';

export default {
  components: { TIconEdit, TIconDownload },
  data() {
    return {
      avatarUrl: 'https://tdesign.gtimg.com/list-icon.png',
    };
  },
};
</script>
