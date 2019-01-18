<template lang="pug">
  xt-dialog(:title="type === 'edit' ? '编辑' + title : '新增' + title " ref="editDialog" :autoclose="autoclose" @confirm="$refs.xtForm.submit()")
    xt-form(@submit="onSubmit" :formList="formList" ref="xtForm" :maxlength="maxlength")
</template>
<script>
import xtDialog from '../xt-dialog'
import xtForm from '../xt-form'
export default {
  name: 'xt-editDialog',
  components: {
    xtDialog,
    xtForm
  },
  props: {
    title: {
      type: String,
      default: '表单'
    },
    formList: {
      type: Array,
      required: true
    },
    maxlength: {
      type: Number,
      default: 20
    },
    autoclose:{
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      type: 'create', // create 新建 || edit 编辑
    }
  },
  methods: {
    open (row) {
      this.$refs.editDialog.open()
      if (row) {
        this.type = 'edit'
        this.$nextTick(() => {
          this.$refs.xtForm.setForm(row)
        })
      } else {
        this.type = 'create'
        this.$nextTick(() => {
          this.$refs.xtForm.reset()
        })
      }
    },
    onSubmit (form, valid) {
      if (valid) {
        this.$emit('submit', this.type, form)
        if (this.autoclose) {
          this.$refs.editDialog.handleClose()
        }
      }
    },
    handleClose () {
      this.$refs.editDialog.handleClose()
    }
  }
}
</script>
<style lang="scss" scoped>
.xt-editDialog{
  padding: 0;
}
</style>

