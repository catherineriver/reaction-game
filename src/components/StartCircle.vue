<template>
    <div class="special-reaction-test-start">
        <div class="special-reaction-test-start__base">
            <div class="special-reaction-test-start__cells" :class="classes">
                <div class="special-reaction-test-start__cell" v-for="item in reducedArray" :key="item[item]">
                    <span>{{item}}</span>
                </div>
            </div>
            <div class="special-reaction-test-start__button"
                v-on="{ mousedown: mouseDown }"
                @click="startGame"
            >Начать</div>
        </div>

    </div>
</template>

<script>

export default {
  name: 'StartCircle',
  data() {
    return {
      classes: ['disabled'],
      randomArray: [],
      reducedArray: [0, 0, 0, 0, 0, 0],
      hover: false,
    };
  },
  mounted() {
    this.getRandomNumbers(0, 60);
  },
  methods: {
    getRandomNumbers(min, max) {
      const ARRAY_LENGTH = 60;
      const { randomArray } = this;
      const mathMin = Math.ceil(min);
      const mathMax = Math.floor(max);
      for (let i = 0; i < ARRAY_LENGTH; i += 1) {
        randomArray.push(Math.floor(Math.random() * (mathMax - mathMin)) + mathMin);
      }
      this.reducedArray = randomArray.slice(0, 6);
    },
    mouseDown() {
      this.classes = ['animated'];
    },
    startGame() {
      this.$emit('clicked');
      this.startGame = true;
    },
  },

};
</script>

<style lang="stylus">
.special-reaction-test-start
    display: flex;
    justify-content: center;
    margin-top: 15px;

    @media (max-width: 375px)
        margin-top 15px

    &__base
        width: 328px
        height: 328px
        background: white
        border-radius: 50%
        position: relative;
    &__button
        font-weight: bold
        color #FFFFFF
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120px
        height: 120px
        background: #00B956;
        border-radius: 50%
        position: absolute;
        top: 104px;
        right: 104px;
        cursor pointer
        animation: megafon-show ease 0.2s both
        transform: scale(0)
        transition background .5s
        opacity 1
        animation-delay: .8s;
        &:hover
            background: #00C25A

    &__cells
        width: 328px
        height: 328px
        position: absolute;
        // &.animated
        //     animation: megafon-rotate ease 2s both


    &__cell
        width: 50px
        height: 50px
        border-radius: 50%
        background: rgba(255,244,226,1);

        position: absolute;

    &__cell span
        width: 50px;
        height: 50px;
        border-radius: 50%
        font-size: 16px;
        line-height: 19px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        background: rgba(0,185,86,1);
        animation: megafon-show ease 0.2s both
        transform: scale(0)
        opacity 1

    &__cell:nth-child(1)
        top: 42px;
        left: 83px;
    &__cell:nth-child(1) span
        animation-delay: .7s;

    &__cell:nth-child(2)
        top: 139px;
        left: 27px;
    &__cell:nth-child(2) span
        animation-delay: 0.6s;

    &__cell:nth-child(3)
        bottom: 42px;
        left: 83px;
    &__cell:nth-child(3) span
        animation-delay: 0.5s;

    &__cell:nth-child(4)
        bottom: 42px;
        left: 195px;
    &__cell:nth-child(4) span
        animation-delay: 0.4s;

    &__cell:nth-child(5)
        top: 139px;
        left: 251px;
    &__cell:nth-child(5) span
        animation-delay: 0.3s;

    &__cell:nth-child(6)
        top: 42px;
        left: 195px;
    &__cell:nth-child(6) span
        animation-delay: 0.2s;

    &__cell:nth-child(odd) span
        background-color: rgba(115,25,130,1);


@keyframes megafon-show
    0% { transform: scale(0) }
    100% { transform: scale(1) }
@keyframes megafon-rotate
    0% { transform: rotate(0deg) }
    50% { transform: rotate(360deg)}
</style>
