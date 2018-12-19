<template lang="pug">
  .hk-header
    span
    dropdown
</template>

<script>
import Avatar from 'vue-avatar'
import { mapGetters, mapActions } from 'vuex'
import dropdown from '../layout/dropdown'

export default {
  name: 'hk-header',
  components: {
    Avatar,
    dropdown
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapActions(['LogOut']),
    jumpHomePage () {
      this.$router.push('/survey')
    },
    handleLogOut () {
      this.$confirm('退出登录', '提示', { type: 'info' }).then(() => {
        this.LogOut().then(() => {
          this.$router.replace('/login')
        })
      }, () => {})
    }
  }
}
</script>

<style lang="scss">
.hk-header {
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  color: #333333;
  background-color: #ffffff;
  z-index: 1;
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-dropdown {
    color: #333333;
  }
}
</style>
