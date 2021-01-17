<template>
    <div
        class="special-reaction-test-gif"
        ref="gifContainer"
    >
        <img src="https://leonardo.osnova.io/c3d19ca2-7d18-cb77-ef42-dbee0f260c90/" alt="">
    </div>
</template>

<script>

export default {
  name: 'Gif',
};
</script>

<style lang="stylus">
.special-reaction-test-gif
    max-width: 640px;
    position relative;
    height: 382px;
    overflow: hidden;

    transform: translateY(39px)
    @media (max-width: 380px)
      height: 240px;
    @media (max-width: 455px) and (min-width 380px)
      height: 285px ;
    @media (max-width: 485px) and (min-width 455px)
      height: 352px;

    & img
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
</style>
