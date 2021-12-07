<template>
  <div>
    <t-list :split="true">
      <t-list-item>
        <t-list-item-meta :image="imageUrl" title="列表标题" description="列表内容列表内容"></t-list-item-meta>
        <template #action>
          <span>
            <t-button variant="text">操作1</t-button>
            <t-button variant="text">操作2</t-button>
            <t-button variant="text">操作3</t-button>
          </span>
        </template>
      </t-list-item>
      <t-list-item>
        <t-list-item-meta :image="imageUrl" title="列表标题" description="列表内容列表内容"></t-list-item-meta>
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
        <t-list-item-meta :image="imageUrl" title="列表标题" description="列表内容列表内容"></t-list-item-meta>
        <template #action>
          <t-button variant="text" shape="square"><edit-icon /></t-button>
          <t-button variant="text" shape="square"><download-icon /></t-button>
        </template>
      </t-list-item>
      <t-list-item>
        <t-list-item-meta :image="imageUrl" title="列表标题" description="列表内容列表内容"></t-list-item-meta>
        <template #action>
          <t-button variant="text" shape="square"><edit-icon /></t-button>
          <t-button variant="text" shape="square"><download-icon /></t-button>
        </template>
      </t-list-item>
    </t-list>
  </div>
</template>

<script>
import { EditIcon, DownloadIcon } from 'tdesign-icons-vue';

export default {
  components: { EditIcon, DownloadIcon },
  data() {
    return {
      imageUrl: 'https://tdesign.gtimg.com/site/avatar.jpg',
    };
  },
};
</script>
