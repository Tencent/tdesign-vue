<template>
  <div class="tdesign-demo-block-column">
    <div class="tdesign-demo-block-row">
      <t-switch size="large" v-model="slotChecked">
        <template v-slot:label="slotProps">{{slotProps.value?'开':'关'}}</template>
      </t-switch>
      <t-switch size="large">
        <template v-slot:label="slotProps">
          <template v-if="slotProps.value">
            <check-icon />
          </template>
          <template v-else>
            <close-icon />
          </template>
        </template>
      </t-switch>
    </div>

    <div class="tdesign-demo-block-row">
      <t-switch size="large" v-model="checked" :label="['开', '关']"></t-switch>
      <t-switch size="large" :label="['开', '关']"></t-switch>
    </div>

    <div class="tdesign-demo-block-row">
      <t-switch size="large" v-model="renderChecked" :label="[renderActiveContent, renderInactiveContent]"></t-switch>
      <t-switch size="large" :label="[renderActiveContent, renderInactiveContent]"></t-switch>
    </div>

    <div class="tdesign-demo-block-row">
      <t-switch size="large" v-model="renderChecked2" :label="renderContent"></t-switch>
      <t-switch size="large" :label="renderContent"></t-switch>
    </div>
  </div>
</template>
<script lang="jsx">

import { CloseIcon, CheckIcon } from 'tdesign-icons-vue';

export default {
  components: { CloseIcon, CheckIcon },
  data() {
    return {
      checked: true,
      renderChecked: true,
      renderChecked2: true,
      slotChecked: true,
    };
  },
  methods: {
    onChange(val) {
      console.log(val);
    },
    renderActiveContent() {
      return (<CheckIcon />);
    },
    renderInactiveContent() {
      return (<CloseIcon />);
    },
    renderContent(h, data) {
      return data.value ? (<CheckIcon />) : (<CloseIcon />);
    },
  },
};
</script>
