<template lang="pug">
  .create.pa3.mw-100
    h1 Create!
    input.w-100.mw-100(v-model.trim="barcode" @keyup.enter="getCompany(barcode)" type="text")
    pre.gray.pa3.ba {{company}}
    pre.gray.pa3.ba.mt3 {{item}}
</template>
<script>

export default {
  data () {
    return {
      barcode: '',
      company: null,
      item: null
    }
  },
  methods: {
    async getCompany (barcode) {
      const params = {
        headers: {
          Authorization: `Bearer ${this.$auth.token}`
        }
      }
      barcode = encodeURIComponent(barcode.trim())
      if (!barcode) {
        return
      }
      const endpoint = `${process.env.COMPANY_API_ENDPOINT}/grocery/${barcode}`
      const resp = await this.$axios.get(endpoint, params)
      this.company = JSON.stringify(resp.data, null, '  ')

      const net = `${process.env.META_API_ENDPOINT}/json/product/${barcode}`
      const netR = await this.$axios.get(net, {
        headers: {
          'x-thaubing-api-key': process.env.META_API_KEY
        }
      })
      console.log(netR)
      this.item = netR.data
    }
  }
}
</script>
