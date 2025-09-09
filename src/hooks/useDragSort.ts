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
  };

  const dragend = (event: DragEvent) => {
    const { target } = event;
    if (!(target instanceof HTMLDivElement)) return;
    const newStyle = { opacity: '' };
    Object.assign(target.style, newStyle);
  };

  const dragover = (event: DragEvent) => {
    event.preventDefault();
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
    if (!navsWrap || !dragged || !props.panels) return;

    traversalTabNavs(navsWrap.children, (tabNav) => {
      const { firstChild } = tabNav;
      if (firstChild instanceof HTMLElement) {
        const newStyle = { outline: 'none' };
        Object.assign(firstChild.style, newStyle);
      }
    });

    const target = handleTarget(event.target, navsWrap.children);
    if (!target || target.parentNode === dragged || !target.draggable) return;

    const children = Array.from(navsWrap.children);
    const dragIndex = children.indexOf(dragged);
    const targetIndex = children.indexOf(target);

    const currentIndex = props.theme === 'card' ? dragIndex : dragIndex - 1;
    const endIndex = props.theme === 'card' ? targetIndex : targetIndex - 1;

    if (currentIndex >= 0 && endIndex >= 0 && props.onDragSort) {
      props.onDragSort({
        currentIndex,
        current: props.panels[currentIndex].value,
        targetIndex: endIndex,
        target: props.panels[endIndex].value,
      });
    }
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
