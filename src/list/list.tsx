import { VNode } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import Loading from '../loading';
import props from './props';
import { renderTNodeJSX } from '../utils/render-tnode';
import { LOAD_MORE, LOADING } from './const';
import { ClassName } from '../common';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('list');

export default mixins(classPrefixMixins).extend({
  name: 'TList',
  props: {
    ...props,
  },
  computed: {
    listClass(): ClassName {
      return [
        `${this.componentName}`,
        this.commonSizeClassName[this.size],
        {
          [`${this.componentName}--split`]: this.split,
          [`${this.componentName}--stripe`]: this.stripe,
          [`${this.componentName}--vertical-action`]: this.layout === 'vertical',
        },
      ];
    },
    loadingClass(): ClassName {
      if (this.asyncLoading === 'loading') return this.commonStatusClassName.loading;
      if (this.asyncLoading === 'load-more') return this.commonStatusClassName.loadMore;
      return '';
    },
  },
  components: {
    Loading,
  },
  methods: {
    renderLoading() {
      if (this.asyncLoading && typeof this.asyncLoading === 'string') {
        const text = {
          [LOADING]: '正在加载中，请稍后',
          [LOAD_MORE]: '点击加载更多',
        }[this.asyncLoading];
        const loading = this.asyncLoading === LOADING;
        return <Loading class={this.loadingClass} loading={loading} text={text} />;
      }
      return renderTNodeJSX(this, 'asyncLoading');
    },
    handleScroll(e: WheelEvent | Event) {
      const listElement = this.$el as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = listElement;
      this.$emit('scroll', {
        $event: e,
        scrollTop,
        scrollBottom: scrollHeight - clientHeight - scrollTop,
      });
      if (this.onScroll) {
        this.onScroll({
          e,
          scrollTop,
          scrollBottom: scrollHeight - clientHeight - scrollTop,
        });
      }
    },
    handleLoadMore(e: MouseEvent) {
      if (typeof this.asyncLoading === 'string' && this.asyncLoading !== LOAD_MORE) return;
      this.$emit('load-more', { e });
      if (this.onLoadMore) {
        this.onLoadMore({
          e,
        });
      }
    },
    renderContent() {
      const propsHeaderContent = renderTNodeJSX(this, 'header');
      const propsFooterContent = renderTNodeJSX(this, 'footer');

      return [
        propsHeaderContent && <div class={`${this.componentName}__header`}>{propsHeaderContent}</div>,
        <ul class={`${this.componentName}__inner`}>{renderTNodeJSX(this, 'default')}</ul>,
        propsFooterContent && <div class={`${this.componentName}__footer`}>{propsFooterContent}</div>,
      ];
    },
  },
  render(): VNode {
    let listContent: ScopedSlotReturnValue = this.renderContent();

    listContent = [
      listContent,
      <div class={`${this.componentName}__load`} onClick={this.handleLoadMore}>
        {this.renderLoading()}
      </div>,
    ];

    return (
      <div class={this.listClass} onScroll={this.handleScroll}>
        {listContent}
      </div>
    );
  },
});
