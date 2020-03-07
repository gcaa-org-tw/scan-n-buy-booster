<template lang="pug">
  vertical-step.company.pa3
    template(slot="head")
      .gray 第 ② 步
      h1.f3.mt0 確認公司資訊
    .company__main
      .tc(v-if="isLoading")
        | 查詢公司資料中
        i.fas.fa-spinner.fa-pulse.ml3
      .center(v-if="isExisted")
        .f5.tc 這筆已收集過惹
        .f5.tc.mt2 (◕︵◕)
        .w-50.center.mt4
          step-button(
            to="/create-item/scan"
          ) 再來一筆
      .w-100(v-if="!isLoading && !isExisted")
        .flex.mv2
          .company__label 產品條碼：
          .company__value {{barcode}}
        .flex.mv2
          .company__label 公司名稱：
          .company__value
            span.truncate(v-if="hasName") {{name}}
            .bb.b--green(v-else)
              input.w-100.bw0(v-model.trim="name" placeholder="請幫我輸入公司名稱..")
        .flex.mv2
          .company__label 公司統編：
          .company__value
            span.truncate(v-if="hasId") {{id}}
            .bb.b--green(v-else)
              input.w-100.bw0(v-model.trim="id" placeholder="請幫我輸入公司統編（選填）")
    .flex(slot="tail" v-if="!isExisted")
      .w-50.pr2
        step-button(
          to="/create-item/scan"
        ) 上一步
      .w-50.pl2
        step-button(
          to="/create-item/set-name-category"
          :primary="true"
          :disabled="!allowNext"
        ) 下一步
</template>
<script>
import { mapState } from 'vuex'
import { MUTATIONS } from '~/store'
import { postCreation } from '~/utils/mixins'
import VerticalStep from '~/components/VerticalStep'
import StepButton from '~/components/StepButton'

export default {
  components: {
    VerticalStep,
    StepButton
  },
  mixins: [postCreation],
  data () {
    return {
      name: '',
      hasName: false,
      id: '',
      hasId: false,
      isExisted: false,
      isLoading: false
    }
  },
  computed: {
    ...mapState(['barcode', 'companyInfo']),
    allowNext () {
      return this.name
    }
  },
  watch: {
    name () {
      this.updateCompany()
    },
    id () {
      this.updateCompany()
    }
  },
  created () {
    if (this.companyInfo) {
      // init data from store once to handle `prev page`
      this.name = this.companyInfo.name
      this.id = this.companyInfo.id
    } else {
      this.getCompany()
    }
  },
  methods: {
    updateCompany () {
      if (this.name) {
        this.$store.commit(MUTATIONS.SET_COMPANY, {
          name: this.name,
          id: this.id
        })
      }
    },
    async crawlCompany () {
      const params = {
        headers: {
          Authorization: `Bearer ${this.$auth.token}`
        }
      }
      const barcode = encodeURIComponent(this.barcode)
      const endpoint = `${process.env.COMPANY_API_ENDPOINT}/grocery/${barcode}`
      let resp = null
      try {
        resp = await this.$axios.get(endpoint, params)
      } catch (err) {
        alert('無法取得公司資訊，請重新掃描條碼')
        this.$router.push('/create-item/scan')
        console.error(err)
        return false
      }
      if (!resp.data.success) {
        console.error(`Crawl company failed because ${resp.data.reason}`)
        return false
      }
      const data = resp.data.data
      this.name = data.name
      this.id = data.id
      this.$store.commit(MUTATIONS.SET_COMPANY, data)
      return true
    },
    async getCacheCompany () {
      const barcode = encodeURIComponent(this.barcode)
      const endpoint = `${process.env.META_API_ENDPOINT}/json/product/${barcode}`
      const key = this.$auth.user[process.env.META_API_KEY]
      let netR = null
      try {
        netR = await this.$axios.get(endpoint, {
          headers: {
            'x-thaubing-api-key': key
          }
        })
      } catch (err) {
        alert('無法取得公司資訊，請重新掃描條碼')
        this.$router.push('/create-item/scan')
        console.error(err)
        return false
      }
      if (!netR.data) {
        return false
      }
      const data = netR.data
      const corpId = data.corp_id
      const corpName = data.corp_name

      if (!corpId || !corpName) {
        return false
      }

      this.id = corpId
      this.name = corpName
      this.$store.commit(MUTATIONS.SET_COMPANY, {
        id: corpId,
        name: corpName
      })

      return true
    },
    async getCompany () {
      this.isLoading = true
      this.isExisted = await this.getCacheCompany()
      if (this.isExisted) {
        this.isLoading = false
        return
      }
      await this.crawlCompany()
      this.hasName = !!this.name
      this.hasId = !!this.id

      if (!this.hasName || !this.hasId) {
        alert('網路上找不到公司資訊\n請幫我手動輸入～\n＼(◎o◎)／！')
      }

      this.isLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
$labelWidth: 5.5rem;
.company {
  &__label {
    width: $labelWidth;
    color: gray;
  }
  &__value {
    width: calc(100% - #{$labelWidth});
  }
}
</style>
