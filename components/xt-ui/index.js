import XtDialog from '../xt-dialog'
import XtPopover from '../xt-popover'
import XtUpload from '../xt-upload'
import XtForm from '../xt-form'
import XtPagination from '../xt-pagination'
import XtTree from '../xt-tree'
import XtDaterange from '../xt-daterange'
import XtSearch from '../xt-search'
import XtEditDialog from '../xt-editDialog'
import XtDragDialog from '../xt-dragDialog'
import XtExport from '../xt-export'
import XtScene from '../xt-scene'
import XtTable from '../xt-table'
import XtCharts from '../xt-charts'
import * as util from './util.js'

export const install = (Vue) => {
  Vue.component(XtDialog.name, XtDialog)
  Vue.component(XtPopover.name, XtPopover)
  Vue.component(XtUpload.name, XtUpload)
  Vue.component(XtForm.name, XtForm)
  Vue.component(XtPagination.name, XtPagination)
  Vue.component(XtTree.name, XtTree)
  Vue.component(XtDaterange.name, XtDaterange)
  Vue.component(XtSearch.name, XtSearch)
  Vue.component(XtEditDialog.name, XtEditDialog)
  Vue.component(XtDragDialog.name, XtDragDialog)
  Vue.component(XtExport.name, XtExport)
  Vue.component(XtScene.name, XtScene)
  Vue.component(XtTable.name, XtTable)
  Vue.component(XtCharts.name, XtCharts)
  Vue.prototype.$info = (msg, title = '提示') => util.notify({ title: title, msg: msg, type: 'info' })
  Vue.prototype.$success = (msg, title = '成功') => util.notify({ title: title, msg: msg, type: 'success' })
  Vue.prototype.$warning = (msg, title = '警告') => util.notify({ title: title, msg: msg, type: 'warning' })
  Vue.prototype.$error = (msg, title = '错误') => util.notify({ title: title, msg: msg, type: 'error' })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  XtDialog,
  XtPopover,
  XtUpload,
  XtForm,
  XtPagination,
  XtTree,
  XtDaterange,
  XtSearch,
  XtEditDialog,
  XtDragDialog,
  XtExport,
  XtScene,
  XtTable,
  XtCharts
}

export default install
