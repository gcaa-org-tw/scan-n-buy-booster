<template lang="pug">
  vertical-step.editname.pa3
    template(slot="head")
      .gray 第 ➂ 步
      h1.f3.mt0 填寫產品名稱與分類
    div
      .bb.b--green.mv2.pv1
        input.w-100.bw0(type="text" v-model.trim="name" placeholder="產品名稱")
      div(:class="{disabled: !name}" @click="showTips")
        .mv2
          select.w-100.pv1(v-model="mainCat" :disabled="!name")
            option(value="" disabled) 請選擇主分類
            option(v-for="cat in mainCatList" :value="cat") {{cat}}
        .mv2(v-if="hasSubCat")
          select.w-100.pv1(v-model="subCat" :disabled="!name")
            option(value="" disabled) 請選擇次分類
            option(v-for="cat in subCatList" :value="cat") {{cat}}
    .flex(slot="tail")
      .w-50.pr2
        step-button(
          to="/create-item/confirm-company"
        ) 上一步
      .w-50.pl2
        step-button(
          :primary="true"
          :disabled="!allowNext"
          to="/create-item/cover-photo"
        ) 下一步
</template>
<script>
import { postCreation } from '~/utils/mixins'
import { CATEGORIES } from '~/utils/definition'
import { MUTATIONS } from '~/store'
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
      mainCatList: Object.keys(CATEGORIES),
      allSubCatList: CATEGORIES,
      mainCat: this.$store.state.mainCat,
      subCat: this.$store.state.subCat,
      name: this.$store.state.itemName
    }
  },
  computed: {
    allowNext () {
      if (!this.mainCat || !this.name) {
        return false
      } else if (this.subCat) {
        return true
      } else {
        // allow next if we got mainCat that doesn't has any subCat option
        return !this.hasSubCat
      }
    },
    subCatList () {
      return this.allSubCatList[this.mainCat] || []
    },
    hasSubCat () {
      return this.subCatList.length > 0
    }
  },
  watch: {
    name () {
      this.updateName()
    },
    mainCat () {
      this.updateCat()
    },
    subCat () {
      this.updateCat()
    }
  },
  methods: {
    showTips () {
      if (!this.name) {
        alert('請先填寫產品名稱')
      }
    },
    updateName () {
      if (this.name) {
        this.$store.commit(MUTATIONS.SET_NAME, this.name)
      }
    },
    updateCat () {
      if (!this.mainCat) {
        return
      }
      if (!this.hasSubCat) {
        this.$store.commit(MUTATIONS.SET_CAT, {
          mainCat: this.mainCat,
          subCat: null
        })
      } else if (this.subCatList.includes(this.subCat)) {
        this.$store.commit(MUTATIONS.SET_CAT, {
          mainCat: this.mainCat,
          subCat: this.subCat
        })
      } else {
        this.subCat = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.editname {
  .disabled {
    > div {
      opacity: 0.5;
      pointer-events: none;
    }
  }
}
</style>
