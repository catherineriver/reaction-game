<template>
    <div class="special-reaction-test-result">
        <Gif v-if="showGif" />
        <div v-show="!showGif">
            <div class="special-reaction-test-result__title">Скорость вашей реакции выше, чем у
                <animated-number :value="percent" :formatValue="formatToProcent" :duration="duration"/>
                читателей TJournal</div>
            <StatisticChart :clicks="clicks"/>
            <div class="special-reaction-test-result__buttons" >
                <div class="likely" ref='likely'></div>
                <div class="special-reaction-test-result__restart" @click="restart">
                    <icon-base
                        icon-name='icon-restart'
                        width="17"
                        height="17"
                        viewBox="0 0 17 17">
                        <icon-restart></icon-restart>
                    </icon-base>
                    Реванш
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import AnimatedNumber from 'animated-number-vue';
import StatisticChart from './StatisticChart.vue';
import Gif from './Gif.vue';
import IconBase from './IconBase.vue';
import IconRestart from './icons/IconRestart.vue';
import * as Analytics from '../lib/analytics';
import * as Share from '../lib/share';

export default {
  name: 'ResultScreen',
  components: {
    StatisticChart,
    IconBase,
    IconRestart,
    Gif,
    AnimatedNumber,
  },
  data() {
    return {
      gifContainer: '',
      showGif: true,
      interval: null,
      value: 1000,
      duration: 1000,
    };
  },
  props: {
    percent: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
    },
  },
  mounted() {
    Analytics.sendEvent('Final', 'Show');
  },
  created() {
    this.gifInterval();
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    declineWord(number, words) {
      let result = '';

      if (number % 10 === 1 && number % 100 !== 11) {
        result += words[0];
      } else if ([2, 3, 4].indexOf(number % 10) > -1 && [12, 13, 14].indexOf(number % 100) < 0) {
        result += words[1];
      } else {
        result += words[2];
      }

      return result;
    },
    formatToProcent(percent) {
      return `${Number(percent).toFixed(0)}%`;
    },
    format(clicks) {
      return `${Number(clicks).toFixed(0)}`;
    },
    share() {
      const socials = this.$refs.likely;
      Share.make(socials, {
        title: `Скорость моей реакции — ${this.clicks} ${this.declineWord(this.clicks, ['клик', 'клика', 'кликов'])} в минуту. Она выше, чем у ${this.percent}% читателей TJournal`,
        url: `https://tjournal.ru/special/reaction-test/share/${this.clicks}/${this.percent}`,
      });
    },
    restart() {
      this.$emit('clicked');
      this.isShowPromo = true;
      this.isShowRules = true;
      this.isShowResult = false;
      this.isStartGame = false;
    },
    gifInterval() {
      this.interval = setTimeout(() => {
        this.showGif = false;
        this.share();
      }, 2000);
    },
  },
};
</script>

<style lang="stylus">
.likely--custom
    display flex
    flex-direction row
    align-items center
    & .likely__widget
        display: inline-flex;
        flex: 0 0 auto;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin: 0 5px;
        padding: 15px 12px;

        font-weight: normal;
        font-size: 16px;
        line-height: 19px;
        background: #00B956;
        text-decoration none
        color #fff

        border: none
        border-radius: 5px;
        cursor pointer
        transition background .2s
        height: 45px;
        width: 100%;
        max-width 45px
        & .likely__icon
            fill: currentColor;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            & > svg
                width: 23px;
                height: 21px;
        &:hover
            background #00C25A
        @media (max-width: 375px)
            height: 38px;
            max-width 38px
            margin: 0 3px;
            font-size: 14px;
            line-height: 16px;
            &:hover
                box-shadow: none
    & .likely__widget--facebook
        padding: 13px 23px;
        max-width: 166px;
        @media (max-width: 375px)
            max-width: 140px;
.special-reaction-test-result
    &__title
        font-weight: 500;
        font-size: 22px;
        line-height: 28px;
        & > span
            color: #A910C2;
            display inline-block
            text-align: center;
    &__buttons
        display flex
        flex-direction row
        align-items center
        margin 0 -3px
        margin-top: 20px;
        @media (max-width: 375px)
          flex-direction column
          align-items flex-start

    &__restart
        display flex
        flex-direction row
        align-items center

        margin-left 25px

        font-size: 16px;
        line-height: 19px;
        color: #00B956;

        cursor pointer
        &:hover
            & > svg
                transform: rotate(360deg);
        @media (max-width: 375px)
            margin-top: 30px
            margin-left 19px
        & > svg
            margin-right 10px
            transition: transform 0.4s ease-in;


</style>
