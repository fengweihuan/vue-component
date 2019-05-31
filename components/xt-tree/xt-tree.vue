<template lang="pug">
  .xt-tree
    .role_header(v-if="hasHeader")
      span.role_item {{title}}
      .header_detail(v-show="config")
        span.tree_item(v-for="(item, index) in config" :key="index") {{item.name}}
    .tree_wrap(:style="{height}")
      el-scrollbar(style="height:100%")
        el-tree.el-tree(
          ref="elTree"
          :data="data"
          v-bind="$attrs"
          :props="{children, label}"
          @node-contextmenu="contextmenuTree"
          @node-click="clickTree"
          @node-drop="nodeDrop"
          :node-key="nodeKey"
          @node-drag-start="dragStart"
          :allow-drop="allowDrop"
        )
          .tree_lists(slot-scope="{ node, data }" :data-id="data.id")
            span.tree_name {{data[label]}}
            .detail(v-show="config")
              span.tree_list(v-for="(list, index) in config" :key="index") {{data[list.code]}}
    XtPopover(
      ref="popover"
      :popoverData="popoverData"
      @clickItem="clickHandle"
    )
</template>
<script>
import { regroupTree } from '@/utils'
import XtPopover from '../xt-popover'
export default {
  components: {
    XtPopover
  },
  name: 'xt-tree',
  data() {
    return {
      currentTree: undefined, //当前右键选中的Tree 子集
      dragData: undefined
    }
  },
  props: {
    config: {
      type: Array,
      default: undefined
    },
    title: {
      type: String,
      default: ''
    },
    hasHeader: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      require: true
    },
    popoverData: {
      type: Array,
      required: true
    },
    dragVis: {
      type: Boolean,
      default: true
    },
    children: {
      type: String,
      default: 'child'
    },
    label: {
      type: String,
      default: 'name'
    },
    height: {
      type: String,
      default: 'calc(100vh - 120px)'
    },
    nodeKey: {
      type: String,
      default: 'id'
    }
  },
  methods: {
    clickHandle(row) {
      row.click && row.click(this.currentTree)
    },
    contextmenuTree(event, data, node) {
      this.currentTree = node
      this.$emit('node-contextmenu', event, data, node)
      this.$refs.popover.show(event)
    },
    setTreeId (item, _id) {
      item.map(list => {
        list._id = _id + ',' + list[this.label]
        if (list.child && list.child.length > 0) {
          this.setTreeId(list.child, list._id)
        }
      })
    },
    clickTree (data) {
      this.currentTree = undefined
      this.$refs.popover && this.$refs.popover.hide()
    },
    dragStart () {
      this.dragData = JSON.parse(JSON.stringify(this.data))
    },
    allowDrop (draggingNode, dropNode, type) {
      return dropNode.parent.id === draggingNode.parent.id && type !== 'inner'
    },
    nodeDrop (node, parent, position) {
      this.$confirm('确定移动吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.$emit('nodeDrop')
      }).catch(() => {
        this.$emit('update:data', this.dragData)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.xt-tree{
  .tree_lists,
  .role_header {
    display: flex;
    width: 100%;
    position: relative;
    height: 26px;
    line-height: 26px;
  }
  .role_header {
    height: 38px;
    background-color: #ffffff;
    color: #909399;
    font-weight: 500;
    font-size: 14px;
    line-height: 38px;
    font-size: 16px;
    border-bottom: 1px solid #ebeef5;
    .role_item{
      text-align: center;
      margin-left: 60px;
    }
  }
  .tree_list,.tree_item{
    flex: 1;
    text-align: center;
    padding: 0 5px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tree_lists{
    .tree_name {
      width: calc(100% - 60vw);
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .tree_lists:after{
    content: '';
    display: inline-block;
    position: absolute;
    left: -36px;
    height: 100%;
    right: 0;
  }
  .detail,
  .header_detail {
    display: flex;
    width: 60vw;
    position: absolute;
    right: 0;
    top: 0;
    justify-content: space-around;
  }
  .tree_wrap{
    // height: calc(100vh - 120px);
  }
}
</style>

