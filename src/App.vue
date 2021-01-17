<template>
  <div :class="[
          'special-reaction-test',
          `special-reaction-test--${$store.state.params.location}`,
          `l-mb-28`,
          `l-island-round`
       ]"
       ref="container"
       v-observe-visibility="{
           callback: visibilityChanged,
           once: true,
       }">
    <div class="special-reaction-test__container l-island-a" v-if="isShowTiser">
      <div class="special-reaction-test__teaser">
        <div class="special-reaction-test__title">
          Проверьте скорость своей реакции
        </div>
        <div class="special-reaction-test__gif"></div>
        <button class="special-reaction-test__button" @click='showRules'>
          Легко!
        </button>
      </div>
    </div>
    <div class="special-reaction-test__container special-reaction-test__container--inner l-island-a" v-if="!isShowTiser">
      <GameRules v-if="isShowRules" @clicked="startGame"/>
      <GameAction v-if="isStartGame" @stop="stopGame" isStartGame/>
      <ResultScreen v-if="isShowResult" @clicked="restartGame" :clicks="cs" :percent="percent"/>
    </div>
    <div class="special-reaction-test__container special-reaction-test__container--branding l-island-a" v-if="isShowPromo">
      <AdvertisingScreen v-if="isShowPromo"/>
    </div>
  </div>
</template>

<script>
import * as Analytics from './lib/analytics';

import GameRules from './components/GameRules.vue';
import GameAction from './components/GameAction.vue';
import ResultScreen from './components/ResultScreen.vue';
import AdvertisingScreen from './components/AdvertisingScreen.vue';

export default {
  name: 'App',
  components: {
    GameRules,
    GameAction,
    AdvertisingScreen,
    ResultScreen,
  },
  data() {
    return {
      isShowTiser: true,
      isShowRules: false,
      isStartGame: false,
      isShowResult: false,
      isRepeatGame: false,
      isShowPromo: false,
      cs: 0,
      percent: 0,
      time: 0,
      selectedValue: 0,
    };
  },
  mounted() {
    this.$root.$on('serverResponse', (statisticResult) => {
      const cs = statisticResult.cs || 0;
      const percent = statisticResult.percent || 0;
      this.cs = Math.round(cs * 60);
      this.percent = percent;
    });

    this.$root.$on('mathClickToSec', (time, storeLength) => {
      this.cs = Math.round((storeLength / (time / 1000)) * 60);
      this.percent = this.cs > 0 ? this.cs > 1 ? Math.floor(Math.random() * 40) + 20 : Math.floor(Math.random() * 10) : 0;
    });
  },
  methods: {
    visibilityChanged(isVisible) {
      if (isVisible) {
        Analytics.sendEvent('Project', 'Show');
      }
    },
    showRules() {
      this.isShowRules = !this.isShowRules;
      this.isShowTiser = false;
      Analytics.sendEvent('Click', 'click');
    },
    startGame() {
      this.isStartGame = true;
      this.isShowRules = !this.isShowRules;
    },
    stopGame() {
      this.isShowResult = !this.isShowResult;
      this.isStartGame = !this.isStartGame;
      this.isShowPromo = true;
    },

    restartGame() {
      this.showRules();
      this.isShowPromo = true;
      this.isShowResult = false;
      this.isStartGame = false;
    },
  },
};
</script>

<style lang="stylus">
body.is-blured-reaction-test .layout__content>:not(#page_wrapper),
body.is-blured-reaction-test .main>:not(.layout__content),
body.is-blured-reaction-test .page--index>:not(.special-reaction-test),
body.is-blured-reaction-test>:not(.main)
  filter: blur(2px);
  pointer-events: none;

.special-reaction-test

  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative
  z-index: 1
  max-width: 100%
  font-family: 'Roboto', sans-serif
  font-size: 16px
  line-height: normal
  text-size-adjust: 100%
  background-color: transparent
  overflow: hidden
  background: #FFF4E2
  border-radius: 8px
  margin-top: 28px;
  padding: 0 20px;

  & *
  & *:before
  & *:after
    box-sizing: border-box

  & b
    font-weight: 700

  &__container
    width: 640px
    max-width: 100%
    border-radius: 8px;
    margin: 30px 0

    @media (max-width: 466px)
      margin: 20px auto;

    &--inner
      margin: 18px 0 39px;

    &--branding
      background: #00B956;
      color: #fff;
      margin: 30px 0 0 0;
      border-top-left-radius: 0
      border-top-right-radius: 0


  &__teaser
    display flex
    align-items center
    flex-flow row wrap
    justify-content: space-between;
    @media (max-width: 466px)
      flex-flow column wrap
      align-items: flex-start;


  &__title
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    @media (max-width: 612px)
      max-width: 174px;
    @media (max-width: 466px)
      margin-bottom: 15px;
  &__gif
    background-image: url(https://leonardo.osnova.io/d60efb05-dd02-6dea-52e9-13b9c587e97f/)
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    width: 107px;
    height: 100px;

    position: absolute;
    right: 163px;
    @media (max-width: 466px)
      right: 35px;
  &__button
    cursor pointer
    font-weight: 500;
    font-size: 15px;
    line-height: 26px;
    padding: 7px 25px;
    background: #fff;
    -webkit-box-shadow: inset 0 0 0 1px #F5D69E;
    box-shadow: inset 0 0 0 1px #F5D69E;
    border: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 5px;
    -webkit-transition: background .1s ease-out,color .1s ease-out;
    transition: background .1s ease-out,color .1s ease-out;
    &:hover
      box-shadow: inset 0 0 0 1px #F5D69E, 0 1px 2px rgba(0,0,0,0.1);
    &:focus
      outline none
</style>
