<template lang="pug">
  main
    .vh-100.vw-100.flex.items-center.justify-center
      h1 Hi! {{$auth.user}}
</template>
<script>
export default {
  async created () {
    console.log(await this.$axios.get(`${process.env.API_ENDPOINT}/grocery/123`, {
      headers: {
        Authorization: `Bearer ${this.$auth.token}`
      }
    }))
  }
}
</script>
