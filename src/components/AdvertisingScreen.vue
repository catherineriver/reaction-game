<template>
    <div class="special-reaction-test-advertising">
      <div class="special-reaction-test-advertising__title">Развивать скорость реакции удобнее с самым быстрым интернетом.</div>
      <div class="special-reaction-test-advertising__desc">С ним можно легко общаться по видеосвязи и в соцсетях, смотреть фильмы, играть в любимые игры, и конечно, работать. Где угодно, с любого гаджета — на высоких скоростях от МегаФона.</div>
      <div class="special-reaction-test-advertising__desc">МегаФон четвёртый год подряд лидирует по скорости мобильного интернета в России — по данным международного агентства <a href="https://clck.ru/R9D8g" target="_blank">Ookla.</a></div>

    <div class="special-reaction-test-advertising__footer">
        <a
            class="special-reaction-test-advertising__button"
            href="https://clck.ru/R9D42"
            target="_blank"
            @click="sendAnalytics"
        >
            Хочу самый быстрый интернет
        </a>
        <a class="special-reaction-test-advertising__logo" href="https://clck.ru/R9D42">
            <icon-base
                icon-name='icon-logo'
                width="130" height="23"
                viewBox="0 0 130 23"
            >
                <icon-logo></icon-logo>
            </icon-base>
        </a>
    </div>
    </div>
</template>

<script>
import * as Analytics from '../lib/analytics';
import IconLogo from './icons/IconLogo.vue';
import IconBase from './IconBase.vue';

export default {
  name: 'AdvertisingScreen',
  components: {
    IconLogo,
    IconBase,
  },
  methods: {
    sendAnalytics() {
      Analytics.sendEvent('Promo');
    },
  },
};
</script>

<style lang="stylus">
.special-reaction-test-advertising
    display: flex;
    flex-flow: column nowrap;
    padding 25px 0
    &__columns
        display flex
        flex-flow: row nowrap
        justify-content: space-between;
        margin-top: 20px;
        margin-bottom: 10px;
        @media (max-width: 375px)
            flex-flow: column nowrap
            margin-bottom: 25px;

    &__title
        font-weight: 500;
        font-size: 22px;
        line-height: 28px;
        max-width 403px
        margin-bottom: 10px;
    &__desc
        font-weight: normal;
        font-size: 16px;
        line-height: 25px;
        margin 8px 0
        & > a
            color #fff
            text-decoration underline
    &__button
        text-decoration: none;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        color: #00B956;
        background #ffffff
        padding: 13px 27px
        border: none
        border-radius: 5px;
        cursor pointer
        transition box-shadow .5s
        display block
        &:hover
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
    &__footer
        display flex
        flex-flow row nowrap
        align-items center
        margin-top: 25px;
        @media (max-width: 475px) {
            flex-flow column nowrap
            align-items flex-start
        }
    &__logo
        margin-left 25px
        @media (max-width: 475px) {
            margin-top 25px;
        }


</style>
