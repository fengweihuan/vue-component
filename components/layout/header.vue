<template lang="pug">
  .app-header
    .app-top
      .item.logo
      .item.user-info
        DropDown()
    AppNav(:mode="true")
</template>
<script>
import AppNav from './nav'
import DropDown from './dropdown'
export default {
  name: 'Header',
  components: {
    AppNav,
    DropDown
  },
  data () {
    return {}
  }
}
</script>
<style lang="scss">
@import "~@/assets/scss/var.scss";
  .app-header {
    position: fixed;
    width: 100%;
    min-width: 1300px;
    top: 0;
    height: 110px;
    background-color: $color-bg;
    z-index: 123;
    .app-top {
      display: flex;
      justify-content: space-between;
      height: 50px;
      padding: 5px 40px;
      background-color: $white;
      .item {
        height: 100%;
        display: inline-block;
        vertical-align: middle;
      }
      .logo {
        width: 120px;
        background: url('~@/assets/images/logo.png') center center no-repeat;
      }
    }
  }
</style>
