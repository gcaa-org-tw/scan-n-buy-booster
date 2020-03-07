<template lang="pug">
  .horizontal-step.w-100.flex.justify-between(
    :class="{'horizontal-step--right': isRightHand}"
  )
    .horizontal-step__tail.flex.flex-column.justify-between
      .w-100(v-show="isLandscape")
        slot(name="head")
      .w-100(v-show="isLandscape")
        slot(name="action")
      .w-100
        slot(name="tail")
    .horizontal-step__content
      slot
      .w-100(v-show="!isLandscape")
        slot(name="action")
    .horizontal-step__head(v-show="!isLandscape")
      slot(name="head")
      .br2.white.bg-orange.pa2.mt2.tc
        i.fas.fa-exclamation-triangle.mr2
        | 請將手機橫放，拍攝橫向照片 (◕﹏◕✿)
</template>
<script>
export default {
  props: {
    isRightHand: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isLandscape: false,
      rotationDetactor: null
    }
  },
  computed: {
  },
  created () {
    if (!window) {
      return
    }
    // eslint-disable-next-line nuxt/no-globals-in-created
    this.rotationDetactor = window.matchMedia('(orientation: landscape)')

    this.isLandscape = !!this.rotationDetactor.matches

    // Add a media query change listener
    this.rotationDetactor.addListener(this.handleRotaionChanged)
  },
  beforeDestroy () {
    this.rotationDetactor.removeListener(this.handleRotaionChanged)
  },
  methods: {
    handleRotaionChanged (mql) {
      this.isLandscape = !!mql.matches
    }
  }
}
</script>
<style lang="scss" scoped>
$toolbarWidth: 10rem;

.horizontal-step {
  // simple hack for mobile browser nav bar
  // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
  max-height: calc(100vh - 1rem);
  height: calc(100vh - 1rem);
  flex-direction: column-reverse;

  &__content {
    padding: 1rem 0;
  }

  @media screen and (orientation: landscape) {
    flex-direction: row;

    &.horizontal-step--right {
      flex-direction: row-reverse;

      .horizontal-step__content {
        padding: 0 1rem 0 0;
      }
    }

    &__content {
      width: calc(100% - #{$toolbarWidth});
      padding: 0 0 0 1rem;
    }

    &__tail {
      width: $toolbarWidth;
    }
  }
}
</style>
