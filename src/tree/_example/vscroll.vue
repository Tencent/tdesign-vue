<template>
  <t-space :size="32" direction="vertical" style="width: 100%">
    <t-space direction="vertical" style="width: 80%">
      <h3>虚拟滚动 - virtual 模式</h3>
      <t-space>
        <span>动画:</span>
        <t-switch v-model="transition" />
      </t-space>
      <t-space>
        <span>显示连线:</span>
        <t-switch v-model="showLine" />
      </t-space>
      <t-space>
        <span>显示图标:</span>
        <t-switch v-model="showIcon" />
      </t-space>
      <t-space>
        <span>可选:</span>
        <t-switch v-model="isCheckable" />
      </t-space>
      <t-space>
        <span>可操作:</span>
        <t-switch v-model="isOperateAble" />
      </t-space>
      <t-space>
        <t-input-adornment prepend="插入节点数量:">
          <t-input v-model="textInsertCount" />
        </t-input-adornment>
      </t-space>
      <t-space>
        <t-button @click="append()">插入根节点</t-button>
      </t-space>
      <t-space>
        <t-button @click="scrollTo()">滚动到指定节点</t-button>
      </t-space>
    </t-space>
    <t-tree
      ref="tree"
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
      :scroll="{
        rowHeight: 34,
        bufferSize: 10,
        threshold: 10,
        type: 'virtual',
      }"
    >
      <template #operations="{ node }">
        <div v-if="isOperateAble" class="tdesign-demo-block-row">
          <t-button size="small" variant="base" @click="append(node)">添加子节点</t-button>
          <t-button size="small" variant="base" theme="danger" @click="remove(node)">删除</t-button>
        </div>
      </template>
    </t-tree>
    <div style="height: 100px"></div>
  </t-space>
</template>

<script>
const allLevels = [5, 5, 5];

function createTreeData() {
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

  const items = [];
  createNodes(items, 0);

  return {
    getValue,
    items,
  };
}

const virtualTree = createTreeData();

export default {
  data() {
    return {
      transition: true,
      textInsertCount: '1',
      showLine: true,
      showIcon: true,
      isCheckable: true,
      isOperateAble: true,
      items: virtualTree.items,
    };
  },
  computed: {
    insertCount() {
      return parseInt(this.textInsertCount, 10) || 1;
    },
  },
  methods: {
    label(h, node) {
      return `${node.value}`;
    },
    getInsertItem() {
      const value = virtualTree.getValue();
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
    scrollTo() {
      const { tree } = this.$refs;
      tree.scrollTo({
        // 指定key滚动，即当前节点对应的唯一值，推荐使用
        key: 't30',
        behavior: 'smooth',
        // 指定index滚动，如果存在多级嵌套，需要自己计算index
        // index: 100,
      });
    },
  },
};
</script>
