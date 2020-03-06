<template lang="pug">
  button.step-button.ba.br2.b--green.ph3.pv2.tc.w-100(
    @click="handleClick"
    :disabled="disabled"
    :class="buttonClass"
  )
    slot
</template>
<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: ''
    },
    primary: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClass () {
      const list = [this.disabled ? 'forbid' : 'pointer']
      if (this.primary) {
        list.push('white', 'bg-green')
      } else {
        list.push('green', 'bg-white')
      }
      return list
    }
  },
  methods: {
    handleClick () {
      if (!this.disabled && this.to) {
        this.$router.push(this.to)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.step-button.forbid {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
