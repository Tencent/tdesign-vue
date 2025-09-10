import { TabValue } from '../tabs/type';

interface TabPanel {
  value: TabValue;
}

interface DragSortProps {
  theme?: string;
  panels?: TabPanel[];
  onDragSort?: (context: { currentIndex: number; current: TabValue; targetIndex: number; target: TabValue }) => void;
}

const traversalTabNavs = (tabNavs: HTMLCollection, fn: (tabNav: HTMLDivElement) => void) => {
  Array.from(tabNavs)
    .filter((node): node is HTMLDivElement => node instanceof HTMLDivElement && !!node.getAttribute('draggable'))
    .forEach(fn);
};

const handleTarget = (target: EventTarget, tabNavs: HTMLCollection): HTMLDivElement | undefined => {
  let resultTarget: HTMLDivElement | undefined;

  traversalTabNavs(tabNavs, (itemNode) => {
    if (target instanceof Node && itemNode.contains(target)) {
      resultTarget = itemNode;
    }
  });

  return resultTarget;
};

const useDragSort = (props: DragSortProps) => {
  let navsWrap: HTMLDivElement | null = null;
  let dragged: HTMLDivElement | null = null;
  const enterTargets: HTMLDivElement[] = [];

  const dragstart = (event: DragEvent) => {
    const { target } = event;
    if (!(target instanceof HTMLDivElement)) return;
    dragged = target;
    const newStyle = { opacity: '0.5' };
    Object.assign(target.style, newStyle);
    // 指定允许的拖拽操作为 move，且兼容 Firefox（需要 setData）
    const dt = event.dataTransfer;
    if (dt) {
      dt.effectAllowed = 'copy';
      try {
        dt.setData('text/plain', '');
      } catch (e) {
        // 某些环境下可能抛错，忽略
      }
    }
  };

  const dragend = (event: DragEvent) => {
    const { target } = event;
    if (!(target instanceof HTMLDivElement)) return;
    const newStyle = { opacity: '' };
    Object.assign(target.style, newStyle);
  };

  const dragover = (event: DragEvent) => {
    if (!navsWrap) return;
    const target = handleTarget(event.target, navsWrap.children);
    const dt = event.dataTransfer;
    if (dt) {
      // 不可放置目标显示禁止状态
      dt.dropEffect = target && target.draggable ? 'copy' : 'none';
    }
    if (target && target.draggable) {
      event.preventDefault();
    }
  };

  const dragenter = (event: DragEvent) => {
    if (!navsWrap || !dragged) return;
    const target = handleTarget(event.target, navsWrap.children);

    if (target && target !== dragged && target.draggable) {
      const { firstChild } = target;
      if (firstChild instanceof HTMLElement) {
        const newStyle = { outline: '1px dashed #0052d9' };
        Object.assign(firstChild.style, newStyle);
      }
      if (!enterTargets.includes(target)) {
        enterTargets.push(target);
      }
    }
  };

  const dragleave = (event: DragEvent) => {
    const { target } = event;
    if (!(target instanceof HTMLDivElement)) return;

    enterTargets.forEach((enterTarget) => {
      if (!enterTarget.contains(target)) {
        const { firstChild } = enterTarget;
        if (firstChild instanceof HTMLElement) {
          const newStyle = { outline: 'none' };
          Object.assign(firstChild.style, newStyle);
        }
      }
    });
  };

  const drop = (event: DragEvent) => {
    event.preventDefault();

    traversalTabNavs(navsWrap.children, (tabNav) => {
      const firstChild = tabNav.firstChild as HTMLElement;
      if (firstChild) {
        firstChild.style.outline = 'none';
      }
    });

    if (!navsWrap || !dragged || !props.panels) return;

    let dropTarget = handleTarget(event.target, navsWrap.children);

    if (!dropTarget || dropTarget === dragged || !dropTarget.draggable) return;

    const draggedDOMIndex = Array.from(navsWrap.children).indexOf(dragged);
    const targetDOMIndex = Array.from(navsWrap.children).indexOf(dropTarget);

    if (draggedDOMIndex === -1 || targetDOMIndex === -1) return;

    if (targetDOMIndex > draggedDOMIndex) {
      const nextElement = navsWrap.children[targetDOMIndex + 1] as HTMLDivElement;
      if (nextElement) {
        dropTarget = nextElement;
      }
    }

    // 计算实际的数据索引（考虑主题样式的偏移）
    const isCardTheme = props.theme === 'card';
    const getDataIndex = (domIndex: number) => (isCardTheme ? domIndex : domIndex - 1);

    const currentDataIndex = getDataIndex(draggedDOMIndex);
    const targetDataIndex = getDataIndex(targetDOMIndex);

    if (
      currentDataIndex < 0
      || targetDataIndex < 0
      || currentDataIndex >= props.panels.length
      || targetDataIndex >= props.panels.length
    ) return;

    const dragSortData = {
      currentIndex: currentDataIndex,
      current: props.panels[currentDataIndex].value,
      targetIndex: targetDataIndex,
      target: props.panels[targetDataIndex].value,
    };

    props.onDragSort?.(dragSortData);
  };

  function setNavsWrap(val: HTMLDivElement) {
    navsWrap = val;
    navsWrap.addEventListener('dragstart', dragstart, false);
    navsWrap.addEventListener('dragend', dragend, false);
    navsWrap.addEventListener('dragover', dragover, false);
    navsWrap.addEventListener('dragenter', dragenter, false);
    document.addEventListener('dragleave', dragleave, false);
    document.addEventListener('mousemove', dragleave, false);
    navsWrap.addEventListener('drop', drop, false);
  }

  const dragSortDestroy = () => {
    if (navsWrap) {
      navsWrap.removeEventListener('dragstart', dragstart);
      navsWrap.removeEventListener('dragend', dragend);
      navsWrap.removeEventListener('dragover', dragover);
      navsWrap.removeEventListener('dragenter', dragenter);
      document.removeEventListener('dragleave', dragleave);
      document.removeEventListener('mousemove', dragleave);
      navsWrap.removeEventListener('drop', drop);
    }
  };

  return {
    setNavsWrap,
    dragSortDestroy,
  };
};

export default useDragSort;
