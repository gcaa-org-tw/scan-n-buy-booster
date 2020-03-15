<template lang="pug">
  horizontal-step.cover.pa3(:isRightHand="isRightHand")
    template(slot="head")
      .gray 第 {{stepTitle.number}} 步
      h1.f3.mv0 {{stepTitle.title}}
      .mt2.f7.orange(v-show="!isTakingCover")
        | 請拍下可以明確辨識【製造商】資訊的照片
    .cover__photo.w-100.relative.flex.items-center
      video.cover__video.w-100(
        v-if="!forceManual"
        ref="camera"
        autoplay="true"
        :class="{'o-50': isShowingResult, 'o-100': !isShowingResult }"
      )
      .cover__video.absolute.z-1.w-100.h-100.o-50.bg-light-gray.flex.flex-wrap.items-center.justify-center.f4(v-else)
        | 請點旁邊的
        i.fas.fa-camera-retro.mh2
        | 開始拍照或
        button.bg-light-yellow.black.ml2.ba.b--black.pointer.br2.pv2.ph3.f5(@click="enableBrowserCamera")
          | 點此尋找相機
      .cover__result.absolute.top-0.left-0.w-100.h-100.contain.bg-center.bg-white(
        :style="photoStyle"
        :class="{'o-0': !isShowingResult, 'o-100': isShowingResult, 'z-2': isShowingResult }"
      )
        .flex.items-center.justify-center.white.bg-black.o-30.f3.h-100(v-show="isShowingSample")
          | 範例圖片
    template(slot="action")
      .cover__major-action.flex.items-stretch.justify-center
        button.white.bw0.br2.f3(
          v-if="!forceManual || !this.isTakingPhoto || this.isShowingSample"
          :class="majorActionClass"
          @click="clickMajor"
        )
          i.fas(:class="photoTakingIcon")
        div(v-else)
          label.dib.white.bw0.br2.f3.flex.items-center.justify-center.pointer(
            for="native-camera"
            :class="majorActionClass"
          )
            i.fas(:class="photoTakingIcon")
          input.dn(
            id="native-camera"
            type="file"
            accept="image/*"
            capture
            @change="getNativePhoto"
          )
        .dib.ml2(v-show="allowNext && !isTakingPhoto")
          button.white.bw0.br2.f4.cover__major-next.h-100(
            :class="majorActionClass"
            v-show="isTakingCover"
            @click="nextStep"
          ) {{nextStepText}}
      .cover__minor-action.flex.f6
        .w-50.pr1
          button.mb2.ba.silver.b--silver.bg-white.pv1.ph2.w-100.br2.pointer(
            @click="switchHand"
          ) 左右交換
        .w-50.pl1
          button.mb2.ba.silver.b--silver.bg-white.pv1.ph2.w-100.br2.pointer(
            @click="toggleSample"
          ) {{toggleSampleText}}
    .cover__tail(slot="tail")
      .cover__step
        step-button(
          @click="prevStep"
        ) 上一步
      .cover__step
        step-button(
          :primary="true"
          :disabled="!allowNext"
          @click="nextStep"
        ) {{nextStepText}}
</template>
<script>
/**
 * 1. Popup landscape tips if not
 * 2. Show sample image at first time
 */
import CameraPhoto, { FACING_MODES, IMAGE_TYPES } from 'jslib-html5-camera-photo'
import { mapState } from 'vuex'
import Compressor from 'compressorjs'
import { MUTATIONS } from '~/store'
import { postCreation } from '~/utils/mixins'
import HorizontalStep from '~/components/HorizontalStep'
import StepButton from '~/components/StepButton'

const HAND_PREFERENCE_KEY = 'gcaa_hand_preference'
const HAS_ONBOARD_COVER_KEY = 'gcaa_has_cover_key'
const HAS_ONBOARD_DETAIL_KEY = 'gcaa_has_detail_key'

function getBoolStorage (key) {
  return localStorage.getItem(key) === 'true'
}

export default {
  components: {
    HorizontalStep,
    StepButton
  },
  mixins: [postCreation],
  data () {
    return {
      camera: null,
      isTakingCover: true,
      isRightHand: getBoolStorage(HAND_PREFERENCE_KEY),
      showCoverSample: !getBoolStorage(HAS_ONBOARD_COVER_KEY),
      showDetailSample: !getBoolStorage(HAS_ONBOARD_DETAIL_KEY),

      isTakingPhoto: true,
      coverPhoto: '',
      detailPhoto: ''
    }
  },
  computed: {
    ...mapState(['forceManual']),
    photoTakingIcon () {
      return this.isTakingPhoto ? 'fa-camera-retro' : 'fa-sync'
    },
    allowNext () {
      if (this.isTakingCover) {
        return !!this.coverPhoto
      } else {
        return !!this.detailPhoto
      }
    },
    majorActionClass () {
      const className = []
      if (this.isTakingPhoto) {
        className.push('br-pill')
        if (this.isShowingSample) {
          className.push('bg-silver')
        } else {
          className.push('bg-red')
        }
      } else {
        className.push('br2')
        if (this.isShowingSample) {
          className.push('bg-silver')
        } else {
          className.push('bg-gold')
        }
      }
      return className
    },
    stepTitle () {
      if (this.isTakingCover) {
        return {
          number: '➃',
          title: '拍攝產品正面'
        }
      } else {
        return {
          number: '➄',
          title: '拍攝產品標籤'
        }
      }
    },
    isShowingSample () {
      return (this.isTakingCover && this.showCoverSample) ||
          (!this.isTakingCover && this.showDetailSample)
    },
    isShowingResult () {
      return !this.isTakingPhoto || this.isShowingSample
    },
    toggleSampleText () {
      if (this.isTakingPhoto) {
        return this.isShowingSample ? '開始拍照' : '範例照片'
      } else {
        return this.isShowingSample ? '目前照片' : '範例照片'
      }
    },
    photoStyle () {
      let img = ''
      if (this.isTakingCover) {
        if (this.showCoverSample) {
          img = '/imgs/sample_cover.jpg'
        } else {
          img = this.coverPhoto
        }
      } else if (this.showDetailSample) {
        img = '/imgs/sample_detail.jpg'
      } else {
        img = this.detailPhoto
      }
      return {
        backgroundImage: `url("${img}")`
      }
    },
    nextStepText () {
      return this.isTakingCover ? '下一步' : '上傳資料'
    }
  },
  async mounted () {
    if (this.forceManual) {
      // use <input capture> when browser doesn't support camera
      return
    }
    await this.initCamera()
  },
  methods: {
    enableBrowserCamera () {
      this.$store.commit(MUTATIONS.SET_MANUAL_MODE, false)
      this.$nextTick(() => {
        this.initCamera()
      })
    },
    async initCamera () {
      this.camera = new CameraPhoto(this.$refs.camera)
      try {
        await this.camera.startCamera(FACING_MODES.ENVIRONMENT, {
          // expected photo resolution
          width: 1280
        })
      } catch (err) {
        if (err.name === 'NotFoundException' || err.name === 'NotAllowedError') {
          // cancel scan, noop
          this.$store.commit(MUTATIONS.SET_MANUAL_MODE, true)
          alert('我沒辦法打開相機，使用手動模式\n⊙﹏⊙')
        } else {
          console.error(err)
        }
      }
    },
    getNativePhoto (event) {
      const photo = event.target.files[0]
      if (!photo || !photo.type.match('image.*')) {
        return
      }
      const reader = new FileReader()
      reader.onload = (readerEvent) => {
        const dataUrl = readerEvent.target.result
        if (this.isTakingCover) {
          this.coverPhoto = dataUrl
          this.$store.commit(MUTATIONS.SET_COVER, dataUrl)
        } else {
          this.detailPhoto = dataUrl
          this.$store.commit(MUTATIONS.SET_DETAIL, dataUrl)
        }
        this.isTakingPhoto = false
      }
      // eslint-disable-next-line no-new
      new Compressor(photo, {
        quality: 0.8,
        mimeType: 'image/jpeg',
        width: 1280,
        success: (result) => {
          reader.readAsDataURL(result)
        },
        error: (err) => {
          console.error(err.message)
        }
      })
    },
    clickMajor () {
      if (this.isShowingSample) {
        this.toggleSample()
      } else if (this.isTakingPhoto) {
        this.takePhoto()
        this.isTakingPhoto = false
      } else {
        this.isTakingPhoto = true
      }
    },
    takePhoto () {
      const photoConfig = {
        imageType: IMAGE_TYPES.JPG,
        imageCompression: 0.8
      }
      const dataUrl = this.camera.getDataUri(photoConfig)
      if (this.isTakingCover) {
        this.coverPhoto = dataUrl
        this.$store.commit(MUTATIONS.SET_COVER, dataUrl)
      } else {
        this.detailPhoto = dataUrl
        this.$store.commit(MUTATIONS.SET_DETAIL, dataUrl)
      }
    },
    toggleSample () {
      if (this.isTakingCover) {
        this.toggleCoverSample()
      } else {
        this.toggleDetailSample()
      }
    },
    switchHand () {
      this.isRightHand = !this.isRightHand
      localStorage.setItem(HAND_PREFERENCE_KEY, this.isRightHand)
    },
    toggleCoverSample () {
      this.showCoverSample = !this.showCoverSample
      localStorage.setItem(HAS_ONBOARD_COVER_KEY, true)
    },
    toggleDetailSample () {
      this.showDetailSample = !this.showDetailSample
      localStorage.setItem(HAS_ONBOARD_DETAIL_KEY, true)
    },
    prevStep () {
      if (!this.isTakingCover) {
        this.showCoverSample = false
        this.isTakingPhoto = true
        this.isTakingCover = true
      } else {
        this.$router.push('/create-item/set-name-category')
      }
    },
    nextStep () {
      if (this.isTakingCover) {
        this.isTakingPhoto = true
        this.isTakingCover = false
      } else {
        this.$router.push('/create-item/done')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.cover {
  &__photo {
    min-height: 10vh;
  }
  &__video {
    min-height: 10vh;
    max-height: 30vh;
  }
  &__result {
    transition: opacity 200ms ease-in;
  }
  &__major-action {
    margin: 1.5rem 0;
    button,
    label {
      height: 4.5rem;
      width: 4.5rem;
    }
  }
  @media screen and (orientation: portrait) {
    &__tail {
      display: flex;
      .cover__step {
        width: 50%;
        &:first-child {
          padding-right: 0.5rem;
        }
        &:last-child {
          padding-left: 0.5rem;
        }
      }
    }
  }
  @media screen and (orientation: landscape) {
    &__photo {
      height: calc(100vh - 2rem);
    }
    &__video {
      max-height: calc(100vh - 2rem);
    }
    &__tail {
      .cover__step:first-child {
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>
