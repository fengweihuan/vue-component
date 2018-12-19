<template lang="pug">
  .app-main(
    :class="getClass"
  )
    hk-header
    transition(
      name="fade"
      mode="out-in"
    )
      router-view
</template>

<script>
import HkHeader from '../hk-header'

export default {
  name: 'AppMain',
  components: {
    HkHeader
  },
  props: {
    mode: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    getClass () {
      return this.mode ? 'is-top' : 'is-left'
    }
  }
}
</script>
<style lang="scss" scoped>
// 主体区域
.app-main {
  flex: 1;
  width: 100%;
  height: 100%;
  padding-top: 80px;
  position: relative;
  &.is-left {
    overflow-y: auto;
    & > div {
      padding: 0 30px;
    }
  }
}
</style>
