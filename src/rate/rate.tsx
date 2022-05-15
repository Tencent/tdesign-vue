import Vue, { VNode } from 'vue';
import { prefix } from '../config';
import props from './props';
import ripple from '../utils/ripple';
import StarFilled from './star-filled-icon';
import Star from './star-render';

const name = `${prefix}-rate`;

export default Vue.extend({
  name: 'TRate',
  props: { ...props },
  directives: { ripple },
  components: {
    StarFilled,
  },

  provide(): Record<string, any> {
    return {
      rate: this,
    };
  },

  data() {
    return {
      starCount: this.value,
      lastIndex: -1,
    };
  },

  render(): VNode {
    // 展示星星的数组
    const stars = [];

    // 是否展示得分/人数描述
    const scoreStatus = this.personCount !== 0 && this.score;

    const changeValue = (index: number) => {
      if (this.starCount === index && index === 1) {
        this.starCount = index - 1;
      } else {
        this.starCount = index;
      }
    };

    for (let index = 1; index <= (this.defaultValue === 0 ? 5 : this.defaultValue); index++) {
      stars.push(
        <Star
          count={this.starCount}
          index={index}
          value={this.value}
          readonly={this.readonly}
          size={this.size}
          on-onFocus={changeValue}
          lastIndex={this.lastIndex}
          defaultValue={this.defaultValue === 0 ? 5 : this.defaultValue}
        />,
      );
      this.lastIndex = this.index;
    }

    return (
      <div class={`${name}`}>
        {scoreStatus && <div class={`${name}__person-store`}>{this.score.toFixed(1)}</div>}
        <div>
          <div>{stars}</div>

          {scoreStatus && <div class={`${name}__person`}>{this.personCount}人评分</div>}
        </div>
        {this.texts && <div class={`${name}-store`}>{this.texts[this.starCount - 1]}</div>}
      </div>
    );
  },
});
