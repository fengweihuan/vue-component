<template lang="pug">
.app-wrapper
  Aside
  Main(:mode="isTopLayout")
</template>

<script>
import Aside from './aside'
import Main from './main'

export default {
  name: 'layout',
  components: {
    Aside,
    Main
  },
  data () {
    return {
      // 切换布局是否是顶部导航(true)或侧部导航(false)
      isTopLayout: false
    }
  }
}
</script>

<style lang="scss">
.app-wrapper {
  min-width: 1300px;
  height: 100%;
  display: flex;
}
</style>
