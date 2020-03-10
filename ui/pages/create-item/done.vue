<template lang="pug">
  .done.pa3.min-vh-100.flex.items-center.justify-center
    .tc(v-if="isUploading")
      | 上傳中
      i.fas.fa-spinner.fa-pulse.ml3
    .tc(v-else)
      div(v-if="isSucceeded")
        h1.lh-copy 上傳完成
        .f4 (ﾉ´▽｀)ﾉ♪
      div(v-else)
        h1.lh-copy 上傳失敗
        .f4 ヽ(￣д￣;)ノ
      step-button.mt4(
        :primary="true"
        to="/create-item/scan"
      ) 再來一筆
</template>
<script>
import { postCreation } from '~/utils/mixins'
import StepButton from '~/components/StepButton'

export default {
  components: {
    StepButton
  },
  mixins: [postCreation],
  data () {
    return {
      isUploading: true,
      isSucceeded: true
    }
  },
  async created () {
    const state = this.$store.state
    const required = [
      'barcode',
      'itemName',
      'companyInfo',
      'mainCat',
      'coverImage',
      'detailImage'
    ]
    const canUpload = required.every(key => !!state[key])
    if (!canUpload) {
      this.$router.push('/create-item/scan')
      return
    }
    this.isSucceeded = await this.uploadIt()
  },
  methods: {
    async oneShot (data) {
      const barcode = this.$store.state.barcode
      const endpoint = `${process.env.META_API_ENDPOINT}/json/product/create`
      const axiosOpt = {
        headers: {
          'x-thaubing-api-key': this.$auth.user[process.env.META_API_KEY]
        }
      }
      data = {
        barcode,
        ...data
      }
      try {
        const result = await this.$axios.post(endpoint, data, axiosOpt)
        if (result.data.success !== 1) {
          alert('上傳錯誤：\n' + result.data.errors.join('\n\t'))
          return false
        }
      } catch (err) {
        console.error(err)
        alert(`上傳錯誤： ${err}`)
        return false
      }
      return true
    },
    async backupToFormIfNeeded () {
      const state = this.$store.state
      const company = state.companyInfo
      if (!company.origName || !company.name) {
        return
      }
      const payload = {
        barcode: state.barcode,
        origName: company.origName,
        id: company.id,
        name: company.name
      }
      const params = {
        headers: {
          Authorization: `Bearer ${this.$auth.token}`
        }
      }
      const endpoint = `${process.env.COMPANY_API_ENDPOINT}/backup`
      await this.$axios.post(
        endpoint,
        payload,
        params
      )
    },
    async uploadIt () {
      this.isUploading = true

      const state = this.$store.state
      const textData = {
        corp_name: state.companyInfo.name,
        category: state.mainCat,
        product_name: state.itemName
      }
      if (state.companyInfo.id) {
        textData.corp_id = state.companyInfo.id
      }
      if (state.subCat) {
        textData.category_sub = state.subCat
      }
      // let's be server friendly => upload sequentially
      try {
        let success = await this.oneShot(textData)
        if (!success) {
          this.isUploading = false
          return false
        }
        success = await this.oneShot({
          photo_is_primary: 1,
          photo: state.coverImage
        })
        if (!success) {
          this.isUploading = false
          return false
        }
        success = await this.oneShot({
          photo: state.detailImage
        })
        if (!success) {
          this.isUploading = false
          return false
        }
      } catch (err) {
        console.error(err)
        alert(`上傳錯誤： ${err}`)
      }
      try {
        await this.backupToFormIfNeeded()
      } catch (err) {
        console.error('error when backup', err)
      }
      this.isUploading = false
      return true
    }
  }
}
</script>
