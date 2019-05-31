<template lang="pug">
  el-popover(
    :width="width" 
    placement="right-start"
    v-show="popoverData.length > 0"
    :trigger="trigger" 
    :popper-options="options" 
    :popper-class="popperId + ' my-popper'" 
    :visible-arrow="false" v-model="visible"
  )
    .popover_wrap
      .header(v-if="title && title.length > 0") {{title}}
      .popover_content
        .popover_item(
          v-for="(item, index) in popoverData"
          :key="index"
          :class="item.disabled ? 'disabled' : ''"
          @click="clickHandle(item)"
        )   
            el-popover(
              v-if="item.children && item.children.length > 0 && childrenVisible"
              placement="right-start"
              :width="width"
              trigger="hover"
            )  
              .popover_wrap(@click="childrenHidden")
                .popover_content
                  .popover_item(v-for="(list, ind) in item.children" :key="ind" :class="list.disabled ? 'disabled' : ''" @click="clickHandle(list)") 
                    span {{list.label}}
              div(slot="reference" class="popover_childer")
                span(class="right_icon iconfont icon-arrfill")
            //- 递归循环组件 有点问题 先不要用 ┭┮﹏┭┮    
             <popover-childer 
              v-if="item.children && item.children.length > 0"
              :childrenData="item.children"
              :width="width"
            //- ></popover-childer>  
            span {{item.label}}
    span(slot="reference" ref="refDiv" style="position:fixed;")
</template>

<script>
import popoverChilder from './popover-children.vue'
export default {
  name: 'xt-popover',
  components: {
    popoverChilder
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 150
    },
    trigger: {
      type: String,
      default: 'manual'
    },
    popoverData: {
      type: Array,
      required: true,
      default: []
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    popperId: {        //单个页面引入多个该组件时需要给一个 唯一性的id标识
      type: String,
      default: 'popper1'
    }
  },
  data () {
    return {
      visible: false,
      childrenVisible: true,
      translateX: 0,
      translateY: 0,
      placement: 'right-start',
      options: { boundariesElement: 'body', gpuAcceleration: false }
    }
  },
  mounted () {
    document.addEventListener('click', (e) => {
      if (this.autoClose) this.visible = false
    })
  },
  methods: {
    show (e) {
      this.visible = false
      this.$refs.refDiv.style.left = e.clientX + 'px'
      this.$refs.refDiv.style.top = e.clientY + 'px'
      let translateX = document.body.clientWidth - e.x - this.width
      let translateY = document.body.clientHeight - e.y - this.popoverData.length * 34 - 36
      this.translateX = translateX < 0 ? translateX : 0
      this.translateY = translateY < 0 ? translateY : 0
      let dom = document.querySelectorAll('.my-popper.' + this.popperId)
      Array.from(dom).map(item => {
        if (this.translateX < 0 || this.translateY < 0) {
          item.style.transform = `translateX(${this.translateX}px) translateY(${this.translateY}px)`
        } else {
          item.style.transform = `translateX(0px) translateY(0px)`
        }
        
      })
      this.$nextTick(() => {
        this.translateY = 0
        this.translateX = 0
        this.visible = true
      })
    },
    hide () {
      this.visible = false
    },
    clickHandle (row) {
      if (row.disabled) return false
      if (this.autoClose) {
          this.visible = false
        }
      // if (row.click && typeof row.click === 'function') {
      //   row.click()
      // }
      this.$emit('clickItem', row)
    },
    childrenHidden () {
      this.childrenVisible = false
      this.$nextTick(() => {
        this.childrenVisible = true
      })
    }
  }
}
</script>
<style lang="scss">
.el-popover{
  padding: 0 ;
  margin: 0 !important;
}
.popover_wrap{
  .header,.popover_item{
    color: #999999;
    height: 32px;
    line-height: 32px;
    text-align: center;
    padding: 0 12px;
    position: relative;
  }
  .right_icon{
    position: absolute;
    display: inline-block;
    right: 0px;
    font-size: 12px;
    color: #999999;
  }
  .popover_childer{
    position: absolute;
    left: 0;
    height: 100%;
    right: 12px;
    top: 0;
  }
  .header{
    border-bottom: 1px solid #e7e7e7;
  }
  .popover_item{
    &:hover{
      background-color: #f5f5f7;
      color: #409eff
    }
    &.disabled{
      background-color: #ffffff;
      color: #c0c4cc;
      cursor: not-allowed;
      &:hover{
        background-color: #ffffff;
        color: #c0c4cc;
      }
    }
    height: 34px;
    line-height: 34px;
    color: #606266;
    cursor: pointer;
  }
}
</style>