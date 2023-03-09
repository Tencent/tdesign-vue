<template>
  <div class="tdesign-tree-demo tdesign-demo-vscroll">
    <div class="operations">
      <t-input-adornment prepend="插入节点数量:">
        <t-input v-model="insertCount" />
      </t-input-adornment>
    </div>
    <div class="operations">
      <t-button @click="append()">插入根节点</t-button>
    </div>
    <t-form labelWidth="150" style="max-width: 500px">
      <t-form-item label="动画">
        <t-switch v-model="transition" />
      </t-form-item>
      <t-form-item label="显示连线">
        <t-switch v-model="showLine" />
      </t-form-item>
      <t-form-item label="显示图标">
        <t-switch v-model="showIcon" />
      </t-form-item>
      <t-form-item label="可选">
        <t-switch v-model="isCheckable" />
      </t-form-item>
      <t-form-item label="可操作">
        <t-switch v-model="isOperateAble" />
      </t-form-item>
      <t-form-item label="滚动模式">
        <t-radio-group v-model="scrollMode" @change="onScrollModeChange">
          <t-radio-button value="normal">普通滚动</t-radio-button>
          <t-radio-button value="vscroll">虚拟滚动</t-radio-button>
          <t-radio-button value="lazy">lazy模式</t-radio-button>
        </t-radio-group>
      </t-form-item>
      <t-form-item>
        <t-alert theme="warning">切换滚动模式后需要刷新页面</t-alert>
      </t-form-item>
    </t-form>

    <t-tree
      :data="items"
      hover
      activable
      :checkable="isCheckable"
      expand-all
      :height="300"
      :transition="transition"
      :expand-on-click-node="false"
      :line="showLine"
      :icon="showIcon"
      :label="label"
      :scroll="scroll"
      ref="tree"
    >
      <template #operations="{ node }">
        <div class="tdesign-demo-block-row" v-if="isOperateAble">
          <t-button size="small" variant="base" @click="append(node)">添加子节点</t-button>
          <t-button size="small" variant="base" theme="danger" @click="remove(node)">删除</t-button>
        </div>
      </template>
    </t-tree>
  </div>
</template>

<script>
const allLevels = [5, 5, 5];

let cacheIndex = 0;
function getValue() {
  cacheIndex += 1;
  return `t${cacheIndex}`;
}

function createNodes(items, level) {
  const count = allLevels[level];
  if (count) {
    let index = 0;
    for (index = 0; index < count; index += 1) {
      const value = getValue();
      const item = { value };
      items.push(item);
      if (allLevels[level + 1]) {
        item.children = [];
        createNodes(item.children, level + 1);
      }
    }
  }
}

function createTreeData() {
  const items = [];
  createNodes(items, 0);
  return items;
}

const LSKEY_SCROLL_MODE = 'TDESIGN_TREE_VSCROLL_SCROLL_MODE';

export default {
  data() {
    const items = createTreeData();
    return {
      index: 0,
      transition: true,
      insertCount: 1,
      useActived: false,
      enableVScroll: true,
      lazyVScroll: false,
      expandParent: true,
      showLine: true,
      showIcon: true,
      isCheckable: true,
      isOperateAble: true,
      scrollMode: 'vscroll',
      items,
    };
  },
  computed: {
    scroll() {
      const { scrollMode } = this;
      if (scrollMode === 'normal') {
        return null;
      }
      const scrollProps = {
        rowHeight: 34,
        bufferSize: 10,
        threshold: 10,
      };
      if (scrollMode === 'lazy') {
        scrollProps.type = 'lazy';
      } else {
        scrollProps.type = 'virtual';
      }
      return scrollProps;
    },
  },
  mounted() {
    const mode = localStorage.getItem(LSKEY_SCROLL_MODE);
    if (mode) {
      this.scrollMode = mode;
    }
  },
  methods: {
    label(createElement, node) {
      return `${node.value}`;
    },
    onScrollModeChange() {
      const { scrollMode } = this;
      localStorage.setItem(LSKEY_SCROLL_MODE, scrollMode);
    },
    getInsertItem() {
      const value = getValue();
      return {
        value,
      };
    },
    append(node) {
      const { tree } = this.$refs;
      if (!node) {
        for (let index = 0; index < this.insertCount; index += 1) {
          const item = this.getInsertItem();
          tree.appendTo('', item);
        }
      } else {
        for (let index = 0; index < this.insertCount; index += 1) {
          const item = this.getInsertItem();
          tree.appendTo(node.value, item);
        }
      }
    },
    remove(node) {
      node.remove();
    },
  },
};
</script>

<style>
.tdesign-tree-demo .t-tree {
  margin-bottom: 20px;
}
.tdesign-tree-demo .title {
  margin-bottom: 10px;
}
.tdesign-tree-demo .tips {
  margin-bottom: 10px;
}
.tdesign-tree-demo .operations {
  margin-bottom: 10px;
}
.tdesign-tree-demo .t-form__item {
  margin-bottom: 5px;
}
.tdesign-demo-vscroll .t-alert {
  margin-bottom: 5px;
}
.tdesign-demo-vscroll .t-alert {
  margin-bottom: 5px;
}
.tdesign-demo-vscroll .t-tree {
  overflow-y: auto;
}
</style>
