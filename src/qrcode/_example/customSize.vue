<template>
  <t-space direction="vertical">
    <t-space>
      <t-button :disabled="size <= minSize" @click="size -= 10">
        <template #icon>
          <minus-icon />
        </template>
        Smaller
      </t-button>
      <t-button :disabled="size >= maxSize" @click="size += 10">
        <template #icon>
          <add-icon />
        </template>
        Larger
      </t-button>
    </t-space>
    <t-qrcode
      level="H"
      :size="size"
      :icon-size="size / 4"
      value="https://tdesign.tencent.com/"
      icon="https://tdesign.gtimg.com/site/tdesign-logo.png"
    />
  </t-space>
</template>

<script>
import { MinusIcon, AddIcon } from 'tdesign-icons-vue';

export default {
  components: {
    MinusIcon,
    AddIcon,
  },
  data() {
    return {
      minSize: 40,
      maxSize: 300,
      size: 160,
    };
  },
};
</script>
