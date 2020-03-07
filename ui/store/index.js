import { sample } from '~/utils/definition'

export const MUTATIONS = {
  SET_BARCODE: 'setBarcode',
  SET_COMPANY: 'setCompany',
  SET_NAME: 'setName',
  SET_CAT: 'setCat',
  SET_COVER: 'setCover',
  SET_DETAIL: 'setDetail',
  RESET_ITEM: 'resetItem'
}

const DEFAULT_STATE = {
  // barcode: '',
  // companyInfo: null,
  // itemName: '',
  // mainCat: '',
  // subCat: '',
  // coverImage: '',
  // detailImage: ''
  barcode: '12345',
  mainCat: 'ddio-不要不要的主分類',
  subCat: 'ddio-拉拉拉的次分類',
  itemName: 'ddio-第一家鹹酥雞',
  companyInfo: { id: '123456', name: 'ddio-測試公司' },
  coverImage: sample.cover,
  detailImage: sample.detail
}

export const state = () => {
  return {
    ...DEFAULT_STATE
  }
}

export const mutations = {
  [MUTATIONS.SET_BARCODE] (state, barcode) {
    state.barcode = barcode
  },
  [MUTATIONS.SET_COMPANY] (state, companyInfo) {
    if (companyInfo.id && companyInfo.name) {
      state.companyInfo = companyInfo
    } else {
      console.error('Invalid company info', companyInfo)
    }
  },
  [MUTATIONS.SET_NAME] (state, itemName) {
    state.itemName = itemName
  },
  [MUTATIONS.SET_CAT] (state, { mainCat, subCat }) {
    state.mainCat = mainCat
    state.subCat = subCat
  },
  [MUTATIONS.SET_COVER] (state, coverImage) {
    state.coverImage = coverImage
  },
  [MUTATIONS.SET_DETAIL] (state, detailImage) {
    state.detailImage = detailImage
  },
  [MUTATIONS.RESET_ITEM] (state) {
    Object.keys(DEFAULT_STATE, (key) => {
      state[key] = DEFAULT_STATE[key]
    })
  }
}
