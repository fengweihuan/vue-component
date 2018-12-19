<template lang="pug">
  el-dialog(
    :title="title"
    :visible="dialog"
    :before-close="handleClose"
    :width="width"
  )
    slot
    <span slot="footer" class="dialog-footer" v-show="showfooter">
      hk-button( class="dialog-footer-cancel" type="normal" v-if="showClose" @click="handleClose") 取 消
      hk-button( class="dialog-footer-sure" @click="handleConfirm" :loading="loading") 确 定
    </span>
</template>

<script>
export default {
  name: 'hk-dialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    showClose: {
      type: Boolean,
      default: true
    },
    value: {
      type: Boolean,
      default: false
    },
    showfooter: {
      type: Boolean,
      default: true
    },
    autoclose: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '510px'
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  watch: {
    value: {
      handler (value) {
        this.dialog = value
      },
      immediate: true
    }
  },
  methods: {
    open () {
      this.dialog = true
    },
    handleClose () {
      if (this.loading) return
      this.dialog = false
      this.$emit('input', this.dialog)
      this.$emit('close')
    },
    handleConfirm () {
      if (this.autoclose) {
        this.$emit('input', this.dialog)
        this.handleClose()
      }
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="scss">
.el-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #dddddd;
    .el-dialog__title {
      color: #333333;
    }
  }
  .el-dialog__body {
    color: #333333;
  }
  .dialog-footer {
    .dialog-footer-cancel {
      width: 118px;
      height: 32px;
      border-radius: 4px;
      color: #333333;
      border: solid 1px #e8f0f7;
      // background-color: #2a2f55;
    }
    .dialog-footer-sure {
      width: 118px;
      height: 32px;
      border-radius: 4px;
      color: #ffffff;
      border: none;
    }
  }
}
</style>
