<template lang="pug">
  .done.min-vh-100.flex.flex-column.justify-between
    .flex.items-center.justify-center.pa3.flex-auto
      .tc(v-if="isUploading")
        | 上傳中
        i.fas.fa-spinner.fa-pulse.ml3
      .tc(v-else)
        div.lh-copy(v-if="isSucceeded")
          h1.mv2.green.f2 上傳完成
          .f5 (ﾉ´▽｀)ﾉ♪
          .f5 產品紀錄量來到
          .f2.white.mv2.b.bg-yellow.dib.ph3 {{totalItems.toLocaleString()}}
          .f5 筆囉！
        div(v-else)
          h1.lh-copy 上傳失敗
          .f4 ヽ(￣д￣;)ノ
        step-button.mt4(
          :primary="true"
          to="/create-item/scan"
        ) 再來一筆
    auth0-badge
</template>
<script>
import { mapState } from 'vuex'
import { postCreation } from '~/utils/mixins'
import StepButton from '~/components/StepButton'
import Auth0Badge from '~/components/Auth0Badge'
import { postComEndpoint } from '~/utils/api'
import { MUTATIONS } from '~/store'

export default {
  components: {
    StepButton,
    Auth0Badge
  },
  mixins: [postCreation],
  data () {
    return {
      isUploading: true,
      isSucceeded: true
    }
  },
  computed: {
    ...mapState(['totalItems'])
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
    async updateMirror () {
      const state = this.$store.state
      const company = state.companyInfo
      const payload = {
        barcode: state.barcode,
        origName: company.origName,
        id: company.id,
        name: company.name
      }
      const result = await postComEndpoint('/mirror/ping', payload)
      if (result.data.success) {
        this.$store.commit(MUTATIONS.SET_TOTAL_ITEMS, result.data.sum)
      }
    },
    async uploadIt () {
      this.isUploading = true

      const state = this.$store.state
      const textData = {
        corp_name: state.companyInfo.name,
        category: state.mainCat,
        product_name: state.itemName
      }
      if (state.companyInfo.id && !state.companyInfo.origName) {
        // only set corp_id when there's no alternative name
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
        await this.updateMirror()
      } catch (err) {
        console.error('error when backup', err)
      }
      this.$store.commit(MUTATIONS.RESET_ITEM)
      this.isUploading = false
      return true
    }
  }
}
</script>
