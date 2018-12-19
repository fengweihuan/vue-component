<template lang="pug">
  //- 处理弹框
  el-dialog(custom-class="hekr-dialog", :title="dialogTitle", :visible="value", width="500px", :close-on-click-modal="false",
  :append-to-body="true" @close="closeDialog", @open="openDialog")
    el-form.hekr-form.password-form(ref="form", :model="data", :rules="rules", label-width="100px")
      el-form-item(label="旧密码", prop="oldPassword")
        el-input(size="small", type="password", v-model="data.oldPassword")
      el-form-item(label="新密码", prop="newPassword")
        el-input(size="small", type="password", v-model="data.newPassword")
      el-form-item(label="确认新密码", prop="checkPassword")
        el-input(size="small", type="password", v-model="data.checkPassword")
    .hekr-dialog-footer(slot="footer")
      el-button.hekr-btn(size="small", @click="closeDialog") 取消
      el-button.hekr-btn(:loading="btnLoading", type="success" size="small" :disabled="btnLoading", @click="postHandle") 保存
</template>
<script>
import mixinsDialog from '@/mixins/dialog'
import { validate } from '@/assets/utils/validate'
export default {
  name: 'PasswordDialog',
  mixins: [mixinsDialog],
  data () {
    const validatePass2 = (rule, value, callback) => {
      if (value !== this.data.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      initRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { validator: validate.password, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validate.password, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogTitle () {
      return '修改密码'
    }
  },
  watch: {
    infos () {
      this.data = Object.assign({}, this.infos)
    }
  },
  mounted () {
  },
  methods: {
    // 设置处理params
    setParams (data) {
      let params = {
        username: this.userInfo.phone,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      }
      return params
    },
    postHandle () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.btnPasswordLoading = true
          let params = this.setParams(this.data)
          this.$api.updatePasswordApi(params).then(response => {
            this.postMsg('修改成功')
          }).catch(({ response }) => {
            if (response.data.code === 3400007) {
              this.$message({
                type: 'error',
                message: '密码错误，请重新输入',
                duration: 1000
              })
            }
            setTimeout(() => {
              this.btnPasswordLoading = false
            }, 1000)
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.hekr-dialog {
  background-color: #2a2f55 !important;
  .el-dialog__body {
    .el-form-item__label {
      color: #fff;
    }
  }
}
</style>
