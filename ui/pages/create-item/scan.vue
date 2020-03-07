<template lang="pug">
  vertical-step.scan.pa3
    template(slot="head")
      .gray 第 ➀ 步
      h1.f3.mt0 掃描產品條碼
    div(v-if="cameras.length || !hasNoCamera")
      button.ba.br2.b--silver.pv2.ph3.mb2.w-100.silver.bg-white(@click="toggleForceManual") {{manualSwitcherText}}
      div(v-if="noDefaultCamera")
        .mb3.lh-copy
          | 請幫我選一個鏡頭
          .gray 別擔心，之後可以隨時更改
        select(
          v-model="targetCameraId"
        )
          option(v-for="camera in cameras" :value="camera.id") {{camera.label}}
      div(v-else)
        video.bg-moon-gray.w-100(ref="barcodeVideo" :class="{disabled: barcode}")
        .pa2.mv2.bb.b--green.w-100.flex
          .scan__code-label 條碼：
          .scan__code-input
            .w-100(v-show="!isManual") {{barcode || '等待掃描中...'}}
            input.bw0.w-100(
              v-show="isManual"
              ref="input"
              type="text"
              inputmode="numeric"
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
      step-button(
        to="/create-item/confirm-company"
        :disabled="!barcode"
        :primary="true"
      ) 下一步
</template>
<script>
import { BrowserBarcodeReader } from '@zxing/library/esm5'
import { mapState } from 'vuex'
import { MUTATIONS } from '~/store'
import VerticalStep from '~/components/VerticalStep'
import StepButton from '~/components/StepButton'

const DEFAULT_CAMERA_KEY = 'gcaa_camera_session_key'
const STRANGE_DETECTION_TIMEOUT = 1000

export default {
  components: {
    VerticalStep,
    StepButton
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
      barcode: '',
      detectorTimeout: null
    }
  },
  computed: {
    ...mapState(['forceManual']),
    onlyOnyCamera () {
      return this.cameras.length < 2
    },
    canForceManual () {
      // somehow Safari fall into this state without error...
      return !this.isManual && !this.isOnScan
    },
    manualSwitcherText () {
      if (this.forceManual) {
        return '切換為半自動模式'
      } else {
        return '切換為純手動模式'
      }
    }
  },
  watch: {
    targetCameraId (newId) {
      this.noDefaultCamera = false
      localStorage.setItem(DEFAULT_CAMERA_KEY, newId)
      this.startScanOnce()
    },
    barcode (newVal) {
      this.$store.commit(MUTATIONS.SET_BARCODE, newVal.trim())
    }
  },
  async created () {
    this.$store.commit(MUTATIONS.RESET_ITEM)
    // TODO: if no camera? handle permission
    const videoInputDevices = await this.codeReader.getVideoInputDevices()
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
        this.targetCameraId = defaultInTarget.id
      } else {
        // ask user to select a camera
        this.noDefaultCamera = true
      }
    }
  },
  beforeDestroy () {
    this.codeReader.reset()
    clearTimeout(this.detectorTimeout)
  },
  methods: {
    typeManually () {
      this.isManual = true
      this.codeReader.reset()
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    toggleForceManual () {
      if (!this.forceManual) {
        this.typeManually()
      } else {
        this.startScanOnce()
      }

      this.$store.commit(MUTATIONS.SET_MANUAL_MODE, !this.forceManual)
    },
    detectNeedManual () {
      this.detectorTimeout = setTimeout(() => {
        if (this.canForceManual) {
          const accept = confirm('我沒辦法找到相機，可以幫忙切換成手動模式嗎？\n(◕‿◕)')
          if (accept) {
            this.toggleForceManual()
          }
        }
      }, STRANGE_DETECTION_TIMEOUT)
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
          console.error('Camera not found')
        } else if (err.name === 'NotAllowedError') {
          // TODO: add photo upload fall back..
          alert('我沒辦法打開相機，請手動輸入 ⊙﹏⊙')
        } else {
          console.error(err)
        }
        this.typeManually()
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
