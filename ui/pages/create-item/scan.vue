<template lang="pug">
  vertical-step.scan.pa3
    template(slot="head")
      .gray 第 ➀ 步
      h1.f3.mt0 掃描產品條碼
    div(v-if="cameras.length || !hasNoCamera")
      video.bg-moon-gray.w-100(ref="barcodeVideo" :class="{disabled: barcode}")
      .truncate.pa2.mv2.bb.b--green 條碼：{{barcode || '等待掃描中...'}}
      .flex
        .w-50.pr2
          select.h-100.w-100(
            v-model="targetCameraId"
            :disabled="onlyOnyCamera"
            :class="{forbid: onlyOnyCamera}"
          )
            option(v-for="camera in cameras" :value="camera.id") {{camera.label}}
        .w-50.pl2
          button.ba.gold.bg-white.b--gold.pv2.ph3.w-100.br2(
            @click="startScanOnce"
            :disabled="isOnScan"
            :class="{pointer: !isOnScan, forbid: isOnScan}"
          ) 重新掃描
    div(v-else)
      h2.tc 找不到相機，請詢問工作人員 ⊙﹏⊙
    template(slot="tail")
      button.green.ba.br2.bg-white.b--green.ph3.pv2.tc.w-100(
        @click="nextPage"
        :disabled="!barcode"
        :class="{pointer: barcode, forbid: !barcode}"
      ) 下一步
</template>
<script>
import { BrowserBarcodeReader } from '@zxing/library/esm5'
import { MUTATIONS } from '~/store'
import VerticalStep from '~/components/VerticalStep'

const DEFAULT_CAMERA_KEY = 'default_camera_session_key'

export default {
  components: {
    VerticalStep
  },
  data () {
    return {
      codeReader: new BrowserBarcodeReader(),
      cameras: [],
      targetCameraId: null,
      noDefaultCamera: false,
      hasNoCamera: false,
      isOnScan: false,
      barcode: ''
    }
  },
  computed: {
    onlyOnyCamera () {
      return this.cameras.length < 2
    }
  },
  watch: {
    targetCameraId (newId) {
      localStorage.setItem(DEFAULT_CAMERA_KEY, newId)
      this.startScanOnce()
    }
  },
  async created () {
    // TODO: if no camera? handle permission
    const videoInputDevices = await this.codeReader.getVideoInputDevices()
    console.log('devices: ', videoInputDevices)
    this.cameras = videoInputDevices.map((dev) => {
      return {
        label: dev.label,
        id: dev.deviceId
      }
    })

    if (this.cameras.length < 1) {
      this.hasNoCamera = true
      return
    }

    if (this.cameras.length === 1) {
      this.targetCameraId = this.cameras[0].id
    } else {
      const defaultCamera = localStorage.getItem(DEFAULT_CAMERA_KEY, '')
      const defaultInTarget = this.cameras.find(camera => camera.id === defaultCamera)
      if (defaultInTarget) {
        this.targetCameraId = defaultInTarget
      } else {
        // ask user to select a camera
        this.noDefaultCamera = true
      }
    }
  },
  beforeDestroy () {
    this.codeReader.reset()
  },
  methods: {
    nextPage () {
      if (this.barcode) {
        this.$store.commit(MUTATIONS.SET_BARCODE, this.barcode.trim())
        this.$router.push('/create-item/confirm-company')
      }
    },
    async startScanOnce () {
      if (!this.targetCameraId) {
        return
      }
      this.isOnScan = true
      this.barcode = ''
      try {
        const result = await this.codeReader.decodeOnceFromVideoDevice(
          this.targetCameraId,
          this.$refs.barcodeVideo
        )
        this.barcode = result.text
      } catch (err) {
        console.error(err)
        if (err.name === 'NotAllowedError') {
          const toRefresh = confirm('請允許我用相機掃條碼 ⊙﹏⊙')
          if (toRefresh) {
            this.startScanOnce()
          }
        }
      } finally {
        this.isOnScan = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.scan {
  video {
    height: 40vh;

    &.disabled {
      opacity: 0.3;
    }
  }
  .forbid {
    cursor: not-allowed;
  }
}
</style>
