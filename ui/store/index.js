// import { sample } from '~/utils/definition'

export const MUTATIONS = {
  SET_BARCODE: 'setBarcode',
  SET_COMPANY: 'setCompany',
  SET_NAME: 'setName',
  SET_CAT: 'setCat',
  SET_COVER: 'setCover',
  SET_DETAIL: 'setDetail',
  RESET_ITEM: 'resetItem',
  SET_MANUAL_MODE: 'setManualMode'
}

const FORCE_MANUAL_KEY = 'gcaa_force_manual'

const DEFAULT_STATE = {
  barcode: '',
  companyInfo: null,
  itemName: '',
  mainCat: '',
  subCat: '',
  coverImage: '',
  detailImage: '',
  forceManual: () => {
    return localStorage.getItem(FORCE_MANUAL_KEY) === 'true'
  }
}

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
  return ret
}

export const state = () => {
  return genInitState()
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
  }
}
