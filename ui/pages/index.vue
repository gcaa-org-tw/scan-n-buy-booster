<template lang="pug">
  main
    .vh-100.vw-100.flex.items-center.justify-center
      .f3(v-if="!$auth.loggedIn")
        | 等待登入中
        i.fas.fa-spinner.fa-pulse.ml3
      .pa3(v-else)
        h1 Hi {{$auth.user.name}}!
</template>
<script>
export default {
  created () {
    if (process.client && !this.$auth.loggedIn) {
      this.$auth.login()
    }
  }
}
</script>
