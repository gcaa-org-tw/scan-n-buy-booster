<template lang="pug">
  .stats.pa4.mw9.center.bl.br.b--moon-gray.bg-washed-green.min-vh-100
    h1.mt0 每個帳號的回報次數分佈
    .mb4.f5.gray 看看大部分人都回報了多少次
    .mv4(ref="chart")
    table.collapse.ba.br2.b--gray.pv2.ph3
      thead
        tr.b
          th.pa2 回報次數
          th.pa2 帳號數
      tbody
        tr.striped--light-gray(v-for="row in histogram" :key="row.counter")
          td.pa2 {{row.counter}}
          td.pa2 {{row.n}}
</template>
<script>
import c3 from 'c3'
import { getComEndpoint } from '~/utils/api'

export default {
  data () {
    return {
      histogram: []
    }
  },
  async created () {
    const resp = await getComEndpoint('/mirror/stats')
    if (!resp.data.success) {
      return
    }
    this.histogram = resp.data.stats
    this.draw()
  },
  methods: {
    draw () {
      const statsMap = {}
      let maxCounter = 0
      this.histogram.forEach((row) => {
        statsMap[row.counter] = row.n
        maxCounter = row.counter
      })
      const chartData = []
      for (let i = 1; i <= maxCounter; i++) {
        chartData.push(statsMap[i] || 0)
      }
      c3.generate({
        bindto: this.$refs.chart,
        data: {
          type: 'bar',
          columns: [
            ['回報次數', ...chartData]
          ]
        },
        axis: {
          x: {
            label: '回報次數'
          },
          y: {
            label: '帳號數'
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
