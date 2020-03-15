// import { sample } from '~/utils/definition'

export const MUTATIONS = {
  SET_BARCODE: 'setBarcode',
  SET_COMPANY: 'setCompany',
  SET_NAME: 'setName',
  SET_CAT: 'setCat',
  SET_COVER: 'setCover',
  SET_DETAIL: 'setDetail',
  RESET_ITEM: 'resetItem',
  SET_MANUAL_MODE: 'setManualMode',
  ENABLE_MULTIPLE_COMPANY: 'enableMultipleName',
  SET_TOTAL_ITEMS: 'setTotalItems'
}

const FORCE_MANUAL_KEY = 'gcaa_force_manual'

const DEFAULT_STATE = {
  barcode: '',
  companyInfo: null,
  hasMultipleCompany: false,
  itemName: '',
  mainCat: '',
  subCat: '',
  coverImage: '',
  detailImage: '',
  forceManual: () => {
    return localStorage.getItem(FORCE_MANUAL_KEY) === 'true'
  }
}

// DEFAULT_STATE.barcode = '12346'
// DEFAULT_STATE.companyInfo = { id: '123', name: 'com name' }
// DEFAULT_STATE.itemName = 'item name'
// DEFAULT_STATE.mainCat = '其他'
// DEFAULT_STATE.coverImage = 'cc'
// DEFAULT_STATE.detailImage = 'dd'
// DEFAULT_STATE.forceManual = true

function genInitState () {
  const ret = {}
  Object.keys(DEFAULT_STATE).forEach((key) => {
    const val = DEFAULT_STATE[key]
    if (typeof val !== 'function') {
      ret[key] = val
    } else {
      ret[key] = val()
    }
  })
  // no need to reset total item
  return ret
}

export const state = () => {
  const ret = genInitState()
  ret.totalItems = 0
  return ret
}

export const mutations = {
  [MUTATIONS.SET_BARCODE] (state, barcode) {
    state.barcode = barcode
  },
  [MUTATIONS.SET_COMPANY] (state, companyInfo) {
    if (companyInfo.name) {
      state.companyInfo = companyInfo
    } else {
      console.error('Invalid company info', companyInfo)
    }
  },
  [MUTATIONS.ENABLE_MULTIPLE_COMPANY] (state) {
    state.hasMultipleCompany = true
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
    const newState = genInitState()
    Object.keys(newState).forEach((key) => {
      state[key] = newState[key]
    })
  },
  [MUTATIONS.SET_MANUAL_MODE] (state, forceManual) {
    state.forceManual = forceManual
    localStorage.setItem(FORCE_MANUAL_KEY, forceManual)
  },
  [MUTATIONS.SET_TOTAL_ITEMS] (state, total) {
    state.totalItems = total
  }
}
