<template lang="pug">
  iViewForm(
    ref="form"
    lib="elememt"
    v-bind="$attrs"
    :notCtrl="notCtrl"
    :formList="formList"
    :options="currOption"
    @submit="handleSubmit"
  )
</template>
<script>
import iViewForm from 'iview-form'
export default {
  name: 'hk-form',
  components: {
    iViewForm
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formList: {
      type: Array,
      default: () => {
        return []
      }
    },
    notCtrl: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    currOption () {
      let options = {
        size: 'small'
      }
      return Object.assign(options, this.options)
    }
  },
  methods: {
    handleSubmit () {
      this.$emit('submit', ...arguments)
    },
    getFormBykey () {
      return this.$refs.form.getFormBykey(...arguments)
    },
    clear () {
      return this.$refs.form.clear()
    },
    reset () {
      return this.$refs.form.reset()
    },
    getForm () {
      return this.$refs.form.getForm()
    },
    setForm () {
      return this.$refs.form.setForm(...arguments)
    },
    submit () {
      return this.$refs.form.submit()
    }
  },
  mounted () {
    // console.log(this.formList)
  }
}
</script>

<style lang="scss">
.search {
  display: inline-block;
  vertical-align: middle;
  .el-form-item__label {
    width: auto !important;
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
