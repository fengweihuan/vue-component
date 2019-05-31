<template>
  <el-dialog
    :title="title"
    :visible="dialog"
    :width="width"
    v-bind="$attrs"
    :top="device === 'mobile' ? '30px' : '15vh'"
    :before-close="handleClose">
    <slot></slot>
    <!-- <div slot="title" class="dialog_title">
      <span class="ban"></span>
      <span>{{title}}</span>
    </div> -->
    <span slot="footer" class="dialog-footer" v-show="showfooter">
      <el-button class="dialog-footer-cancel" :size="size" @click="handleClose" v-if="hasCancle">{{ cancleText }}</el-button>
      <el-button type="primary" class="dialog-footer-sure" :size="size" @click="handleConfirm" :loading="loading">{{ confirmText }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'xt-dialog',
  computed: {
    ...mapGetters(['device'])
  },
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
      default: '520px'
    },
    size: {
      type: String,
      default: 'small'
    },
    hasCancle: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: '确 定'
    },
    cancleText: {
      type: String,
      default: '取 消'
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
      this.$emit('close')
      this.dialog = false
    },
    handleConfirm () {
      if (this.autoclose) {
        // this.$emit('input', this.dialog)
        this.handleClose()
      }
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="scss">
.el-dialog {
  max-width: 94%;
  margin-bottom: 30px;
  .el-dialog__header {
    border-bottom: 1px solid #dddddd;
    padding-top: 10px;
    // position: relative;
    // &:after{
    //   position: absolute;
    //   content: "";
    //   display: inline-block;
    //   width: 100%;
    //   height: 6px;
    //   background-color: #303133;
    //   border-top-left-radius: 2px;
    //   border-top-right-radius: 2px;
    //   left: 0;
    //   top: 0;
    // }
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
      border-radius: 4px;
      color: #333333;
      border: solid 1px #e8f0f7;
      // background-color: #2a2f55;
    }
    .dialog-footer-sure {
      width: 118px;
      border-radius: 4px;
      color: #ffffff;
      border: none;
    }
  }
}
</style>