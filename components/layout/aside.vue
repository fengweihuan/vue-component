<template lang="pug">
  .app-aside(:class="{isCollapse}")
    .app-aside-top(@click="toggleCollapse")
      i.el-icon-more(v-if="isCollapse")
      img.item.logo(v-else src="../../assets/images/logo.png")
    AppNav(:mode="false", :collapse="isCollapse" :class="{isCollapse}")
</template>
<script>
import AppNav from './nav'
export default {
  name: 'Aside',
  components: {
    AppNav
  },
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    // 切换大小视图
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style lang="scss">
@import "~@/assets/scss/var.scss";
.app-aside {
  width: 192px;
  height: 100%;
  background-color: $bg-dark;
  display: flex;
  flex-direction: column;
  .app-aside-top {
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    background-color: #ffffff;
    cursor: pointer;
    .item {
      display: inline-block;
      vertical-align: middle;
    }
    .logo {
      cursor: pointer;
    }
  }
  .app-aside-bottom {
    padding: 15px;
    display: flex;
    justify-content: center;
    .item {
      height: 100%;
      display: inline-block;
      vertical-align: middle;
    }
  }
  &.isCollapse {
    width: 64px;
  }
}
</style>
