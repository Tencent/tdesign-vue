<template>
  <t-space direction="vertical">
    <t-space align="center">
      <label>StyleA</label>

      <t-check-tag v-model="checked1" style="margin-right: 32px">选中/未选态</t-check-tag>

      <t-check-tag :checked="true">选中态</t-check-tag>
      <t-check-tag :checked="false">未选态</t-check-tag>
      <t-check-tag :checked="true" disabled>选中禁用</t-check-tag>
      <t-check-tag :checked="false" disabled>未选禁用</t-check-tag>
    </t-space>

    <t-space align="center">
      <label>StyleB</label>

      <t-check-tag
        v-model="checked2"
        :unchecked-props="{ theme: 'default', variant: 'outline' }"
        style="margin-right: 32px"
      >选中/未选态</t-check-tag
      >

      <t-check-tag :checked="true">选中态</t-check-tag>
      <t-check-tag :checked="false" :unchecked-props="{ theme: 'default', variant: 'outline' }">未选态</t-check-tag>
      <t-check-tag :checked="true" disabled>选中禁用</t-check-tag>
      <t-check-tag :checked="false" disabled :unchecked-props="{ theme: 'default', variant: 'outline' }"
      >未选禁用</t-check-tag
      >
    </t-space>

    <t-space align="center">
      <label>StyleC</label>

      <t-check-tag
        v-model="checked3"
        :checked-props="{ theme: 'primary', variant: 'outline' }"
        :unchecked-props="{ theme: 'default', variant: 'outline' }"
        style="margin-right: 32px"
      >Outline Tag</t-check-tag
      >

      <t-check-tag :checked="true" :checked-props="{ theme: 'primary', variant: 'outline' }">Checked</t-check-tag>
      <t-check-tag :checked="false" :unchecked-props="{ theme: 'default', variant: 'outline' }">Unchecked</t-check-tag>
      <t-check-tag :checked="true" disabled :checked-props="{ theme: 'primary', variant: 'outline' }"
      >Disabled</t-check-tag
      >
      <t-check-tag :checked="false" disabled :unchecked-props="{ theme: 'default', variant: 'outline' }"
      >Disabled</t-check-tag
      >
    </t-space>
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      checked1: false,
      checked2: false,
      checked3: false,
    };
  },
};
</script>
