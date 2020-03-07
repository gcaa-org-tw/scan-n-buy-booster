<template lang="pug">
  vertical-step.cover.pa3
    template(slot="head")
      .gray 第 ➃ 步
      h1.f3.mt0 拍攝產品正面
    .flex(slot="tail")
      .w-50.pr2
        step-button(
          to="/create-item/set-name-category"
        ) 上一步
      .w-50.pl2
        step-button(
          :primary="true"
        ) 下一步
</template>
<script>
import { postCreation } from '~/utils/mixins'
import VerticalStep from '~/components/VerticalStep'
import StepButton from '~/components/StepButton'

export default {
  components: {
    VerticalStep,
    StepButton
  },
  mixins: [postCreation]
}
</script>
