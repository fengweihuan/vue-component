<template lang="pug">
  el-popover(placement="right-start" :width="width" v-model="visible" :visible-arrow="false" trigger="hover")
    .popover_wrap(@mouseover="$emit('showVisible')" @mouseout="$emit('hideVisible')")
      .popover_content
        .popover_item(v-for="(list, ind) in childrenData" :key="ind" :class="list.disabled ? 'disabled' : ''" @click="clickHandle(list)")
          popover-children(v-if="list.children && list.children.length > 0" :width="width" :childrenData="list.children" @showVisible="showVisible") 
          span {{list.label}}
    div(slot="reference" class="popover_childer")
      span(class="right_icon iconfont icon-arrfill")
      .right_gap
</template>
<script>
export default {
  name: 'popover-children',
  props: {
    childrenData: {
      type: Array,
      default: []
    },
    width: {
      type: Number,
      default: 150
    },
  },
  watch: {
    visible (val) {
      this.visible = this.currentVis
      // if (!val && !this.currentVis) {
      //   this.visible = false
      // } else {
      //   this.visible = true
      // }
      console.log('我是检测到变化')
    }
  },
  data () {
    return {
      visible: false,
      currentVis: false
    }
  },
  methods: {
    showVisible () {
      console.log('显示上一级')
      // this.visible = true
      this.currentVis = true
      this.$emit('showVisible')
    },
    hideVisible () {
      console.log('隐藏下一级')
      // this.currentVis = false
      this.$emit('hideVisible')
    }
  }
}
</script>
<style lang="scss" scoped>
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

