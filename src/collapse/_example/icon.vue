<template>
  <t-space direction="vertical">
    <t-collapse :expand-icon-placement="direction" :expand-on-row-click="!onlyIcon">
      <t-collapse-panel value="0" header="这是一个折叠标题">
        这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
      </t-collapse-panel>
      <t-collapse-panel value="1">
        <template #header>这是一个折叠标题</template>
        <template #default
        >这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。</template
        >
      </t-collapse-panel>
      <t-collapse-panel value="2">
        <template #expandIcon><star-icon /></template>
        <template #header>自定义icon1</template>
        这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
      </t-collapse-panel>
      <t-collapse-panel value="3" :expand-icon="renderLogo" header="自定义icon2">
        这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
      </t-collapse-panel>
    </t-collapse>
    <t-space>
      <t-radio-group v-model="direction">
        <t-radio value="left">左边</t-radio>
        <t-radio value="right">右边</t-radio>
      </t-radio-group>
    </t-space>
    <div style="margin-top: 10px">
      <t-checkbox v-model="onlyIcon">仅图标响应点击</t-checkbox>
    </div>
  </t-space>
</template>
<script lang="jsx">
import { StarIcon, LogoGithubIcon } from 'tdesign-icons-vue';

export default {
  components: {
    StarIcon,
  },
  data() {
    return {
      direction: 'left',
      onlyIcon: false,
    };
  },
  methods: {
    renderLogo() {
      return <LogoGithubIcon />;
    },
  },
};
</script>
