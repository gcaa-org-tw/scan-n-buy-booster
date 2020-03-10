<template lang="pug">
  main
    .vh-100.vw-100.flex.flex-column.items-center.justify-center
      .mv4
        .f5 目前已有
        .f1.b.mv2 {{total.toLocaleString()}}
        .f5 筆資料！
      nuxt-link.bg-white.ph3.pv2.ba.br2.db.dim.link.green(to="/create-item/scan") 新增一筆！
</template>
<script>
import { getComEndpoint } from '~/utils/api'

// TODO: auto deploy
export default {
  async asyncData () {
    let total = 0
    try {
      const result = await getComEndpoint('/mirror/counter')
      if (result.data.success) {
        total = result.data.counter
      }
    } catch (err) {
      console.error(err)
    }
    return {
      total
    }
  },
  data () {
    return {
      total: 0
    }
  },
  async created () {

  }
}
</script>
