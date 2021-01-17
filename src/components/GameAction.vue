<template>
    <div class="special-reaction-test-startScreen">
        <ActionCircle
          @clicked="startGame"
          @stop="stopGame"
          v-if="isStartGame"

        />

    </div>
</template>

<script>
import ActionCircle from './ActionCircle.vue';

export default {
  name: 'GameAction',
  components: {
    ActionCircle,
  },
  data() {
    return {
      elapsedTime: 0,
      isShowResult: false,
      time: {
        start: 0,
        current: 0,
        elapsed: 0,
      },
      rafID: 0,
      store: [],
      allData: [],
      correctClicks: 0,
      statistic: 0,
    };
  },
  props: {
    isStartGame: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    formattedElapsedTime() {
      const date = new Date(null);
      date.setSeconds(this.elapsedTime / 1000);
      const utc = date.toUTCString();
      return utc.substr(utc.indexOf(':') - 2, 8);
    },
  },
  mounted() {
    this.startGame();
  },
  methods: {
    startGame() {
      this.startTimer();
    },
    stopGame() {
      this.$emit('stop');
      this.isShowPromo = true;
      this.isShowResult = true;
      this.stopTimer();
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.elapsedTime += 1000;
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
    },
    resetTimer() {
      this.elapsedTime = 0;
    },
  },
};
</script>

<style lang="stylus">
.special-reaction-test-startScreen
    display: flex;
    flex-flow: column;
    align-items: center;

    &__inner
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      padding-top: 25px
      padding-bottom: 44px
      height: 21px
      @media (max-width: 375px)
        margin-top: 40px
        margin-bottom: 54px
      & > svg
        margin-right 10px
    &__timer
        color: rgba(235,90,64,1)
        font-size: 18px;
        line-height: 21px;
        display: flex;
        align-items: center;
        letter-spacing: 0.045em;
</style>
