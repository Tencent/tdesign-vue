<template>
  <t-space direction="vertical" :style="{ width: '100%' }">
    <t-space breakLine>
      <t-space direction="vertical" align="start">
        <t-image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="cover"
          position="center"
          :style="{ width: '120px', height: '120px' }"
        />
        cover center
      </t-space>
      <t-space direction="vertical" align="start">
        <t-image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="cover"
          :style="{ width: '120px', height: '120px' }"
          position="left"
        />
        cover left
      </t-space>
      <t-space direction="vertical" align="start">
        <t-image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="cover"
          :style="{ width: '120px', height: '120px' }"
          position="right"
        />
        cover right
      </t-space>
    </t-space>
    <t-space :style="{ marginTop: 20 }" breakLine>
      <t-space direction="vertical" align="start">
        <t-image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="cover"
          :style="{ width: '280px', height: '120px' }"
          position="top"
        />
        cover top
      </t-space>
      <t-space direction="vertical" align="start">
        <t-image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="cover"
          :style="{ width: '280px', height: '120px' }"
          position="bottom"
        />
        cover bottom
      </t-space>
    </t-space>
    <t-space :style="{ marginTop: 20 }" breakLine>
      <t-space direction="vertical" align="start">
        <t-image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="contain"
          :style="{ width: '120px', height: '200px' }"
          position="top"
        />
        contain top
      </t-space>
      <t-space direction="vertical" align="start">
        <t-image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="contain"
          :style="{ width: '120px', height: '200px' }"
          position="bottom"
        />
        contain bottom
      </t-space>
      <t-space direction="vertical" align="start">
        <t-image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          fit="contain"
          :style="{ width: '120px', height: '200px' }"
          position="center"
        />
        contain center
      </t-space>
      <t-space :style="{ marginTop: 20 }" breakLine>
        <t-space direction="vertical" align="start">
          <t-image
            src="https://tdesign.gtimg.com/demo/demo-image-1.png"
            fit="contain"
            :style="{ width: '280px', height: '120px' }"
            position="left"
          />
          contain left
        </t-space>
        <t-space direction="vertical" align="start">
          <t-image
            src="https://tdesign.gtimg.com/demo/demo-image-1.png"
            fit="contain"
            :style="{ width: '280px', height: '120px' }"
            position="right"
          />
          contain right
        </t-space>
      </t-space>
    </t-space>
  </t-space>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {};
  },
});
</script>
