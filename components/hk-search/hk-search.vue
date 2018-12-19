
<script>
export const getDefaultValue = (type = 'month') => {
  let d = new Date()
  let year = d.getFullYear()
  let month = d.getMonth()
  let day = d.getDate()
  let date = []
  switch (type) {
    case 'week':
      date = [+new Date(year, month, day - 7), +new Date(year, month, day)]
      break
    case 'month':
      date = [+new Date(year, month - 1, day), +new Date(year, month, day)]
      break
  }
  return date
}

// let clearEmpty = (form) => {
//   for (let key in form) {
//     let value = form[key]
//     if (value === '' || value === null || value === undefined) {
//       delete form[key]
//     }
//   }
//   return form
// }

export default {
  name: 'hk-search',
  props: {
    searchList: {
      type: Array,
      default: () => []
    },
    enterSubmit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        date: null
      }
    }
  },
  created () {
    // this.getDateDafaultValue()
  },
  render (h) {
    return (
      <div class="hk-search row">
        {
          this.searchList.map(row => {
            let content
            if (row.type === 'hk-form') {
              content = this.renderForm(row)
            } else if (row.type === 'daterange' || row.type === 'datetimerange') {
              content = this.renderDaterage(row)
            } else {
              content = this.renderList(row)
            }
            return (
              <div class="hk-search-row">
                <div class="hk-search-content">{content}</div>
              </div>
            )
          })
        }
      </div>
    )
  },
  methods: {
    getDateDafaultValue () {
      let arr = ['daterange', 'datetimerange']
      let target = this.searchList.find(row => arr.includes(row.type))
      this.form.date = Array.isArray(target.defaultValue) ? target.defaultValue : getDefaultValue(target.defaultValue)
    },
    renderForm (row) {
      let options = {
        inline: true
      }
      return <div>
        <hk-form formList={row.children} options={options} enterSubmit={this.enterSubmit} contentWidth={'auto'} ref="form" clearable={row.clearable}></hk-form>
        <hk-submit onClick={() => this.handleSubmit()}></hk-submit>
        {this.$slots.default}
      </div>
    },
    renderList (row) {
      return (
        <div class="hk-search-item">
          {
            row.children.map(item => {
              return item.render()
            })
          }
        </div>
      )
    },
    renderDaterage (row) {
      return <hk-daterange type={row.type} v-model={this.form.date}></hk-daterange>
    },
    getForm () {
      return {
        ...this.form,
        ...this.$refs.form.getForm()
      }
    },
    getParams () {
      // let form = this.form
      // let [startDate, endDate] = form.date
      let params = {
        // startDate,
        // endDate,
        ...this.$refs.form.getForm()
      }
      return params
    },
    handleSubmit () {
      this.$emit('submit', this.getParams())
    }
  }
}
</script>

<style lang="scss">
@import "./hk-search";
</style>
