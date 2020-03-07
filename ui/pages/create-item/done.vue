<template lang="pug">
  .done
    h1 Done!
</template>
<script>
import { postCreation } from '~/utils/mixins'
export default {
  mixins: [postCreation]
}
</script>
