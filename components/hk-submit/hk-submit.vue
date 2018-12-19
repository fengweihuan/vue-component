<template lang="pug">
  hk-button(
    type="primary"
    icon="el-icon-search"
    @click="handleClick"
  ) 查询
</template>

<script>
export default {
  name: 'hk-submit',
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>
