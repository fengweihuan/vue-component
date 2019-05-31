<template lang="pug">
  el-pagination.xt-pagination(
    :background="true"
    :total="totals"
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
  name: 'xt-pagination',
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
  computed: {
    totals () {
      return this.total == 0 ? 1 : this.total
    }
  },
  data () {
    return {
      pageSize: 100,
      currentPage: 1
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
      if (this.totals && this.pageSize && currentPage) {
        if (Math.ceil(this.totals / this.pageSize)  < currentPage) return false
      }
      this.currentPage = currentPage
      this.$emit('change', { page: this.currentPage, pageSize: this.pageSize })
    }
  }
}
</script>

<style lang="scss">
.xt-pagination {
  margin: 10px;
  text-align: right;
}
</style>