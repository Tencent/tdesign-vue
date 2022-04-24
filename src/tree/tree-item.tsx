import Vue, { VNode, CreateElement } from 'vue';
import isFunction from 'lodash/isFunction';
import { CaretRightSmallIcon } from 'tdesign-icons-vue';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { TreeConfig, getKeepAnimationMixins } from '../config-provider/config-receiver';
import TCheckBox from '../checkbox';
import TLoading from '../loading';
import TreeNode from '../_common/js/tree/tree-node';
import { getTNode } from './util';
import { TypeEventState } from './interface';
import { TREE_NODE_NAME, CLASS_NAMES } from './constants';
import { ClassName } from '../common';
import ripple from '../utils/ripple';

const keepAnimationMixins = getKeepAnimationMixins();

export const TreeItemProps = {
  nested: {
    type: Boolean,
    default: false,
  },
  node: {
    type: Object,
  },
  treeScope: {
    type: Object,
  },
  proxyScope: {
    type: Object,
  },
};

const TreeItem = mixins(getConfigReceiverMixins<Vue, TreeConfig>('tree'), keepAnimationMixins).extend({
  name: TREE_NODE_NAME,
  props: TreeItemProps,
  directives: { ripple },
  data() {
    return {
      data: null,
      $clicked: false,
      $nodesMap: null,
    };
  },
  methods: {
    getStyles(): string {
      const { level } = this.node;
      const styles = `--level: ${level};`;
      return styles;
    },
    getClassList(): ClassName {
      const { node, nested } = this;
      const list = [];
      list.push(CLASS_NAMES.treeNode);
      list.push({
        [CLASS_NAMES.treeNodeOpen]: node.expanded,
        [CLASS_NAMES.actived]: node.isActivable() ? node.actived : false,
        [CLASS_NAMES.disabled]: node.isDisabled(),
      });
      if (!nested) {
        if (node.visible) {
          list.push(CLASS_NAMES.treeNodeVisible);
        } else {
          list.push(CLASS_NAMES.treeNodeHidden);
        }
      }
      return list;
    },
    renderLine(createElement: CreateElement): VNode {
      const { node, treeScope, proxyScope } = this;
      const { line } = treeScope;
      const { scopedSlots } = proxyScope;
      const iconVisible = !!treeScope.icon;

      let lineNode = null;
      if (line === true) {
        if (scopedSlots?.line) {
          lineNode = scopedSlots.line({
            node: node?.getModel(),
          });
        } else if (node.parent && node.tree) {
          const { vmIsLeaf, vmIsFirst, level } = node;

          const lineClasses = [];

          // 每个节点绘制抵达上一层级的折线
          lineClasses.push(CLASS_NAMES.line);

          // 叶子节点，折线宽度延长，因为没有 icon 呈现
          // 任意节点，icon 不呈现时也是要延长折线宽度
          if (vmIsLeaf || !iconVisible) {
            lineClasses.push(CLASS_NAMES.lineIsLeaf);
          }

          // 分支首节点，到上一节点的折线高度要缩短，让位给 icon 呈现
          // 如果 icon 隐藏了，则不必缩短折线高度
          if (vmIsFirst && iconVisible) {
            lineClasses.push(CLASS_NAMES.lineIsFirst);
          }

          // 如果节点的父节点，不是最后的节点
          // 则需要绘制节点延长线
          const shadowStyles: string[] = [];
          const parents = node.getParents();
          parents.pop();
          parents.forEach((pnode: TreeNode, index: number) => {
            if (!pnode.vmIsLast) {
              shadowStyles.push(`calc(-${index + 1} * var(--space)) 0 var(--color)`);
            }
          });

          const styles = {
            '--level': level ? String(level) : undefined,
            'box-shadow': shadowStyles.join(','),
          };

          lineNode = <span class={lineClasses} style={styles}></span>;
        }
      } else {
        lineNode = getTNode(line, {
          createElement,
          node,
        });
      }
      return lineNode;
    },
    getFolderIcon() {
      if (isFunction(this.global.folderIcon)) {
        return this.global.folderIcon(this.$createElement);
      }
      return <CaretRightSmallIcon />;
    },
    renderIcon(createElement: CreateElement): VNode {
      const { node, treeScope, proxyScope } = this;
      const { icon } = treeScope;
      const { scopedSlots } = proxyScope;
      let isDefaultIcon = false;

      let iconNode = null;
      if (icon === true) {
        if (scopedSlots?.icon) {
          iconNode = scopedSlots.icon({
            node: node?.getModel(),
          });
        } else if (!node.vmIsLeaf) {
          isDefaultIcon = true;
          iconNode = this.getFolderIcon();
          if (node.loading && node.expanded) {
            iconNode = <TLoading />;
          }
        } else {
          iconNode = '';
        }
      } else {
        iconNode = getTNode(icon, {
          createElement,
          node,
        });
      }

      iconNode = (
        <span
          class={[CLASS_NAMES.treeIcon, CLASS_NAMES.folderIcon, isDefaultIcon ? CLASS_NAMES.treeIconDefault : '']}
          trigger="expand"
          ignore="active"
        >
          {iconNode}
        </span>
      );
      return iconNode;
    },
    renderLabel(createElement: CreateElement): VNode {
      const { node, treeScope, proxyScope } = this;
      const { label, disableCheck } = treeScope;
      const { scopedSlots } = proxyScope;
      const checkProps = treeScope.checkProps || {};

      let labelNode = null;
      if (label === true) {
        if (scopedSlots?.label) {
          labelNode = scopedSlots.label({
            node: node?.getModel(),
          });
        } else {
          labelNode = node.label || '';
        }
      } else {
        labelNode = getTNode(label, {
          createElement,
          node,
        });
      }

      const labelClasses = [
        CLASS_NAMES.treeLabel,
        {
          [CLASS_NAMES.actived]: node.isActivable() ? node.actived : false,
        },
      ];

      if (node.vmCheckable) {
        let checkboxDisabled = false;
        if (typeof disableCheck === 'function') {
          checkboxDisabled = disableCheck(node);
        } else {
          checkboxDisabled = !!disableCheck;
        }
        if (node.isDisabled()) {
          checkboxDisabled = true;
        }
        const itemCheckProps = {
          ...checkProps,
          disabled: checkboxDisabled,
        };

        labelNode = (
          <TCheckBox
            v-ripple={this.keepAnimation.ripple}
            class={labelClasses}
            checked={node.checked}
            indeterminate={node.indeterminate}
            disabled={node.isDisabled()}
            name={String(node.value)}
            onChange={() => this.handleChange()}
            ignore="expand,active"
            {...{ props: itemCheckProps }}
          >
            {labelNode}
          </TCheckBox>
        );
      } else {
        const inner = <span style="position: relative">{labelNode}</span>;
        labelNode = node.isActivable() ? ( // 使用key是为了避免元素复用，从而顺利移除ripple指令
          <span key="1" v-ripple={this.keepAnimation.ripple} class={labelClasses}>
            {inner}
          </span>
        ) : (
          <span key="2" class={labelClasses}>
            {inner}
          </span>
        );
      }

      return labelNode;
    },
    renderOperations(createElement: CreateElement): VNode {
      const { node, treeScope, proxyScope } = this;
      const { operations } = treeScope;
      const { scopedSlots } = proxyScope;

      let opNode = null;
      if (scopedSlots?.operations) {
        opNode = scopedSlots.operations({
          node: node?.getModel(),
        });
      } else {
        opNode = getTNode(operations, {
          createElement,
          node,
        });
      }
      if (opNode) {
        opNode = (
          <span class={CLASS_NAMES.treeOperations} ignore="active,expand">
            {opNode}
          </span>
        );
      }
      return opNode;
    },
    renderItem(createElement: CreateElement): Array<VNode> {
      const itemNodes: Array<VNode> = [];
      const iconNode = this.renderIcon(createElement);
      // 渲染连线排在渲染图标之后，是为了确认图标是否存在
      const lineNode = this.renderLine(createElement);

      if (lineNode) {
        itemNodes.push(lineNode);
      }

      if (iconNode) {
        itemNodes.push(iconNode);
      }

      const labelNode = this.renderLabel(createElement);
      if (labelNode) {
        itemNodes.push(labelNode);
      }

      const opNode = this.renderOperations(createElement);
      if (opNode) {
        itemNodes.push(opNode);
      }

      return itemNodes;
    },
    handleClick(evt: MouseEvent) {
      // checkbox 上也有 emit click 事件
      // 用这个逻辑避免重复的 click 事件被触发
      if (this.$clicked) return;
      this.$clicked = true;
      setTimeout(() => {
        this.$clicked = false;
      });

      const { node } = this;
      const state: TypeEventState = {
        mouseEvent: evt,
        event: evt,
        node,
        path: node.getPath(),
      };
      this.$emit('click', state);
    },
    handleChange() {
      const { node } = this;
      const event = new Event('change');
      const state: TypeEventState = {
        event,
        node,
      };
      this.$emit('change', state);
    },
    proxyClick(state: TypeEventState) {
      this.$emit('click', state);
    },
    proxyChange(state: TypeEventState) {
      this.$emit('change', state);
    },
    // 创建单个 tree 节点
    getNestedItem(node: TreeNode) {
      const { nested, treeScope, proxyScope } = this;
      const treeItem = (
        <TreeItem
          key={node.value}
          node={node}
          nested={nested}
          treeScope={treeScope}
          proxyScope={proxyScope}
          onClick={this.proxyClick}
          onChange={this.proxyChange}
        />
      );
      return treeItem;
    },
    getChildNodes() {
      const { node, $nodesMap } = this;
      // 以嵌套形式渲染节点
      let children: TreeNode[] = [];
      if (Array.isArray(node.children)) {
        children = node.children;
      }

      const curNodesMap = new Map();
      const childrenNodes = children.map((child: TreeNode) => {
        curNodesMap.set(child.value, 1);
        let nodeView = $nodesMap.get(child.value);
        if (!nodeView && child.visible) {
          nodeView = this.getNestedItem(child);
          $nodesMap.set(child.value, nodeView);
        }
        return nodeView;
      });

      // 移除不再使用的节点
      this.$nextTick(() => {
        const keys = [...$nodesMap.keys()];
        keys.forEach((value: string) => {
          if (!curNodesMap.get(value)) {
            $nodesMap.delete(value);
          }
        });
        curNodesMap.clear();
      });

      return childrenNodes;
    },
  },
  created() {
    const { node } = this;
    if (node) {
      this.data = node.data;
    }
    this.$nodesMap = new Map();
    // console.log('item created', node.value);
  },
  destroyed() {
    this.data = null;
    this.$nodesMap.clear();
  },
  render(createElement: CreateElement) {
    const { node, nested } = this;
    const { tree, level, value } = node;

    // 用于性能调试
    // console.log('item render', node.value);

    if (!tree || !tree.nodeMap.get(value)) {
      this.$destroy();
    }
    const styles = this.getStyles();
    const classList = this.getClassList();
    const itemNode = (
      <div
        class={classList}
        data-value={value}
        data-level={level}
        style={styles}
        onClick={(evt: MouseEvent) => this.handleClick(evt)}
      >
        {this.renderItem(createElement)}
      </div>
    );

    if (!nested) {
      // 返回平铺列表形式节点
      return itemNode;
    }

    const childNodes = this.getChildNodes();

    const childrenClassList = [];
    childrenClassList.push(CLASS_NAMES.treeChildren);
    if (node.expanded) {
      childrenClassList.push(CLASS_NAMES.treeChildrenVisible);
    } else {
      childrenClassList.push(CLASS_NAMES.treeChildrenHidden);
    }

    const allChildren = node.walk();
    allChildren.shift();
    const allExpandedChildren = allChildren.filter((node: TreeNode) => {
      const parent = node.getParent();
      if (!parent) return true;
      return parent.expanded;
    });
    const childrenStyles = {
      '--hscale': allExpandedChildren.length,
    };

    const childrenBox = (
      <transition-group
        tag="div"
        class={childrenClassList}
        style={childrenStyles}
        enter-active-class={CLASS_NAMES.treeNodeEnter}
        leave-active-class={CLASS_NAMES.treeNodeLeave}
      >
        {childNodes}
      </transition-group>
    );

    const branchNode = (
      <div class={CLASS_NAMES.treeBranch}>
        {itemNode}
        {childrenBox}
      </div>
    );
    return branchNode;
  },
});

export default TreeItem;
