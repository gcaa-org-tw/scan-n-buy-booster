<template lang="pug">
  vertical-step.category.pa3
    template(slot="head")
      .gray 第 ➂ 步
      h1.f3.mt0 選擇產品分類
    .flex(slot="tail")
      .w-50.pr2
        step-button(
          to="/create-item/confirm-company"
        ) 上一步
      .w-50.pl2
        step-button(
          to="/create-item/cover-photo"
          :primary="true"
        ) 下一步
</template>
<script>
import VerticalStep from '~/components/VerticalStep'
import StepButton from '~/components/StepButton'

export default {
  components: {
    VerticalStep,
    StepButton
  }
}
</script>
