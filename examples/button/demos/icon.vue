<template>
  <div class="tdesign-demo-block-row">
    <t-button theme="primary">
      <t-icon-add slot="icon"/>
      新建
    </t-button>
    <t-button variant="outline">
      <t-icon-cloud-upload slot="icon"/>
      上传文件
    </t-button>
    <t-button shape="circle" theme="primary">
      <t-icon-discount slot="icon"/>
    </t-button>
    <t-button shape="circle" theme="primary">
      <t-icon-cloud-download slot="icon"/>
    </t-button>
    <t-button variant="outline" :icon="renderIcon">
      搜索
    </t-button>
  </div>
</template>
<script>
import TIconAdd from '@tencent/tdesign-vue/lib/icon/add';
import TIconCloudUpload from '@tencent/tdesign-vue/lib/icon/cloud-upload';
import TIconCloudDownload from '@tencent/tdesign-vue/lib/icon/cloud-download';
import TIconDiscount from '@tencent/tdesign-vue/lib/icon/discount';
import TIconSearch from '@tencent/tdesign-vue/lib/icon/search';

export default {
  components: {
    TIconAdd,
    TIconCloudUpload,
    TIconCloudDownload,
    TIconDiscount,
  },
  methods: {
    renderIcon() {
      return <TIconSearch />;
    },
  },
};
</script>
