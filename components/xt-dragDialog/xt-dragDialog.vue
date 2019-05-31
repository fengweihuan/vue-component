<template lang="pug">
  transition(name="el-fade-in")
    .drag-dialog(
      v-show="visible"
      :style="{left,top,zIndex}"
      ref="dragDialog"
    )
      .drag_header(
        @mousedown="mousedown($event)"
        :style="{cursor: drag ? 'move' : 'auto'}"
      )
        span.drag_title  {{title || ''}}
        i.el-icon-close(@click="closeHandle")
      .drag_content(:style="{minHeight:height,minWidth:width}")
        slot
      .drag_footer(v-if="hasFooter")
        slot(name="footer")
          el-button(@click="closeHandle" size="small") 取消
          el-button(@click="submitHandle" type="primary" size="small") {{ confirmText }}
</template>
<script>
export default {
  name: 'drag-dialog',
  props: {
    left: {
      type: String,
      default: '20px'
    },
    top: {
      type: String,
      default: '30px'
    },
    width: {
      type: String,
      default: '300px'
    },
    height: {
      type: String,
      default: '200px'
    },
    title: {
      type: String,
      default: ''
    },
    autoColse: {
      type: Boolean,
      default: true
    },
    drag: {
      type: Boolean,
      default: true
    },
    hasFooter:{
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 200
    },
    beforeClose: {
      type: Function
    },
    confirmText: {
      type: String,
      default: '确定'
    }
  },
  data () {
    return {
      visible: false,
      dragStatus: false,
      diffx: 0,
      diffy: 0
    }
  },
  mounted () {
    document.addEventListener('mouseup', (event) => {
      this.dragStatus = false
    })
    document.addEventListener('mousemove', (event) => {
      if (!this.dragStatus || !this.drag) return false
      this.dragMove(event)
    })
  },
  methods: {
    show () {
      this.visible = true
    },
    hide () {
      this.visible = false
    },
    submitHandle () {
      if (this.autoColse) this.visible = false
      this.$emit('submit')
    },
    mousedown (event) {
      const dragDom = this.$refs.dragDialog
      this.diffx = event.clientX - dragDom.offsetLeft
      this.diffy = event.clientY - dragDom.offsetTop
      this.dragStatus = true
    },
    dragMove (event) {
      const dragDom = this.$refs.dragDialog
      const parentDom = dragDom.parentNode
      let left = event.clientX - this.diffx
      let top = event.clientY - this.diffy
      if (left < 0) {
        left = 0
      } else if (left > parentDom.innerWidth-dragDom.offsetWidth) {
        left = parentDom.innerWidth-dragDom.offsetWidth
      }
      if (top < 0) {
        top = 0
      } else if (top > parentDom.innerHeight-dragDom.offsetHeight) {
        top = parentDom.innerHeight-dragDom.offsetHeight
      }
      dragDom.style.left = left + 'px' 
      dragDom.style.top = top + 'px'
    },
    closeHandle () {
      if (this.beforeClose) {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.drag-dialog{
  position: absolute;
  background-color: #fff;
  z-index: 2000;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  overflow: hidden;
  max-width: 84vw;
  .drag_header{
    font-size: 18px;
    height: 38px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    border-bottom: 1px solid #ebebeb; 
    .drag_title{
      flex:1;
    }
    .el-icon-close{
      cursor: pointer;
      position: relative;
      &:after{
        position: absolute;
        content: "";
        left: -10px;
        right: -10px;
        top: -10px;
        bottom: -10px;
      }
    }
  }
  .drag_footer{
    background-color: #fff;
    padding: 10px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #ebebeb; 
  }
}
</style>