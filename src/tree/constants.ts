import { prefix } from '../config';

export const TREE_NAME = `${prefix}-tree`;
export const TREE_NODE_NAME = `${prefix}-tree-node`;

export const FX = {
  treeNode: `${prefix}-tree-toggle`,
};

const tree = `${prefix}-tree`;

export const CLASS_NAMES = {
  icon: `${prefix}-icon`,
  folderIcon: `${prefix}-folder-icon`,
  actived: `${prefix}-is-active`,
  disabled: `${prefix}-is-disabled`,
  treeIconRight: `${prefix}-icon-arrow-right`,
  treeIconDown: `${prefix}-icon-arrow-down`,
  tree,
  treeTransition: `${tree}--transition`,
  treeBlockNode: `${tree}--block-node`,
  treeBranch: `${tree}__branch`,
  treeChildren: `${tree}__children`,
  treeEmpty: `${tree}__empty`,
  treeList: `${tree}__list`,
  treeNode: `${tree}__item`,
  treeNodeOpen: `${tree}__item--open`,
  treeHoverable: `${tree}--hoverable`,
  treeCheckable: `${tree}--checkable`,
  treeLabel: `${tree}__label`,
  treeIcon: `${tree}__icon`,
  treeIconDefault: `${tree}__icon--default`,
  treeSpace: `${tree}__space`,
  treeOperations: `${tree}__operations`,
  treeNodeVisible: `${tree}__item--visible`,
  treeNodeHidden: `${tree}__item--hidden`,
  treeChildrenVisible: `${tree}__children--visible`,
  treeChildrenHidden: `${tree}__children--hidden`,
  treeNodeEnter: `${tree}__item--enter-active`,
  treeNodeLeave: `${tree}__item--leave-active`,
  line: `${tree}__line`,
  lineIsLeaf: `${tree}__line--leaf`,
  lineIsFirst: `${tree}__line--first`,
};
