<template lang="pug">
  el-button.hekr-countdown(
    :size="size"
    type=" "
    :class="isIndent ? 'isindetn' : 'noindent'"
    v-bind="$attrs"
    @click="getIndentCode"
  )
    slot
      span {{ indentText }}
</template>

<script>
import dayjs from 'dayjs'
import server from '@/service/server'
import request from '@/service/request'
import { regRule } from '@/assets/utils/validate.js'
export default {
  name: 'hk-countdown',
  data () {
    return {
      indentText: '获取验证码',
      isIndent: false
    }
  },
  props: {
    type: {
      type: String,
      default: 'resetPassword'
    },
    path: {
      type: String,
      default: '/sms/getVerifyCode'
    },
    storageName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: [String, Number],
      required: true
    },
    duration: {
      type: Number,
      default: 60
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  created () {
    // 获取倒计时是否存在
    let timing = window.localStorage.getItem(this.storageName)
    if (timing) {
      let num = this.duration - (dayjs().diff(dayjs(timing - 0)) / 1000)
      if (num > 0 && num <= this.duration) {
        this.$emit('hastiming')
        this.startTiming(num)
      } else {
        window.localStorage.removeItem(this.storageName)
      }
    }
  },
  methods: {
    getIndentCode () {
      if (this.isIndent) return false
       const src = `${server.uaa.url}${this.path}`
       if (!this.phoneNumber) {
         this.$message({
           type: 'warning',
           message: '请先填写手机号码！'
         })
         return false
       } else if (!regRule.mobile.test(this.phoneNumber)) {
         this.$message({
           type: 'warning',
           message: '请填写正确的手机号码！'
         })
         return false
      }
      let params = {
        phoneNumber: this.phoneNumber,
        pid: '01718454679',
        type: this.type
      }
      request.get(src, { params }).then(res => {
        this.startTiming()
        this.$success('验证码已发送至您的手机，请注意查看！')
      }).catch((error) => {
        if (error.response.data.code === 3400008) {
          this.$error(error.response.data.desc)
        } else {
          this.$error('获取验证码失败！')
        }
      })
    },
    // 倒计时开始
    startTiming (num) {
      this.isIndent = true
      let timing = window.localStorage.getItem(this.storageName)
      if (!timing) window.localStorage.setItem(this.storageName, dayjs().valueOf())
      if (this.timer) window.clearInterval(this.timer)
      let currentnum = Math.round(num) < 10 ? '0' + Math.round(num) : Math.round(num)
      this.indentText = num > 0 ? currentnum : this.duration
      this.timer = window.setInterval(() => {
        if (this.indentText < 1) {
          this.isIndent = false
          window.clearInterval(this.timer)
          window.localStorage.removeItem(this.storageName)
          this.indentText = '获取验证码'
        } else {
          this.indentText -= 1
          if (this.indentText < 10) this.indentText = '0' + this.indentText
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
.hekr-countdown{
  margin-left:30px;
  width: 100px;
  &.noindent, &:hover.noindent, &:focus.noindent{
    color:#fff;
    background:#6b7d91;
    border-color: #6b7d91;
  }
  &.isindetn{
    background-color: #e5e2e2;
    color: #999999
  }
}
</style>
