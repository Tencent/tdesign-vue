const getDomWidth = (dom: HTMLElement): number => dom?.offsetWidth || 0;

type IEntity = Record<string, any>;

export default class BaseTab {
  public entity: IEntity = null;

  constructor(entity: IEntity) {
    this.entity = entity;
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
}
