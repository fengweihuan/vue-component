<template lang="pug">
  .xt-tree
    .role_header
      span.role_item {{title}}
      .header_detail
        span.tree_item(v-for="(item, index) in config" :key="index") {{item.name}}
    .tree_wrap
      el-scrollbar(style="height:100%")
        el-tree.el-tree(
          ref="roleTree"
          :data="treeData"
          default-expand-all
          v-bind="$attrs"
          @node-contextmenu="contextmenuTree"
          @node-click="clickTree"
          @node-drop="nodeDrop"
          node-key="id"
        )
          .tree_lists(slot-scope="{ node, data }" :data-id="data.id")
            span.tree_name {{data.menuname}}
            .detail
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
    }
  },
  props: {
    config: {
      require: true,
      default: []
    },
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      require: true
    },
    popoverData: {
      type: Array,
      required: true
    }
  },
  computed: {
    treeData () {
      return regroupTree(this.data)
    }
  },
  methods: {
    clickHandle(row) {
      row.click && row.click(this.currentTree)
    },
    contextmenuTree(event, data) {
      this.currentTree = data
      this.$refs.popover.show(event)
    },
    clickTree (data) {
      this.currentTree = undefined
      this.$refs.popover && this.$refs.popover.hide()
    },
    nodeDrop (node, parent, position) {
      let json = {}
      this.$nextTick(() => {
        let treeLists = document.querySelectorAll('.tree_lists')
        Array.from(treeLists).map((item, index) => {
          json[item.dataset.id] = index
        })
        let id = node.key
        let parentid = parent.data.parentid
        if (parent.childNodes.length === 1 && parent.childNodes[0].key === node.key) {
          parentid = parent.key
        }
        this.$emit('nodeDrop', JSON.stringify(json), id, parentid)
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
      width: calc(100% - 60vw)
      // flex: 1;
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
    height: calc(100vh - 120px);
  }
}
</style>

