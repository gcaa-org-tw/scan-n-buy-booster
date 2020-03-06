<template lang="pug">
  main
    .vh-100.vw-100.flex.items-center.justify-center
      nuxt-link.bg-white.ph3.pv2.ba.br2.db.dim.link.green(to="/create-item/scan") 新增第一筆！
</template>
<script>
// TODO: console.error -> sentry
// TODO: manually insert barcode if failed
// TODO: manually insert company info if null
export default {
}
</script>
