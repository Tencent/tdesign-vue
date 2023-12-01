<template>
  <t-popup>
    <t-tag v-show="count > 0" v-bind="$attrs" :closable="false">Slot - More({{ count }})</t-tag>
    <template #content>
      <t-tag v-for="(item, index) in collapsedTags" :key="item" :style="{ marginRight: '4px' }" v-bind="$attrs"
             @close="(context) => $emit('close', { e: context.e, index: minCollapsedNum + index })">
        {{ item | labelFilter }}
      </t-tag>
    </template>
  </t-popup>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: ['value', 'minCollapsedNum'],
  filters: {
    labelFilter(item) {
      if (typeof item === 'object') {
        return item.label;
      }
      return item;
    }
  },
  computed: {
    count() {
      return this.value.length - this.minCollapsedNum;
    },
    collapsedTags() {
      return this.value.slice(this.minCollapsedNum, this.value.length);
    }
  }
};
</script>
