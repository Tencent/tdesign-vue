import Vue, { VNode } from 'vue';
import { prefix } from '../config';
import props from './props';
import ripple from '../utils/ripple';
import StarFilled from './star-filled-icon';
import StarIcon from './star-icon';
import Star from './star-render';

const name = `${prefix}-rate`;

export default Vue.extend({
  name: 'TRate',
  props: { ...props },
  directives: { ripple },
  components: {
    StarFilled,
    StarIcon,
  },

  provide(): Record<string, any> {
    return {
      rate: this,
    };
  },

  data() {
    return {
      starCount: 2,
    };
  },

  render(): VNode {
    // 展示星星的数组
    const stars = [];
    const changeValue = (index: number) => {
      this.starCount = index;
    };

    for (let index = 1; index <= this.defaultValue; index++) {
      stars.push(
        <Star
          count={this.starCount}
          index={index}
          on-onFocus={changeValue}
          defaultValue={this.defaultValue}
          value={this.value}
        />,
      );
    }

    return (
      <div class={`${name}`}>
        <div>{stars}</div>
      </div>
    );
  },
});
