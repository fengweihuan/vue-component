<template lang="pug">
  .hk-card
    .hk-card-header(v-if="title" :class="{ fixed: fixed }")
      div {{ title }}
      div
        slot(name="right")
    .hk-card-body(:style="style")
      slot
    .hk-card-footer(v-if="hasFooter")
      slot(name="footer")
</template>

<script>
export default {
  name: 'hk-card',
  props: {
    title: {
      type: String,
      default: ''
    },
    fixed: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'primary'
    },
    padding: {
      type: [Number, String],
      default: 20
    },
    height: {
      type: [Number, String],
      default: 'auto'
    }
  },
  computed: {
    style () {
      let { padding, height } = this
      if (this.title && !this.fixed) height -= 50

      if (typeof padding === 'number') {
        padding += 'px'
      }
      if (typeof height === 'number') {
        height += 'px'
      }
      return {
        height,
        padding
      }
    },
    hasFooter () {
      return this.$slots.footer
    }
  }
}
</script>

<style lang="scss">
@import "~@/assets/scss/var";
.hk-card {
  border-radius: 8px;
  background-color: $bg;
  position: relative;
  overflow: hidden;
  .hk-card-body {
    z-index: 1;
    position: relative;
    overflow: auto;
  }
  .hk-card-header {
    height: $space * 5;
    padding: 0 $space * 2;
    font-weight: bold;
    z-index: 10;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.fixed {
      width: 100%;
      position: absolute;
    }
  }
  .hk-card-footer {
    height: $space * 5;
    padding: 0 $space * 2;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
  }
  .hk-card-bg-parts {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    position: absolute;
  }
}
</style>
