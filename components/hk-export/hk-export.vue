<template lang="pug">
  el-button.hekr-btn(:size="size" :type="type" icon="iconfont icon-daochu" v-bind="$attrs" @click="handleClick")
    slot
      span(style="margin-left:6px;") 导出表格
</template>

<script>
import server from '@/service/server'
import qs from 'qs'
import store from '@/store'
export default {
  name: 'hk-export',
  props: {
    path: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  methods: {
    handleClick () {
      let token = store.getters.token
      let params = {
        ...this.params,
        Authorization: `Bearer` + token.access_token
      }
      let queryStr = qs.stringify(params)
      const src = `${server.air.url}${this.path}?${queryStr}`
      this.clickLink(src, this.params)
    },
    clickLink (src, p) {
      console.log('下载地址', src)
      console.log('导出参数', p)
      const oA = document.createElement('a')
      oA.href = src
      oA.click()
    }
  }
}
</script>
