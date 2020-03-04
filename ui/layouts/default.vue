<template lang="pug">
  div
    .vh-100.vw-100.flex.items-center.justify-center(v-if="!isAuthenticated")
      .f3
        | 等待登入中
        i.fas.fa-spinner.fa-pulse.ml3
    div(v-else)
      nuxt/
</template>
<script>
export default {
  computed: {
    isAuthenticated () {
      if (!this.$auth) {
        // if in server side
        return false
      } else if (this.$auth.fake) {
        // if auth0 is disabled
        return true
      }
      if (this.$auth.loading) {
        return false
      }
      return this.$auth.isAuthenticated
    },
    canLogin () {
      return !this.isAuthenticated && this.$auth && !this.$auth.loading
    }
  },
  created () {
    if (this.canLogin) {
      this.$auth.loginWithRedirect()
    }
  }
}
</script>
