<template lang="pug">
  .done.pa3.min-vh-100.flex.items-center.justify-center
    .tc(v-if="isUploading")
      | 上傳中
      i.fas.fa-spinner.fa-pulse.ml3
    .tc(v-else)
      h1.lh-copy 上傳完成
      .f4 (ﾉ´▽｀)ﾉ♪
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
      isUploading: true
    }
  },
  created () {
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
    this.uploadIt()
  },
  methods: {
    uploadIt () {
      this.isUploading = true
      // this.isUploading = false
    }
  }
}
</script>
