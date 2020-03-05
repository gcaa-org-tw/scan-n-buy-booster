<template lang="pug">
  .create.pa3.mw-100
    h1 Create!
    input.w-100.mw-100(v-model.trim="barcode" @keyup.enter="getCompany(barcode)" type="text" placeholder="請輸入 12345 ，然後 enter")
    pre.gray.pa3.ba {{company}}
    pre.gray.pa3.ba.mt3 {{item}}
</template>
<script>
const STEPS = [
  'barcode',
  'companyInfo',
  'itemName',
  'coverImage',
  'detailImage'
]

export default {
  data () {
    return {
      barcode: '',
      companyInfo: null,
      itemName: '',
      coverImage: null,
      detailImage: null,

      curStep: STEPS[0],
      company: null,
      item: null
    }
  },
  methods: {
    nextStep () {
      this.curStep = (STEPS.indexOf(this.curStep) + 1) % STEPS.length
    },
    prevStep () {
      const curIndex = STEPS.indexOf(this.curStep)

      if (curIndex > 0) {
        this.curStep = STEPS[curIndex - 1]
      }
    },
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
      const key = this.$auth.user[process.env.META_API_KEY]
      console.log(key, this.$auth.user)
      const netR = await this.$axios.get(net, {
        headers: {
          'x-thaubing-api-key': key
        }
      })
      console.log(netR)
      this.item = netR.data
    }
  }
}
</script>
