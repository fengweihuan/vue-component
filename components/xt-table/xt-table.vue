<template lang="pug">
  .xt-table
    el-table(
      ref="table"
      :data="tableData"
      v-bind="$attrs"
      v-on="$listeners"
      v-loadmore="loadmore"
    )
      slot
</template>
<script>
export default {
  name: 'xt-table',
  computed: {
    tableData () {
      let arr = []
      this.pageData.map((item, index) => {
        if (index <= this.currentPage) {
          arr.push(...item)
        }
      })
      return arr
    }
  },
  data () {
    return {
      currentPage: 0,
      pageData: [],
      hasMultipleSelection: false
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    pageSize: {
      type: Number,
      default: 30
    },
    multipleSelection: {
      type: Array,
      default: undefined
    }
  },
  created () {
    this.setPaging()
  },
  watch: {
    data (value) {
      this.setPaging()
    }
  },
  methods: {
    // 设置分页 
    setPaging () {
      this.currentPage = 0
      if (this.data && this.data.length > 0) {
        this.pageData = this.chunk(this.data, this.pageSize)
      } else {
        this.pageData = []
      }
    },
    // 滚动翻页
    loadmore () {
      if (this.pageData.length > this.currentPage) {
        let arr = [].concat(this.multipleSelection) || []
        this.hasMultipleSelection = arr.length > 0
        this.currentPage ++
        this.$emit('changePage', this.currentPage)
        if (arr.length > 0){
          this.$nextTick(() => {
            arr.map(item => {
              this.$refs.table.toggleRowSelection(item, true)
            })
          })
        }
      }
    },
    chunk (arr, size) {
      let arr1 = []
      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i = i + size) {
          let arr2 = arr
          arr1.push(arr2.slice(i, i + size))
        }
      }
      return arr1
    }
  }
}
</script>

<style lang="scss">
.xt-table {
  padding:  0;
}
</style>


