<template lang="pug">
  .dropdown-page
    el-dropdown(:placement="placement")
      .dropdown-title
        .img
          img(v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl")
          span(v-else) {{userName}}
        .name
          .name-avatar  {{role}}
          p {{userInfo.name}}
        i(:class="iconClass")
      el-dropdown-menu(slot="dropdown")
        //- el-dropdown-item
        //-   div(@click="showDialogHandle") 修改密码
        el-dropdown-item
          div(@click="loginOutHandle") 退出登录
    EditDialog(v-model="showDialog")
</template>
<script>
import EditDialog from './edit-dialog'
import { mapGetters } from 'vuex'
export default {
  name: 'DropDown',
  components: { EditDialog },
  data () {
    return {
      showDialog: false,
      userName: '',
      role: '超级管理员'
    }
  },
  props: {
    placement: {
      type: String,
      default: 'bottom'
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    iconClass () {
      return this.placement === 'bottom' ? 'el-icon-caret-bottom' : 'el-icon-caret-top'
    }
  },
  mounted () {
    this.userName = this.userInfo.name
    if (this.userInfo.role[0] === '5c0a34103e2fb076c4a244b6') {
      this.role = '管理员'
    } else if (this.userInfo.role[0] === '5c0a34203e2fb076c4a244b7') {
      this.role = '一级代理商'
    } else if (this.userInfo.role[0] === '5c0a342b3e2fb076c4a244b8') {
      this.role = '二级代理商'
    } else {
      this.role = '超级管理员'
    }
    // this.userInfo.avatar = 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=4056478083,2728781085&fm=27&gp=0.jpg'
  },
  methods: {
    loginOutHandle () {
      this.$store.dispatch('LogOut').then(() => {
        // this.$router.replace('/login')
        location.reload()
      })
    },
    showDialogHandle () {
      this.showDialog = true
    }
  }
}
</script>
<style lang="scss">
@import "~@/assets/scss/var.scss";
.dropdown-page {
  line-height: 40px;
  .dropdown-title {
    cursor: pointer;
    display: inline-block;
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
    align-items: center;
    .name {
      display: inline-block;
      .name-avatar {
        line-height: 20px;
        padding: 0px 5px;
        width: 80px;
        text-align: center;
        color: #ffffff;
        background-image: linear-gradient(45deg, #f5a623 0%, #df43ea 100%);
        border-radius: 12px;
      }
      p {
        line-height: 26px;
        color: #333333;
      }
    }
    .img {
      display: inline-block;
      width: 40px;
      height: 40px;
      margin-right: 10px;
      line-height: 40px;
      text-align: center;
      border-radius: 50%;
      vertical-align: middle;
      overflow: hidden;
      background-color: $primary;
      img {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
      span {
        margin: 0;
        width: 100%;
        height: 100%;
        color: $white;
        font-size: 18px;
      }
      .el-icon--right {
        font-size: 16px;
      }
    }
    span {
      font-size: 12px;
    }
  }
}
</style>
