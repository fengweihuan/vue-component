import HkCard from '../hk-card'
import HkTable from '../hk-table'
import HkPagination from '../hk-pagination'
import HkForm from '../hk-form'
import HkButton from '../hk-button'
import HkDialog from '../hk-dialog'
import HkCharts from '../hk-charts'
import HkEditor from '../hk-editor'
import HkSearch from '../hk-search'
import HkDaterange from '../hk-daterange'
import HkSubmit from '../hk-submit'
import HkPreview from '../hk-preview'
import HkBread from '../hk-bread'
import HkSide from '../hk-side'
import HkExport from '../hk-export'
import HkCountdown from '../hk-countdown'
import * as util from './util.js'

export const install = (Vue) => {
  Vue.component(HkCard.name, HkCard)
  Vue.component(HkTable.name, HkTable)
  Vue.component(HkForm.name, HkForm)
  Vue.component(HkButton.name, HkButton)
  Vue.component(HkDialog.name, HkDialog)
  Vue.component(HkCharts.name, HkCharts)
  Vue.component(HkPagination.name, HkPagination)
  Vue.component(HkEditor.name, HkEditor)
  Vue.component(HkSearch.name, HkSearch)
  Vue.component(HkDaterange.name, HkDaterange)
  Vue.component(HkSubmit.name, HkSubmit)
  Vue.component(HkPreview.name, HkPreview)
  Vue.component(HkBread.name, HkBread)
  Vue.component(HkSide.name, HkSide)
  Vue.component(HkExport.name, HkExport)
  Vue.component(HkCountdown.name, HkCountdown)

  Vue.prototype.$info = (msg, title = '提示') => util.notify({ title: title, msg: msg, type: 'info' })
  Vue.prototype.$success = (msg, title = '成功') => util.notify({ title: title, msg: msg, type: 'success' })
  Vue.prototype.$warning = (msg, title = '警告') => util.notify({ title: title, msg: msg, type: 'warning' })
  Vue.prototype.$error = (msg, title = '错误') => util.notify({ title: title, msg: msg, type: 'error' })

  Vue.prototype.$formatDate = (value, format) => util.formatDate(value, format)

  Vue.filter('datetime', (value) => util.formatDate(value, 'YYYY-MM-DD HH:mm'))
  Vue.filter('date', (value) => util.formatDate(value, 'YYYY-MM-DD'))
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  HkCard,
  HkTable,
  HkForm,
  HkButton,
  HkDialog,
  HkCharts,
  HkEditor,
  HkSearch,
  HkDaterange,
  HkSubmit,
  HkPreview,
  HkSide,
  HkExport,
  HkCountdown
}

export default install
