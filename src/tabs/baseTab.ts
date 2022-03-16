const getDomWidth = (dom: HTMLElement): number => dom?.offsetWidth || 0;

type essentialElements = // 这些元素是 baseTab 里面可能用到的，因此需要在 getElement 里支持这些元素的获取
  | 'navsContainer'
  | 'navsWrap'
  | 'leftOperationsZone'
  | 'leftIcon'
  | 'rightOperationsZone'
  | 'rightIcon';

type editableState = 'scrollLeft' | 'canToLeft' | 'canToRight'; // 这些状态会在 baseTab 里面被修改，因此应用类是可以使用这些 State 的

interface IEntity {
  getElement(ref: essentialElements): HTMLElement;
  getState(state: string): any;
  setState(state: editableState, value: any): void;
}

interface GetLeftCoverWidth {
  leftZone: HTMLElement;
  leftIcon: HTMLElement;
  totalWidthBeforeActiveTab: number;
}

interface GetRightCoverWidth {
  rightZone: HTMLElement;
  rightIcon: HTMLElement;
  wrap: HTMLElement;
  totalWidthBeforeActiveTab: number;
  activeTabWidth: number;
}

// 如果要当前tab左边对齐左操作栏的右边以展示完整的tab，需要获取左边操作栏的宽度
const _getLeftCoverWidth = (o: GetLeftCoverWidth) => {
  const leftOperationsZoneWidth = getDomWidth(o.leftZone);
  const leftIconWidth = getDomWidth(o.leftIcon);
  // 判断当前tab是不是第一个tab
  if (o.totalWidthBeforeActiveTab === 0) {
    // 如果是第一个tab要移动到最左边，则要减去左箭头的宽度，因为此时左箭头会被隐藏起来
    return leftOperationsZoneWidth - leftIconWidth;
  }
  return leftOperationsZoneWidth;
};

// 如果要当前tab右边对齐右操作栏的左边以展示完整的tab，需要获取右边操作栏的宽度
const _getRightCoverWidth = (o: GetRightCoverWidth) => {
  const rightOperationsZoneWidth = getDomWidth(o.rightZone);
  const rightIconWidth = getDomWidth(o.rightIcon as HTMLElement);
  const wrapWidth = getDomWidth(o.wrap);
  // 判断当前tab是不是最后一个tab，小于1是防止小数像素导致值不相等的情况
  if (Math.abs(o.totalWidthBeforeActiveTab + o.activeTabWidth - wrapWidth) < 1) {
    // 如果是最后一个tab，则要减去右箭头的宽度，因为此时右箭头会被隐藏
    return rightOperationsZoneWidth - rightIconWidth;
  }
  return rightOperationsZoneWidth;
};

export default class BaseTab {
  public entity: IEntity = null;

  constructor(entity: IEntity) {
    this.entity = entity;
  }

  _getRefWidth(ref: essentialElements) {
    return getDomWidth(this.entity.getElement(ref));
  }

  /**
   * 调整滚动条的位置
   * @returns boolean
   */
  adjustScrollbar(): boolean {
    const { entity } = this;
    const placement = entity.getState('placement');

    if (['left', 'right'].includes(placement.toLowerCase())) return;

    const container = entity.getElement('navsContainer');
    const wrap = entity.getElement('navsWrap');

    if (!wrap || !container) return false;

    const containerWidth = getDomWidth(container);
    const wrapWidth = getDomWidth(wrap);
    return (
      this._adjustContainerTooLarge(containerWidth, wrapWidth)
      || this._setLastItemTouchRightEdge(containerWidth, wrapWidth)
    );
  }

  _setLastItemTouchRightEdge(containerWidth: number, wrapWidth: number) {
    const { entity } = this;
    const rightOperationsZoneWidth = getDomWidth(entity.getElement('rightOperationsZone'));
    if (entity.getState('scrollLeft') + containerWidth - rightOperationsZoneWidth > wrapWidth) {
      entity.setState('scrollLeft', wrapWidth + rightOperationsZoneWidth - containerWidth);
      return true;
    }
    return false;
  }

  _adjustContainerTooLarge(containerWidth: number, wrapWidth: number) {
    if (wrapWidth <= containerWidth) {
      this.entity.setState('scrollLeft', 0);
      return true;
    }
    return false;
  }

  /**
   * 调整左右箭头的是否出现
   */
  adjustArrowDisplay() {
    this._calculateCanToLeft();
    this._calculateCanToRight();
  }

  _calculateCanToLeft() {
    const { entity } = this;
    const placement = entity.getState('placement');

    if (['left', 'right'].includes(placement.toLowerCase())) {
      entity.setState('canToLeft', false);
    }
    const container = entity.getElement('navsContainer');
    const wrap = entity.getElement('navsWrap');
    if (!wrap || !container) {
      entity.setState('canToLeft', false);
    }
    const leftOperationsZoneWidth = getDomWidth(entity.getElement('leftOperationsZone'));
    const leftIconWidth = getDomWidth(entity.getElement('leftIcon'));
    entity.setState(
      'canToLeft',
      entity.getState('scrollLeft') + Math.round(leftOperationsZoneWidth - leftIconWidth) > 0,
    );
  }

  _calculateCanToRight() {
    const { entity } = this;
    const placement = entity.getState('placement');

    if (['left', 'right'].includes(placement.toLowerCase())) {
      entity.setState('canToRight', false);
    }
    const container = entity.getElement('navsContainer');
    const wrap = entity.getElement('navsWrap');
    if (!wrap || !container) {
      entity.setState('canToRight', false);
    }
    const rightOperationsZoneWidth = getDomWidth(entity.getElement('rightOperationsZone'));
    const rightIconWidth = getDomWidth(entity.getElement('rightIcon'));
    entity.setState(
      'canToRight',
      entity.getState('scrollLeft')
        + getDomWidth(container)
        - (rightOperationsZoneWidth - rightIconWidth)
        - getDomWidth(wrap)
        < -1,
    ); // 小数像素不精确，所以这里判断小于-1
  }

  shouldMoveToLeftSide(activeTabEl: HTMLElement) {
    const { entity } = this;
    const totalWidthBeforeActiveTab = activeTabEl.offsetLeft;
    const container = entity.getElement('navsContainer');
    if (!container) return;
    const leftCoverWidth = _getLeftCoverWidth({
      leftZone: entity.getElement('leftOperationsZone'),
      leftIcon: entity.getElement('leftIcon'),
      totalWidthBeforeActiveTab,
    });
    // 判断当前tab是不是在左边被隐藏
    const isCurrentTabHiddenInLeftZone = entity.getState('scrollLeft') + leftCoverWidth > totalWidthBeforeActiveTab;
    if (isCurrentTabHiddenInLeftZone) {
      entity.setState('scrollLeft', totalWidthBeforeActiveTab - leftCoverWidth);
      return true;
    }
    return false;
  }

  shouldMoveToRightSide(activeTabEl: HTMLElement) {
    const { entity } = this;
    const totalWidthBeforeActiveTab = activeTabEl.offsetLeft;
    const activeTabWidth = activeTabEl.offsetWidth;
    const container = entity.getElement('navsContainer');
    const wrap = entity.getElement('navsWrap');
    if (!container || !wrap) return;
    const containerWidth = getDomWidth(container);
    const rightCoverWidth = _getRightCoverWidth({
      rightZone: entity.getElement('rightOperationsZone'),
      rightIcon: entity.getElement('rightIcon'),
      wrap,
      totalWidthBeforeActiveTab,
      activeTabWidth,
    });
    // 判断当前tab是不是在右边被隐藏
    const isCurrentTabHiddenInRightZone = entity.getState('scrollLeft') + containerWidth - rightCoverWidth < totalWidthBeforeActiveTab + activeTabWidth;
    if (isCurrentTabHiddenInRightZone) {
      entity.setState('scrollLeft', totalWidthBeforeActiveTab + activeTabWidth - containerWidth + rightCoverWidth);
      return true;
    }
    return false;
  }

  scrollToLeft() {
    const { entity } = this;
    const container = entity.getElement('navsContainer');
    if (!container) return;
    const leftOperationsZoneWidth = this._getRefWidth('leftOperationsZone');
    const leftIconWidth = this._getRefWidth('leftIcon');
    const containerWidth = getDomWidth(container);

    entity.setState(
      'scrollLeft',
      Math.max(-(leftOperationsZoneWidth - leftIconWidth), entity.getState('scrollLeft') - containerWidth),
    );
  }

  scrollToRight() {
    const { entity } = this;
    const container = entity.getElement('navsContainer');
    const wrap = entity.getElement('navsWrap');
    const rightOperationsZoneWidth = this._getRefWidth('rightOperationsZone');
    const rightIconWidth = this._getRefWidth('rightIcon');
    const containerWidth = getDomWidth(container);
    const wrapWidth = getDomWidth(wrap);

    entity.setState(
      'scrollLeft',
      Math.min(
        entity.getState('scrollLeft') + containerWidth,
        wrapWidth - containerWidth + rightOperationsZoneWidth - rightIconWidth,
      ),
    );
  }
}
