<template lang="pug">
  el-pagination.hk-pagination(
    :background="true"
    :total="total"
    :page-size="pageSize"
    :current-page="page"
    layout="sizes, prev, pager, next"
    @prev-click="handlePrevClick"
    @next-click="handleNextClick"
    @size-change="handleSizeChange"
    @current-change="handleCurrChange"
  )
</template>

<script>
export default {
  name: 'hk-pagination',
  props: {
    total: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      defualt: 1
    }
  },
  data () {
    return {
      pageSize: 10
    }
  },
  methods: {
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.change(this.currentPage)
    },
    handlePrevClick (currentPage) {
      this.change(currentPage)
    },
    handleNextClick (currentPage) {
      this.change(currentPage)
    },
    handleCurrChange (currentPage) {
      this.change(currentPage)
    },
    change (currentPage) {
      this.currentPage = currentPage
      this.$emit('change', { page: this.currentPage, size: this.pageSize })
    }
  }
}
</script>

<style lang="scss">
.hk-pagination {
  margin: 10px;
  text-align: right;
}
</style>
