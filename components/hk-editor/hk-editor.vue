<template lang="pug">
  tinymce(v-model="currValue" @input="handleInput" :id="id" :other_options="options" @editorInit="handleInit")
</template>

<script>
import tinymce from 'vue-tinymce-editor'
import './zh_CN.js'

export default {
  name: 'hk-editor',
  components: {
    tinymce
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: 'hk-editor'
    },
    height: {
      type: Number,
      default: 500
    }
  },
  data () {
    return {
      currValue: '',
      options: {
        language: 'zh_CN',
        skin: 'lightgray',
        height: this.height
      }
    }
  },
  watch: {
    value (value) {
      this.currValue = value
    }
  },
  methods: {
    handleInit () {
      this.currValue = this.value
    },
    handleInput (value) {
      this.$emit('input', value)
    }
  }
}
</script>
