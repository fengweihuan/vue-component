<template lang="pug">
  .hk-nav
    .page
      .nav-item(
        v-for="nav in navList"
        v-if="nav.hidden !== true"
        :class="nav | active(currName)"
        :key="nav.path"
        @click="jumpNav(nav)"
      )
        span {{ nav.meta.title }}
        .dropdown(
          v-if="nav.children"
        )
          .item(
            v-for="item in nav.children"
            :class="item | active(currName)"
            :key="item.path"
            @click.stop="jumpNav(item)"
          ) {{ item.meta.title }}
</template>

<script>
import { navRouter } from '@/router/index'
export default {
  data () {
    return {
      navList: navRouter
    }
  },
  filters: {
    active (nav, name) {
      let classList = []
      if (name && name.indexOf(nav.name) >= 0) {
        classList.push('active')
      }
      return classList
    }
  },
  computed: {
    currName () {
      let { $route } = this
      return $route ? $route.name : ''
    }
  },
  methods: {
    jumpNav (nav) {
      this.$router.push(nav.path)
    }
  }
}
</script>

<style lang="scss">
@import "~@/assets/scss/var";
.hk-nav {
  top: 50px;
  width: 100%;
  height: 60px;
  z-index: 1;
  color: #fff;
  background-color: #1f2e54;
  position: fixed;
  .page {
    height: 100%;
    display: flex;
    overflow: unset;
  }
}
.nav-item {
  padding: 0 2%;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  white-space: nowrap;
  &.active {
    background-image: linear-gradient(bottom, rgba(1, 59, 141, .38), rgba(77, 138, 247, .08));
    &::after {
      content: '';
      bottom: 0;
      width: 100%;
      height: 4px;
      background-color: $primary;
      position: absolute;
    }
  }
  &:hover {
    .dropdown {
      display: block;
    }
  }
  .dropdown {
    top: 100%;
    width: 100%;
    z-index: 1;
    background-color: #3B3B3B;
    position: absolute;
    display: none;
    .item {
      height: 50px;
      border-top: 1px solid #8A92A5;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active {
        color: $primary;
      }
    }
  }
}
</style>
