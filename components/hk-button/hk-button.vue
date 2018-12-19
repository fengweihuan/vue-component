<template lang="pug">
  el-button.hk-button(:size="size" :type="type" v-bind="$attrs" @click="handleClick")
    slot
</template>

<script>
export default {
  name: 'hk-button',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'small'
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
.hk-button {
  min-width: 100px;
  .iconfont {
    margin-right: 6px;
  }
}
</style>
