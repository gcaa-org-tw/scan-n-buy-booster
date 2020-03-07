export const postCreation = {
  created () {
    if (!this.$store.state.barcode) {
      this.$router.push('/create-item/scan')
    }
  }
}
