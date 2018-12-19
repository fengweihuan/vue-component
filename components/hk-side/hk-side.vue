<template lang="pug">
  .hk-side(v-show="dialog" @click.self="handleClose")
    .hk-side-content
      .hk-side-header
        h3 {{ title }}
        i.el-icon-close(@click="handleClose")
      .hk-side-body
        slot
</template>

<script>
export default {
  name: 'hk-side',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
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
@import "~@/assets/scss/index";
.hk-side {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, .2);
  position: fixed;
  .hk-side-content {
    top: 0;
    right: 0;
    width: 660px;
    height: 100%;
    box-shadow: -14px 0px 36px 0px rgba(0, 0, 0, 0.5);
    background-color: $bg;
    position: absolute;
    display: flex;
    flex-direction: column;
    animation: sideContent 300ms;
  }
  .hk-side-header {
    height: 80px;
    padding-left: 20px;
    display: flex;
    background-color: #ffffff;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    h3 {
      font-size: 20px;
      font-weight: normal;
    }
    .el-icon-close {
      width: 80px;
      height: 80px;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
  .hk-side-body {
    padding: 20px;
    overflow: auto;
  }
  @keyframes sideContent {
    0% {
      transform: translateX(100%)
    }
    100% {
      transform: translateX(0)
    }
  }
}
</style>
