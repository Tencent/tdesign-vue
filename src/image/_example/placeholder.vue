<template>
  <div>
    <t-space :size="24" direction="vertical">
      <div>
        <h3 :style="{ 'margin-bottom': '15px' }">加载中的图片</h3>
        <t-space>
          <t-space direction="vertical">
            <span>默认占位</span>
            <t-image
              src="https://tdesign.gtimg.com/demo/demo-image-1.png"
              :key.sync="loadingCount"
              :style="{ width: '284px', height: '160px' }"
            />
            <t-button variant="outline" :icon="renderIcon" @click="loadCount = loadCount + 1"> 重演 loading </t-button>
          </t-space>
          <t-space direction="vertical">
            <span>自定义占位</span>
            <t-image
              :key.sync="loadingCount"
              src="https://tdesign.gtimg.com/demo/demo-image-1.png"
              :style="{ width: '284px', height: '160px' }"
              :loading="renderCustomIcon"
            />
          </t-space>
        </t-space>
      </div>
      <div>
        <h3 :style="{ 'margin-bottom': '15px' }">加载失败的图片</h3>
        <t-space>
          <t-space direction="vertical">
            <span>默认错误</span>
            <t-image src="" :key.sync="errorCount" :style="{ width: '284px', height: '160px' }" />
            <t-button variant="outline" :icon="renderIcon" @click="errorCount = errorCount + 1"> 重演 error </t-button>
          </t-space>
          <t-space direction="vertical">
            <span>自定义错误</span>
            <t-image
              src=""
              :key.sync="errorCount"
              :style="{ width: '284px', height: '160px' }"
              :error="renderCustomIcon"
            />
          </t-space>
        </t-space>
      </div>
    </t-space>
  </div>
</template>

<script lang="jsx">
import Vue from 'vue';
import { RefreshIcon, QrcodeIcon } from 'tdesign-icons-vue';

export default Vue.extend({
  data() {
    return {
      loadingCount: 0,
      errorCount: 0,
      renderCustomIcon: <QrcodeIcon size="24" />,
    };
  },
  methods: {
    renderIcon() {
      return <RefreshIcon />;
    },
  },
});
</script>
