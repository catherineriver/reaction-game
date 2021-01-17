<template>
  <div class="special-reaction-test-statistic">
    <div class="special-reaction-test-statistic__figure"></div>
    <svg viewBox="0 0 36 36" class="special-reaction-test-statistic__chart">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#731982" />
          <stop offset="100%" stop-color="#A910C2" />
        </linearGradient>
      </defs>

      <path class="special-reaction-test-statistic__circle" v-if="clicks > 0"
        :stroke-dasharray='[clicks, percents]'
        stroke="url(#gradient)"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />

    </svg>
    <div class="special-reaction-test-statistic__percentage">
      <div class="special-reaction-test-statistic__value" v-html="clicks"/>
      кликов в минуту
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatisticChart',
  props: {
    clicks: {
      type: Number,
    },
    percents: {
      type: Number,
      default: 100,
    },
  },
};
</script>

<style lang="stylus">
  .special-reaction-test-statistic
    display: block;
    position relative
    width: 270px;
    margin: 0 auto;
    @media (max-width: 375px)
      width: 250px;
      margin-top 25px
      margin-bottom: 30px;
    &__figure
      position: relative;
      width: 240px;
      max-width: 100%;
      margin: 0 auto;
      border: 10px solid #fff;
      border-radius: 100%;
      position: absolute;
      top: 15px;
      right: 15px;
      z-index: -1;

      &::after
        content: '';
        display: block;
        padding-top: 100%;
      @media (max-width: 375px)
        width: 224px;
        top: 13px;
        right: 13px;
    &__chart
      max-height: 270px;

    &__circle
      fill: none;
      stroke-width: 2.6px;
      animation: progress 1s ease-out forwards;

    &__percentage
      font-weight: normal;
      font-size: 18px;
      line-height: 25px;

      position absolute
      display flex
      align-items center
      flex-flow column nowrap
      justify-content center

      background #00B956
      border-radius: 50%
      width 180px
      height 180px

      color #ffffff
      position: absolute;
      top: 45px;
      right: 45px;
      @media (max-width: 375px)
        top: 35px;
        right: 35px;

    &__value
      font-weight: bold;
      font-size: 45px;
      margin-bottom: 10px;
  @keyframes progress {
    0% {
      stroke-dasharray: 0 100;
    }
  }


</style>
