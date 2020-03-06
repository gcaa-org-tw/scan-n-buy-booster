<template lang="pug">
  vertical-step.scan.pa3
    template(slot="head")
      .gray 第 ➀ 步
      h1.f3.mt0 掃描產品條碼
    div(v-if="cameras.length || !hasNoCamera")
      video.bg-moon-gray.w-100(ref="barcodeVideo" :class="{disabled: barcode}")
      .pa2.mv2.bb.b--green.w-100.flex
        .scan__code-label 條碼：
        .scan__code-input
          .w-100(v-show="!isManual") {{barcode || '等待掃描中...'}}
          input.bw0(
            v-show="isManual"
            ref="input"
            type="text"
            v-model="barcode"
            placeholder="請輸入條碼"
          )
      .flex
        .w-50.pr2
          select.h-100.w-100(
            v-model="targetCameraId"
            :disabled="onlyOnyCamera"
            :class="{forbid: onlyOnyCamera}"
          )
            option(v-for="camera in cameras" :value="camera.id") {{camera.label}}
        .w-50.pl2
          button.ba.gold.bg-white.b--gold.pv2.ph3.w-100.br2.pointer(
            v-show="isOnScan && !isManual"
            @click="typeManually"
          ) 手動輸入
          button.ba.gold.bg-white.b--gold.pv2.ph3.w-100.br2.pointer(
            @click="startScanOnce"
            v-show="!isOnScan || isManual"
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
      isManual: false,
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
    typeManually () {
      this.isManual = true
      this.codeReader.reset()
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
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
      this.isManual = false
      this.isOnScan = true
      this.barcode = ''
      try {
        const result = await this.codeReader.decodeOnceFromVideoDevice(
          this.targetCameraId,
          this.$refs.barcodeVideo
        )
        this.barcode = result.text
      } catch (err) {
        if (err.name === 'NotFoundException') {
          // cancel scan, noop
        } else if (err.name === 'NotAllowedError') {
          const toRefresh = confirm('請允許我用相機掃條碼 ⊙﹏⊙')
          if (toRefresh) {
            this.startScanOnce()
          }
        } else {
          console.error(err)
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
  $labelWidth: 3.5rem;
  &__code-label {
    width: $labelWidth;
  }
  &__code-input {
    width: calc(100% - #{$labelWidth});
  }
}
</style>
