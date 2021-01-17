<template>
    <div class="special-reaction-test-startScreen" ref="screen">
        <div class="special-reaction-test-startScreen__desc">
            <p>Кликайте на&nbsp;всплывающие кружочки в&nbsp;порядке убывания&nbsp;&mdash; от&nbsp;60&nbsp;до&nbsp;1.</p>
            <p>В&nbsp;конце вы&nbsp;узнаете скорость вашей реакции&nbsp;&mdash; количество действий</p>
            <p>в&nbsp;минуту. Удачи⚡️</p>
        </div>
        <StartCircle @clicked="startGame"/>
    </div>
</template>

<script>
import * as Analytics from '../lib/analytics';
import StartCircle from './StartCircle.vue';

export default {
  name: 'GameRules',
  components: {
    StartCircle,
  },
  data() {
    return {
      isStartGame: false,
      elapsedTime: 0,
      timer: undefined,
      isShowResult: false,
    };
  },
  mounted() {
    setTimeout(() => {
      const scrollTo = (to, duration) => {
        const start = window.pageYOffset;
        const change = to - start;
        let currentTime = 0;
        const increment = 20;

        const animateScroll = () => {
          currentTime += increment;
          const val = Math.easeInOutQuad(currentTime, start, change, duration);
          window.scroll(0, val);
          if (currentTime < duration) {
            setTimeout(animateScroll, increment);
          }
        };
        animateScroll();
      };

      Math.easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t -= 1;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      };


      const scrollToElement = (ref) => {
        scrollTo(ref.getBoundingClientRect().top + window.scrollY - 60, 500);
      };

      scrollToElement(this.$refs.screen);
    });
  },
  methods: {
    startGame() {
      Analytics.sendEvent('Start Game');
      this.$emit('clicked');
      this.isStartGame = true;
    },
  },

};
</script>

<style lang="stylus">
.special-reaction-test-startScreen
    display: flex;
    flex-flow: column;
    align-items: center;
    &__desc
      font-weight: normal;
      font-size: 16px;
      line-height: 25px;
      & > p
        margin 0
        display: inline-block;

</style>
