<template lang="pug"> 
  .xt-export
    el-button.export-btn(
      :size="size"
      :type="type"
      icon="el-icon-download"
      v-bind="$attrs"
      @click="handleClick")
      slot
        span(style="margin-left:10px;") {{ text }}
</template>
<script>
import qs from 'qs'
import store from '@/store'
import server from '@/server'
import request from '@/utils/request'
export default {
  name: 'xt-export',
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
    text: {
      type: String,
      default: '导出'
    },
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'small'
    },
    beforeExoprt: {
      type: Function
    }
  },
  methods: {
    handleClick () {
      if (!this.beforeExoprt) {
        this.done()
      } else {
        this.beforeExoprt(this.done)
      }
    },
    done () {
      let token = store.getters.token
      let params = {
        ...this.params,
        token
      }
      const type = this.path.split('!')[0]
      const url = this.path.split('!')[1]
      const queryStr = qs.stringify(params)
      if (type === 'data') {        
        request({
          url: this.path,
          methods: 'get',
          params: this.params
        }).then(res => {
          if (res.code === 0 && res.result.url.length > 0) {
            let src = server.fileUrl + res.result.url
            this.clickLink(src, this.params)
          }
        })
      } else {
        const src = server[type] + url + '?' + queryStr
        this.clickLink(src, this.params)
      }
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
<style lang="scss" scoped>
.xt-export{
  margin-left:10px;
}
</style>

