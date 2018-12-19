<template lang="pug">
  .hk-table(v-loading="isLoading")
    el-table(
      :data="data"
      @selection-change="handleSelectionChange"
    )
      el-table-column(
        ref="cell"
        v-for="column in columns"
        :key="column.key"
        :prop="column.key"
        :width="column.width"
        :min-width="column.minWidth"
        :type="column.type"
        :label="column.title"
        :formatter="column.format"
        :fixed="column.fixed"
        :align="column.align"
      )
    hk-pagination(:total="total" :page="pages" @change="handleChange")
</template>

<script>

const clearEmpty = (params) => {
  let temp = {}
  for (let key in params) {
    let value = params[key]
    if (value !== undefined && value !== null && value !== '') {
      temp[key] = value
    }
  }
  return temp
}

export default {
  name: 'hk-table',
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    api: {
      type: Function
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    number: {
      type: Number,
      default: 0
    },
    autoload: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 0,
      size: 10,
      total: 0,
      status: 'pass',
      data: [],
      selection: []
    }
  },
  mounted () {
    this.autoload && this.getData()
    this.renderCell()
  },
  computed: {
    isLoading () {
      return this.status === 'loading'
    },
    pages () {
      return this.page + 1
    }
  },
  methods: {
    renderCell () {
      let h = this.$createElement
      this.columns.filter(item => item.isShow !== false).forEach((cell, i) => {
        if (typeof cell.render === 'function') {
          this.$refs.cell[i].columnConfig.renderCell = (createElement, params) => {
            return h('div', {
              class: 'cell'
            }, [
                cell.render(h, params)
              ])
          }
        }
      })
    },
    getData () {
      if (typeof this.api === 'function') {
        let { size, page } = this
        let params = {
          page: page + this.number,
          size: size,
          ...clearEmpty(this.params)
        }
        this.status = 'loading'
        this.api(params).then(data => {
          this.total = data.totalElements
          this.data = data.content || []
          this.status = 'pass'
        }, () => {
          this.status = 'pass'
        })
      }
    },
    handleChange (data) {
      this.page = data.page - 1
      this.size = data.size
      this.$emit('change', { page: data.page, size: data.size })
      this.getData()
    },
    refresh (page = 0) {
      this.page = page
      this.getData()
    },
    handleSelectionChange (selection) {
      this.selection = selection
    },
    getSelection () {
      return this.selection
    }
  }
}
</script>
<style lang="scss">
.hk-table {
  .el-table {
    th:first-child,
    td:first-child,
    th:last-child,
    td:last-child {
      padding: 0 10px;
    }
  }
}
</style>
