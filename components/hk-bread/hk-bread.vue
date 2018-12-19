<template lang="pug">
  el-breadcrumb.hk-bread(separator-class="el-icon-arrow-right")
    el-breadcrumb-item(v-for="item in list" :key="item.label" :to="item.link" style="font-size:14px;") {{ item.label }}
</template>

<script>
export default {
  name: 'hk-bread',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss">
.hk-bread {
  top: 30px;
  left: 20px;
  font-size: 14px;
  z-index: 10;
  position: absolute;
  .el-breadcrumb__inner {
    &.is-link {
      font-weight: normal;
      cursor: pointer;
    }
  }
}
</style>
