<template lang="pug">
  .adminstats.pa4.mw9.center.bl.br.b--moon-gray.bg-washed-green.min-vh-100
    h1.mt0 各帳號回報次數統計
    table.collapse.ba.br2.b--gray.pv2.ph3
      thead
        tr.b
          th.pa2 信箱
          th.pa2 回報次數
      tbody
        tr.striped--light-gray(v-for="(row, i) in mailCountList" :key="i")
          td.pa2 {{row.email}}
          td.pa2 {{row.counter}}

</template>
<script>
import { getComEndpoint } from '~/utils/api'

export default {
  data () {
    return {
      mailCountList: []
    }
  },
  created () {
    if (!this.$auth.isAdmin) {
      this.$router.replace('/')
    } else {
      this.getAdminStats()
    }
  },
  methods: {
    async getAdminStats () {
      const token = encodeURIComponent(this.$auth.adminToken)
      const url = `/mirror/admin-stats?token=${token}`
      const resp = await getComEndpoint(url)
      if (resp.data) {
        this.mailCountList = resp.data.stats
      }
    }
  }
}
</script>
