<template>
    <div class="special-reaction-test-action">
      <div class="special-reaction-test-startScreen__inner" >
        <icon-base
          v-if="isRunningTimer"
          icon-name='icon-timer'
          width="19" height="21"
          viewBox="0 0 19 21">
            <icon-timer></icon-timer>
        </icon-base>
        <div
          class="special-reaction-test-startScreen__timer"
          ref="timer">
        </div>
      </div>
        <div class="special-reaction-test-action__base">
            <div
              class="special-reaction-test-action__cells"
              ref="cells"
              id="special-reaction-test-area"
            ></div>
        </div>

    </div>
</template>

<script>
import request from '../lib/request';
import IconTimer from './icons/IconTimer.vue';
import IconBase from './IconBase.vue';

export default {
  name: 'ActionCircle',
  components: {
    IconTimer,
    IconBase,
  },
  data() {
    return {
      isRunningTimer: false,
      selectedValue: 60, // для подсчета очков
      maxValue: 61, // для вывода кружков
      radius: null,
      circles: [],
      stage: '',
      rect: {},
      interval: null,
      data: [],
      store: [],
      correctClicks: 0,
      statistic: 0,
      rafID: 0,
      sendCompleted: false,
      addAnimation: false,
      time: {
        start: 0,
        current: 0,
        elapsed: 0,
      },
      storeLength: 0,
    };
  },
  mounted() {
    const stage = this.$refs.cells;
    this.stage = stage;
    this.rect = this.getBounding();
    this.fill(6); // заполнить 6 кружков
    this.radius = this.rect.width / 2;
    this.rafID = requestAnimationFrame(this.gameLoop);
  },
  beforeDestroy() {
    clearTimeout(this.interval, this.timerTimeout, this.timeoutAnimaton);
  },
  methods: {
    updateTimer() {
      this.isRunningTimer = true;
      const timerRef = this.$refs.timer;
      const time = 45 * 1000 - this.time.elapsed;
      const sec = time >= 0 ? (time / 1000).toFixed(0).slice(0, 2) : 0;
      const mil = time >= 0 ? this.leftPad((time % 1000).toFixed(0)) : 0;
      if (timerRef) {
        timerRef.innerHTML = `${sec}:${mil}`;
      }
    },
    leftPad(num) {
      const s = '000';

      return (s.substring(num.length) + num).slice(0, 3);
    },
    gameLoop(time) {
      if (this.time.start === 0) {
        this.time.start = time;
      }

      this.time.current = time;
      this.time.elapsed = this.time.current - this.time.start;

      this.timerTimeout = setTimeout(this.updateTimer, 800);

      if (this.time.elapsed >= 45 * 1000 || this.selectedValue === 0) {
        clearTimeout(this.timeoutId);

        if (this.store.length) {
          this.sendData();
        }
        if (!this.sendCompleted) {
          this.stopGame();
          clearTimeout(this.timerTimeout);
        }
      }

      this.rafID = requestAnimationFrame(this.gameLoop);
    },

    saveData(number) {
      const data = {
        time: this.time.elapsed, // from timer
        number: number + 1,
        isCorrect: number === this.selectedValue,
      };
      this.data.push({ ...data });
      this.store.push({ ...data });
      this.storeLength = this.data.length;

      clearTimeout(this.timeoutSendData);
      this.timeoutSendData = setTimeout(this.sendData, 1000);
    },

    sendData() {
      const data = this.arrayToFormData(this.store);
      this.store = [];
      request('/special/reaction-test/click', 'POST', data);
    },
    sendAllData() {
      this.sendCompleted = true;
      const data = this.arrayToFormData(this.data);
      this.data = [];
      request('/special/reaction-test/finish', 'POST', data)
        .then((res) => {
          const jsonData = JSON.parse(res).data;
          if (jsonData && jsonData.cs && jsonData.percent) {
            this.$root.$emit('serverResponse', {
              cs: +jsonData.cs || 0,
              percent: +jsonData.percent || 0,
            });
          } else {
            this.$root.$emit('mathClickToSec', this.time.elapsed, this.storeLength);
          }
        }).catch((err) => {
          if (err) {
            this.$root.$emit('mathClickToSec', this.time.elapsed, this.storeLength);
          }
        });
    },
    arrayToFormData(array) {
      const clone = [].slice.call(array);
      const formData = new FormData();

      for (let i = 0; i < clone.length; i += 1) {
        const keys = Object.keys(clone[i]);
        for (let v = 0; v < keys.length; v += 1) {
          formData.append(`items[${i}][${keys[v]}]`, clone[i][keys[v]]);
        }
      }
      return formData;
    },


    checkItem(event) {
      const value = parseInt(event.target.innerHTML, 10);
      this.addAnimation = true;
      if (value === this.selectedValue) { // если число в кружке равно следующему по порядку числу
        this.selectedValue -= 1; // вычесть из него 1
        this.maxValue -= 1; // вычесть из максимально возможного числа 1

        if (this.maxValue > 0) {
          this.appendItem(this.maxValue); // вывести еще один кружок, с числом, следущим по порядку
          this.saveData(this.selectedValue);
        }

        if (this.maxValue <= 0) { // фиксим недостающие кружки после fill()
          this.saveData(this.selectedValue); // сохранить данные для отправки на сервер
        }

        if (this.sendCompleted) {
          this.stopGame();
        }

        event.target.classList.add('special-reaction-test-action__cell--hide');

        this.timeoutAnimaton = setTimeout(() => event.target.parentElement.remove(), 1000);
      }
    },
    stopGame() {
      this.$emit('stop');
      this.isShowResult = true;
      this.isRunningTimer = false;
      this.timeoutId = setTimeout(this.sendAllData(), 1500);

      cancelAnimationFrame(this.rafID);
    },
    fill(count = 1) {
      for (let i = 0; i < count; i += 1) {
        this.maxValue -= 1; // отправляет меньше чисел, потому что здесь они вычитаются из maxValue
        this.appendItem();
      }

      requestAnimationFrame(this.move);
    },
    getBounding() {
      return this.stage.getBoundingClientRect();
    },
    randomPos(rect) {
      const w = rect.width;
      const h = rect.height;

      const rw = Math.round(Math.random() * w);
      const rh = Math.round(Math.random() * h);

      return { x: rw, y: rh };
    },
    isEven() {
      const n = Math.round(Math.random() * 1000);

      return n % 2 === 0;
    },
    move() {
      this.circles.forEach((circle) => {
        this.animate(circle, this.rect);
      });
      requestAnimationFrame(this.move);
    },

    checkRadius(x, y, diameter, scale) {
      const cRadius = 310 / 2;
      const cX = cRadius;
      const cY = cRadius;
      const radius = diameter / 2;
      const x1 = x + radius;
      const y1 = y + radius;
      const distance = Math.sqrt((x1 - cX) * (x1 - cX) + (y1 - cY) * (y1 - cY)) + radius * scale;

      return distance < cRadius;
    },

    random(dir) {
      const d = Math.random();
      let value;
      if (d < 0.5) value = dir;
      else if (d < 0.9) { value = -1; } else { value = 0; }
      return value;
    },

    animate(circle) {
      const nextX = circle.x + 2 * circle.speed * Math.cos(this.degToRad(circle.direction));
      const nextY = circle.y + 2 * circle.speed * Math.sin(this.degToRad(circle.direction));

      if (circle.scale >= circle.scaleMax) {
        circle.scaleDir = -1;
      } else if (circle.scale <= circle.scaleMin) {
        circle.scaleDir = 1;
      }

      circle.scale += circle.scaleSpeed * circle.scaleDir;
      circle.inner.style.transform = `scale(${circle.scale})`;

      if (!this.checkRadius(nextX, nextY, circle.diameter, circle.scale)) {
        const offset = 180 + this.randomFromInterval(-45, 45);

        circle.direction = this.rotate(circle.direction, offset);
      }

      circle.x += circle.speed * Math.cos(this.degToRad(circle.direction));
      circle.y += circle.speed * Math.sin(this.degToRad(circle.direction));

      circle.node.style.transform = `translate(${circle.x}px, ${circle.y}px)`;
    },

    getRandomPoint() {
      const padding = 50;
      const diameter = 160 * 2 - padding;
      const r = diameter / 2;
      const a = Math.random() * Math.PI * 2;
      const x = r + Math.random() * (Math.cos(a) * r);
      const y = r + Math.random() * (Math.sin(a) * r);

      return { x, y };
    },

    degToRad(degrees) {
      const pi = Math.PI;

      return degrees * (pi / 180);
    },

    rotate(degrees, offset) {
      const t = degrees + offset;

      return t > 360 ? t - 360 : t < 0 ? 360 + t : t;
    },

    randomFromInterval(min, max) {
      return Math.random() * (max - min) + min;
    },

    appendItem() { // рендер кружка в рандомном месте
      const { x, y } = this.getRandomPoint();

      const direction = Math.random() * 360;
      const node = document.createElement('div');
      const inner = document.createElement('div');
      inner.innerHTML = this.maxValue;
      node.className = `special-reaction-test-action__cell ${this.maxValue % 2 === 0 ? 'even' : 'odd'}`;
      node.appendChild(inner);
      node.addEventListener('click', this.checkItem);

      node.style.transform = `translate(${x}px, ${y}px);`;

      this.stage.append(node);

      const diameter = node.offsetWidth;
      const speed = 0.3;

      const scaleMin = 0.7;
      const scaleMax = 1;
      const scale = this.randomFromInterval(scaleMin, scaleMax);
      const scaleSpeed = 0.0025;
      const scaleDir = Math.random() > 0.5 ? -1 : 1;
      inner.style.transform = `scale(${scale})`;

      this.circles.push({
        x,
        y,
        diameter,
        direction,
        speed,
        scale,
        scaleSpeed,
        scaleDir,
        scaleMin,
        scaleMax,
        node,
        inner,
      });
    },
  },

};
</script>

<style lang="stylus">
.special-reaction-test-action
    display: flex;
    justify-content: center;
    flex-flow: column nowrap;
    align-items center
    &__base
        width: 328px
        height: 328px
        background: white
        border-radius: 50%
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center

    &__button
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
    &__cells
        width: 100%
        height: 100%
        position: relative;
        animation: megafon-rotate ease-in-out 1s both
        transform translateZ(0)
        will-change transform

    &__cell
        transform translateZ(0)
        will-change transform
        position: absolute;
        width: 50px
        height: 50px

        color: #fff;
        font-size: 16px;
        line-height: 19px;

        cursor: pointer
        transition width .5s, height .5s
        will-change: transform

        &:hover div
          background: #00C25A

        div
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          border-radius: 50%
          background: rgba(0,185,86,1);
          will-change: transform

          width: 100%
          height: 100%
        &:focus
          outline none

    &__cell:nth-child(1)
        z-index: 10
        width: 65px
        height: 65px
        & > div
          animation-delay 2s
          animation-duration 8s
    &__cell:nth-child(2)
        width: 55px
        height: 55px
        & > div
          animation-delay 3s
          animation-duration 10s
    &__cell:nth-child(3)
        width: 50px
        height: 50px
        & > div
          animation-delay 1s
          animation-duration 8s
    &__cell:nth-child(4)
        width: 45px
        height: 45px
        & > div
          animation-delay 4s
          animation-duration 6s
    &__cell:nth-child(5)
        width: 48px
        height: 48px
        & > div
          animation-delay 3s
          animation-duration 10s
    &__cell:nth-child(6)
        width: 58px
        height: 58px
        & > div
          animation-delay 1s
          animation-duration 6s
    &__cell.even div
        background-color: rgba(115,25,130,1);
        &:hover
          background-color: #851B97
.special-reaction-test-action__cell--hide
  -webkit-animation: megafon-bounce 0.1s ease-in-out 1 forwards;
  animation: megafon-bounce 0.1s ease-in-out 1 forwards;
  animation-delay 0s !important
  animation-duration .1s !important

@keyframes megafon-rotate
    0%
      transform: rotate(0deg)
    100%
      transform: rotate(720deg)
@keyframes megafon-bounce
  0%
    transform: scale(1.0);
    -webkit-transform: scale(1.0);

  100%
    transform: scale(0.0);
    -webkit-transform: scale(0.0);


</style>
